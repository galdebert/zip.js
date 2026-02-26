/* global Blob */
// @ts-check

import { getConfiguration } from "../../lib/core/configuration.js";

// eslint-disable-next-line no-console
export const console_log = console.log;

/**
 *
 * @typedef {import("../../index.js")} Zipdotjs
 *
 * @typedef {import("../../index.d.ts").BlobReader} BlobReader
 * @typedef {import("../../index.d.ts").BlobWriter} BlobWriter
 * @typedef {import("../../index.d.ts").Uint8ArrayReader} Uint8ArrayReader
 * @typedef {import("../../index.d.ts").Uint8ArrayWriter} Uint8ArrayWriter
 * @typedef {import("../../index.d.ts").Configuration} Configuration
 *
 * @typedef {{
 *   inputType: 'Uint8Array'|'Blob'|undefined,
 *   outputType: 'Uint8Array'|'Blob'|undefined,
 *   entrySize: number,
 *   entryCount: number,
 *   useWebWorkers: boolean,
 *   concurrency: number,
 *   useCompressionStream: boolean,
 *   chunkSize: number|undefined,
 *   level: number|undefined,
 *   keepOrder: boolean|undefined,
 *   bufferedWrite: boolean|undefined,
 * }} TestCase
 *
 * @typedef {{name: string; data: Uint8Array|Blob}} Input
 *
 * @typedef {{
 *   zipdotjs: typeof import("../../index.js"),
 *   doRunUnzip: boolean
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
		const name = `${testCase.entryCount} x ${testCase.entrySize / (1024 * 1024)}MiB`;
		const nat = testCase.useCompressionStream.toString().padEnd(5);
		const use = testCase.useWebWorkers.toString().padEnd(5);
		const con = testCase.concurrency.toString().padStart(2);
		return `${name} useCompressionStream=${nat} useWebWorkers=${use} concurrency=${con}`;
	},
};

//--------------------------------------------------------------------------------------------------
/**
 * @param {TestCfg} testCfg
 * @param {TestCase[]} testCases
 * @param {string[]} log
 * @return Promise<void>
 */
export async function testPerf(testCfg, testCases, log) {
	const { zipdotjs, doRunUnzip } = testCfg;

	for (const testCase of testCases) {
		TestCase.check(testCase);

		/** @type {Input[]} */
		const inputs = [];
		for (let i = 0; i < testCase.entryCount; i++) {
			const byteSize = testCase.entrySize;
			inputs.push({
				name: `entry #${i + 1}`,
				data: getBlobOrU8(byteSize, testCase.inputType),
			});
		}

		const zip_t0 = Date.now();
		const zipped = await zip(zipdotjs, testCase, inputs);
		const zip_dt = Date.now() - zip_t0;

		if (!doRunUnzip) {
			const zip_sec = (zip_dt / 1000).toFixed(2);
			const result = `${TestCase.toStr(testCase)}: zip=${zip_sec}s`;
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

		const zip_sec = (zip_dt / 1000).toFixed(2);
		const unzip_sec = (unzip_dt / 1000).toFixed(2);
		const zippedMiB = (zippedByteLength / (1024 * 1024)).toFixed(2);
		const result = `${TestCase.toStr(testCase)}: zip=${zip_sec}s unzip=${unzip_sec}s size=${zippedMiB}MiB`;
		log.push(result);
	}
}

//--------------------------------------------------------------------------------------------------
// How to use Web Workers on Node.js ?
// https://github.com/gildas-lormeau/zip.js/discussions/635
/** @param {boolean} useWebWorkerOnNodejs */
export async function setupWebWorkerOnNodejs(useWebWorkerOnNodejs) {
	if (typeof globalThis.Worker === "undefined") {
		if (useWebWorkerOnNodejs) {
			console_log("NODEJS: we DO use web-worker");
			try {
				const Worker = await import("web-worker");
				globalThis.Worker = Worker?.default ?? Worker;
			} catch (err) {
				console_log(`Failed to import web-worker: ${err}`);
				throw err;
			}
		} else {
			console_log("NODEJS: we do NOT use web-worker");
		}
	}
}

//--------------------------------------------------------------------------------------------------
// /**
//  * @param {string} name
//  * @param {boolean} defaultValue
//  * @returns {boolean}
//  */
// function getEnvVarBoolean(name, defaultValue) {
// 	if (typeof process !== "undefined") {
// 		// eslint-disable-next-line no-undef
// 		const env_var = process?.env?.[name];
// 		if (env_var === "1" || env_var === "true") {
// 			return true;
// 		} else if (env_var === "0" || env_var === "false") {
// 			return false;
// 		}
// 	}
// 	return defaultValue;
// }

/**
 * @param {string} name
 * @param {string} defaultValue
 * @returns {string}
 */
// function getEnvVarString(name, defaultValue) {
// 	if (typeof process !== "undefined") {
// 		// eslint-disable-next-line no-undef
// 		const env_var = process?.env?.[name];
// 		if (env_var !== undefined) {
// 			return env_var;
// 		}
// 	}
// 	return defaultValue;
// }

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
 * @param {Configuration} testCase
 */
function configure(zipdotjs, testCase) {
	zipdotjs.configure({
		useWebWorkers: testCase.useWebWorkers,
		maxWorkers: testCase.maxWorkers,
		useCompressionStream: testCase.useCompressionStream,
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
	entrySize: 1024 * 1024 * 5,
	entryCount: 20,
	inputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"
	outputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"

	// configure
	useWebWorkers: true,
	concurrency: 1,
	useCompressionStream: true,
	chunkSize: undefined,

	// ZipWriter ctr
	level: 6,
	keepOrder: undefined,
	bufferedWrite: undefined,
};

/**
 * @typedef {{
 *   baseTestCase: TestCase,
 *   useCompressionStream: boolean,
 *   useWebWorkers: boolean,
 *   concurrencies: number[],
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
	concurrencies,
}) {
	/** @type {TestCase[]} */
	const testCases = [];


	for (let concurrency of concurrencies) {
		/** @type TestCase */
		const testCase = {
			...baseTestCase,
			useWebWorkers,
			concurrency,
			useCompressionStream,
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
	const wasmURI = typeof c.wasmURI === "function" ? c.wasmURI().slice(0, 60) + "...": c.wasmURI;
	const workerURI = typeof c.workerURI === "function" ? c.workerURI().slice(0, 60) + "...": c.workerURI;
	return JSON.stringify({wasmURI, workerURI}, null, 2);
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
	log.push(`------------------ ${name} ------------------`);
	log.push(logConfigURIs());
	
	await testPerf(
		{
			zipdotjs,
			doRunUnzip: false,
		},
		testCases,
		log
	);
	console_log(log.join("\n"));
}
