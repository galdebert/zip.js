/* global Blob */
// @ts-check

import { getConfiguration } from "../../lib/core/configuration.js";

// eslint-disable-next-line no-console
export const console_log = console.log;

/**
 *
 * @typedef {import("../../index.js")} Zipdotjs
 *
 * @typedef {import("../../index").BlobReader} BlobReader
 * @typedef {import("../../index").BlobWriter} BlobWriter
 * @typedef {import("../../index").Uint8ArrayReader} Uint8ArrayReader
 * @typedef {import("../../index").Uint8ArrayWriter} Uint8ArrayWriter
 * @typedef {import("../../index").Configuration} Configuration
 *
 * @typedef {{
 *   inputType: 'Uint8Array'|'Blob'|undefined,
 *   outputType: 'Uint8Array'|'Blob'|undefined,
 *   name: string,
 *   entrySize: (idx: number) => number,
 *   entryCount: number,
 *   useWebWorkers: boolean,
 *   concurrency: number,
 *   useCompressionStream: boolean,
 *   chunkSize: number|undefined,
 *   level: number|undefined,
 *   keepOrder: boolean,
 *   bufferedWrite: boolean,
 *   unzip: boolean
 * }} TestCase
 *
 * @typedef {{name: string; data: Uint8Array|Blob}} Input
 *
 * @typedef {{
 *   zipdotjs: typeof import("../../index.js"),
 * }} TestCfg
 */

//--------------------------------------------------------------------------------------------------
const TestCase = {
	/** @param {TestCase} testCase */
	check: (testCase) => {
		if (testCase.useCompressionStream) {
			if (testCase.level !== 6) {
				throw new Error(
					"testCase.useCompressionStream and testCase.level!=6 are incompatible",
				);
			}
			if (testCase.chunkSize !== undefined) {
				console_log(
					"WARNING: chunkSize is ignored when useCompressionStream=true",
				);
			}
		}

		if (testCase.useWebWorkers) {
			if (typeof globalThis.Worker === "undefined") {
				throw new Error(
					"testCase.useWebWorkers=true but globalThis.Worker is undefined",
				);
			}
		}
	},

	/** @param {TestCase} testCase */
	toStr: (testCase) => {
		const nat = testCase.useCompressionStream.toString().padEnd(5);
		const use = testCase.useWebWorkers.toString().padEnd(5);
		const con = testCase.concurrency.toString().padStart(2);
		return `${testCase.name} useCompressionStream=${nat} useWebWorkers=${use} concurrency=${con}`;
	},

	/** @param {TestCase} testCase */
	toStr_concur_only: (testCase) => {

		const con = testCase.concurrency.toString().padStart(2);
		return `${testCase.name} concurrency = ${con}`;
	},

};

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {TestCase[]} testCases
 * @param {string[]} log
 * @return Promise<void>
 */
export async function testPerf(zipdotjs, testCases, log) {

	for (const testCase of testCases) {
		TestCase.check(testCase);

		/** @type {Input[]} */
		const inputs = [];
		for (let i = 0; i < testCase.entryCount; i++) {
			const byteSize = testCase.entrySize(i);
			inputs.push({
				name: `entry #${i + 1}`,
				data: getBlobOrU8(byteSize, testCase.inputType),
			});
		}

		const zip_t0 = Date.now();
		const zipped = await zip(zipdotjs, testCase, inputs);
		const zip_dt = Date.now() - zip_t0;
		const zip_sec = (zip_dt / 1000).toFixed(2);

		if (!testCase.unzip) {
			const result = `${TestCase.toStr_concur_only(testCase)}   zip = ${zip_sec} s`;
			log.push(result);
			continue;
		}

		let zippedByteLength = 0;
		if (zipped instanceof Uint8Array) {
			zippedByteLength = zipped.byteLength;
		}

		const unzip_t0 = Date.now();
		const outputs = await unzip(zipdotjs, testCase, zipped);
		const unzip_dt = Date.now() - unzip_t0;

		if (outputs.length != inputs.length) {
			throw new Error("Unzipped entry count mismatch");
		}

		const unzip_sec = (unzip_dt / 1000).toFixed(2);
		const zippedMiB = (zippedByteLength / (1024 * 1024)).toFixed(2);
		const result = `${TestCase.toStr_concur_only(testCase)}   zip = ${zip_sec} s   unzip = ${unzip_sec} s   size = ${zippedMiB} MiB`;
		log.push(result);
	}
}

