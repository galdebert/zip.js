/* global Blob */
// @ts-check
import * as zipdotjs from "../../index.js";

const _USE_WEB_WORKER_ON_NODEJS = true;
const _TEST_UNZIP = false;

// eslint-disable-next-line no-console
const console_log = console.log;

console_log(
	`navigator.hardwareConcurrency = ${globalThis?.navigator?.hardwareConcurrency}`,
);

// How to use Web Workers on Node.js ?
// https://github.com/gildas-lormeau/zip.js/discussions/635

async function setupWebWorkerOnNodejs() {
	if (typeof globalThis.Worker === "undefined") {
		if (_USE_WEB_WORKER_ON_NODEJS) {
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

export { test };

/**
 * @typedef {{
 *   baseName: string,
 *   inputType: 'Uint8Array'|'Blob'|undefined,
 *   outputType: 'Uint8Array'|'Blob'|undefined,
 *   entrySize: number,
 *   entryCount: number,
 *   useWebWorkers: boolean,
 *   maxWorkers: number,
 *   useCompressionStream: boolean,
 *   chunkSize: number|undefined,
 *   level: number|undefined,
 *   keepOrder: boolean|undefined,
 *   bufferedWrite: boolean|undefined,
 * }} PerfConfig
 *
 * @typedef {{name: string; data: Uint8Array|Blob}} Input
 */

const PerfConfig = {
	/** @param {PerfConfig} cfg */
	toStr(cfg) {
		const use = cfg.useWebWorkers.toString().padEnd(5);
		const max = cfg.maxWorkers.toString().padStart(2);
		//const nat = cfg.useCompressionStream.toString().padEnd(5);
		return `${cfg.baseName} level=${cfg.level} useWebWorkers=${use} maxWorkers=${max}`; // useCompressionStream=${nat}
	},
};

async function test() {
	await setupWebWorkerOnNodejs();

	/** @type {PerfConfig} */
	const baseCfg = {
		baseName: "20 x 20MiB",

		// in out
		entrySize: 1024 * 1024 * 20,
		entryCount: 20,
		inputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"
		outputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"

		// configure
		useWebWorkers: true,
		maxWorkers: 16,
		useCompressionStream: true,
		chunkSize: undefined,

		// ZipWriter ctr
		level: 6,
		keepOrder: undefined,
		bufferedWrite: undefined,
	};

	// IMPORTANT NOTES
	// - zipdotjs.configure() is incremental, it applies (not undefined) configuration props to the current global config
	//   so we have to set all props we change for each test
	// - useCompressionStream only works in practice when level=6
	// - maxWorkers should NOT matter when useWebWorkers: false, but somehow it does TBC

	/** @type {PerfConfig[]} */
	const cfgs = [];

	const useWebWorkerss = [false, true];
	const levels = [5, 6];
	const maxWorkerss = [1, 2, 4, 8, 16];

	for (let level of levels) {
		for (let useWebWorkers of useWebWorkerss) {
			for (let maxWorkers of maxWorkerss) {
				cfgs.push({
					...baseCfg,
					useWebWorkers,
					maxWorkers,
					level,
					useCompressionStream: true,
				});
			}
		}
	}

	for (const cfg of cfgs) {
		/** @type {Input[]} */
		const inputs = [];
		for (let i = 0; i < cfg.entryCount; i++) {
			const byteSize = cfg.entrySize;
			inputs.push({
				name: `entry #${i + 1}`,
				data: getBlobOrU8(byteSize, cfg.inputType),
			});
		}

		const zip_t0 = Date.now();
		const zipped = await zip(cfg, inputs);
		const zip_dt = Date.now() - zip_t0;

		if (!_TEST_UNZIP) {
			const zip_sec = (zip_dt / 1000).toFixed(2);
			const result = `${PerfConfig.toStr(cfg)}: zip=${zip_sec}s`;
			console_log(result);
			continue;
		}

		let zippedByteLength = 0;
		if (zipped instanceof Uint8Array) {
			zippedByteLength = zipped.byteLength;
		}

		const unzip_t0 = Date.now();
		const outputs = await unzip(cfg, zipped);
		const unzip_dt = Date.now() - unzip_t0;

		if (outputs.length != inputs.length) {
			throw new Error("Unzipped entry count mismatch");
		}

		const zip_sec = (zip_dt / 1000).toFixed(2);
		const unzip_sec = (unzip_dt / 1000).toFixed(2);
		const zippedMiB = (zippedByteLength / (1024 * 1024)).toFixed(2);
		const result = `${PerfConfig.toStr(cfg)}: zip=${zip_sec}s unzip=${unzip_sec}s size=${zippedMiB}MiB`;
		console_log(result);
	}
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {PerfConfig} cfg
 * @param {Input[]} inputs
 */
async function zip(cfg, inputs) {
	configure(cfg);

	const zipWriter = new zipdotjs.ZipWriter(createWriter(cfg.outputType), {
		level: cfg.level,
		keepOrder: cfg.keepOrder,
		bufferedWrite: cfg.bufferedWrite,
	});
	await Promise.all(
		inputs.map((input) =>
			zipWriter.add(input.name, createReader(input.data), {}),
		),
	);
	const zipped = await zipWriter.close();

	if (cfg.useWebWorkers) {
		await zipdotjs.terminateWorkers();
	}
	return zipped;
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {PerfConfig} cfg
 * @param {Uint8Array|Blob} zipped
 */
async function unzip(cfg, zipped) {
	configure(cfg);
	const zipReader = new zipdotjs.ZipReader(createReader(zipped), {
		// interesting options for ZipReader ctr?
	});
	const entries = await zipReader.getEntries();
	const proms = entries.map((entry) =>
		entry.directory
			? Promise.resolve(null)
			: entry.getData(createWriter(cfg.outputType)),
	);
	const outputs = await Promise.all(proms);
	if (cfg.useWebWorkers) {
		await zipdotjs.terminateWorkers();
	}
	return outputs;
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {zipdotjs.Configuration} cfg
 */
function configure(cfg) {
	zipdotjs.configure({
		useWebWorkers: cfg.useWebWorkers,
		maxWorkers: cfg.maxWorkers,
		useCompressionStream: cfg.useCompressionStream,
		chunkSize: cfg.chunkSize,
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
		data[indexData] = Math.random();
	}
	if (inputType === "Blob") {
		return new Blob([data]);
	} else {
		return new Uint8Array(data.buffer);
	}
}

//--------------------------------------------------------------------------------------------------
/**
 * @param {Uint8Array|Blob} data
 */
function createReader(data) {
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
 * @param {"Uint8Array"|"Blob"|undefined} outputType .
 * @returns {zipdotjs.Uint8ArrayWriter|zipdotjs.BlobWriter} the writer.
 */
function createWriter(outputType) {
	if (outputType === "Blob") {
		return new zipdotjs.BlobWriter("application/octet-stream");
	} else {
		return new zipdotjs.Uint8ArrayWriter();
	}
}