//--------------------------------------------------------------------------------------------------
// How to use Web Workers on Node.js ?
// https://github.com/gildas-lormeau/zip.js/discussions/635
export async function setupWebWorkerOnNodejs() {
	if (typeof globalThis.Worker === "undefined") {
		try {
			const Worker = await import("web-worker");
			globalThis.Worker = Worker?.default ?? Worker;
		} catch (err) {
			console_log(`Failed to import web-worker: ${err}`);
			throw err;
		}
	}
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {TestCase} testCase
 * @param {Input[]} inputs
 */
async function zip(zipdotjs, testCase, inputs) {
	configure(zipdotjs, testCase);

	const zipWriter = new zipdotjs.ZipWriter(
		createWriter(zipdotjs, testCase.outputType),
		{
			level: testCase.level,
			keepOrder: testCase.keepOrder,
			bufferedWrite: testCase.bufferedWrite,
		},
	);
	await Promise.all(
		inputs.map((input) =>
			zipWriter.add(input.name, createReader(zipdotjs, input.data), {}),
		),
	);
	const zipped = await zipWriter.close();

	if (testCase.useWebWorkers) {
		await zipdotjs.terminateWorkers();
	}
	return zipped;
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {TestCase} testCase
 * @param {Uint8Array|Blob} zipped
 */
async function unzip(zipdotjs, testCase, zipped) {
	configure(zipdotjs, testCase);
	const zipReader = new zipdotjs.ZipReader(createReader(zipdotjs, zipped), {
		// interesting options for ZipReader ctr?
	});
	const entries = await zipReader.getEntries();
	const proms = entries.map((entry) =>
		entry.directory
			? Promise.resolve(null)
			: entry.getData(createWriter(zipdotjs, testCase.outputType)),
	);
	const outputs = await Promise.all(proms);
	if (testCase.useWebWorkers) {
		await zipdotjs.terminateWorkers();
	}
	return outputs;
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {TestCase} testCase
 */
function configure(zipdotjs, testCase) {
	zipdotjs.configure({
		useCompressionStream: testCase.useCompressionStream,
		useWebWorkers: testCase.useWebWorkers,
		maxWorkers: testCase.concurrency,
		chunkSize: testCase.chunkSize,
	});
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {number} size Number of bytes to allocate.
 * @param {"Uint8Array"|"Blob"|undefined} inputType
 * @returns {Uint8Array|Blob} the data containing random bytes.
 */
function getBlobOrU8(size, inputType) {
	const data = new Float64Array(Math.floor(size / 8));
	for (let indexData = 0; indexData < data.length; indexData++) {
		data[indexData] = Math.random(); //
	}
	if (inputType === "Blob") {
		return new Blob([data]);
	} else {
		return new Uint8Array(data.buffer);
	}
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {Uint8Array|Blob} data
 */
function createReader(zipdotjs, data) {
	if (data instanceof Uint8Array) {
		return new zipdotjs.Uint8ArrayReader(data);
	} else if (data instanceof Blob) {
		return new zipdotjs.BlobReader(data);
	} else {
		throw new Error();
	}
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Zipdotjs} zipdotjs
 * @param {"Uint8Array"|"Blob"|undefined} outputType .
 * @returns {Uint8ArrayWriter|BlobWriter} the writer.
 */
function createWriter(zipdotjs, outputType) {
	if (outputType === "Blob") {
		return new zipdotjs.BlobWriter("application/octet-stream");
	} else {
		return new zipdotjs.Uint8ArrayWriter();
	}
}

//--------------------------------------------------------------------------------------------------
/** @type TestCase */
export const baseTestCase = {
	// in out
	name: "32 x 5MiB",
	entryCount: 32,
	entrySize: () => 1024 * 1024 * 5,
	inputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"
	outputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"

	// configure
	useCompressionStream: true,
	useWebWorkers: true,
	concurrency: 1,

	chunkSize: undefined,

	// ZipWriter ctr
	level: 6,
	keepOrder: true, // true by default

	// `true` to write entry data in a buffer before appending it to the zip file.
	// `bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.
	// @defaultValue false
	bufferedWrite: false,

	unzip: true,
};

/** [1, 1, ... , 1, 31] */
export const smallFirstTestCase = {
	...baseTestCase,
	name: "small-first",
	entryCount: 32,
	entrySize: (/** @type {number} */ idx) => (idx === 31 ? 31 : 1) * 1024*1024 //(1024 * 1024 * (idx + 1)) / 2,
};

/** [31, 1, 1 1..., 1] */
export const bigFirstTestCase = {
	...baseTestCase,
	name: "big-first",
	entryCount: 32,
	entrySize: (/** @type {number} */ idx) => (idx === 0 ? 31 : 1) * 1024*1024 // (1024 * 1024 * (32 - idx)) / 2,
};

/**
 * @typedef {{
 *   baseTestCase: TestCase,
 *   useCompressionStream: boolean,
 *   useWebWorkers: boolean,
 *   concurrency: number[],
 *   keepOrder: boolean,
 *   bufferedWrite: boolean,
 *   unzip: boolean,
 * }} CreateTestCasesOpts
 */

//--------------------------------------------------------------------------------------------------
/**
 * @param {CreateTestCasesOpts} opts
 * @returns TestCase[]
 */
export function createTestCases({
	baseTestCase,
	useCompressionStream,
	useWebWorkers,
	concurrency: concurrencies,
	keepOrder,
	unzip,
}) {
	/** @type {TestCase[]} */
	const testCases = [];


	for (let concurrency of concurrencies) {
		/** @type TestCase */
		const testCase = {
			...baseTestCase,
			useCompressionStream,
			useWebWorkers,
			concurrency,
			keepOrder,
			unzip,
		};
		testCases.push(testCase);
	}


	return testCases;
}

//--------------------------------------------------------------------------------------------------
/** @returns {string} */
export function logConfigURIs() {
	/** @type {any} */
	const c = getConfiguration();
	const wasmURI = typeof c.wasmURI === "function" ? c.wasmURI().slice(0, 60) + "..." : c.wasmURI;
	const workerURI = typeof c.workerURI === "function" ? c.workerURI().slice(0, 60) + "..." : c.workerURI;
	return JSON.stringify({ wasmURI, workerURI }, null, 2);
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {any} zipdotjs
 * @param {string} name
 * @param {TestCase[]} testCases
 * @returns Promise<void>
 */
export async function runTests(zipdotjs, name, testCases) {
	/** @type {string[]} */
	const log = [];
	log.push(name);
	//log.push(logConfigURIs());
	await testPerf(zipdotjs, testCases, log);
	console_log(log.join("\n"));
}
