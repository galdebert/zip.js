/* global Blob */
// @ts-check
import * as zipdotjs from "../../index.js";

export { test };

/**
 * @typedef {{
 *   inputType: 'Uint8Array'|'Blob'|undefined,
 *   outputType: 'Uint8Array'|'Blob'|undefined,
 *   entrySize: number,
 *   entryCount: number,
 *   useWebWorkers: boolean|undefined,
 *   maxWorkers: number|undefined,
 *   useCompressionStream: boolean|undefined,
 *   chunkSize: number|undefined,
 *   level: number|undefined,
 *   keepOrder: boolean|undefined,
 *   bufferedWrite: boolean|undefined,
 * }} PerfConfig
 *
 * @typedef {{name: string; data: Uint8Array|Blob}} Input
 */

async function test() {
	/** @type {PerfConfig} */
	const baseCfg = {
		// in out
		entrySize: 1024 * 1024 * 20,
		entryCount: 20,
		inputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"
		outputType: undefined, // "Uint8Array" | "Blob",  undefined means "Uint8Array"

		// configure
		useWebWorkers: undefined,
		maxWorkers: undefined,
		useCompressionStream: undefined,
		chunkSize: undefined,

		// ZipWriter ctr
		level: 6,
		keepOrder: undefined,
		bufferedWrite: undefined,
	};

	/** @type {PerfConfig[]} */
	const cfgs = [
		{ ...baseCfg, level: 1, useWebWorkers: true },
		{ ...baseCfg, level: 1, useWebWorkers: false },
		{ ...baseCfg, level: 6, useWebWorkers: true },
		{ ...baseCfg, level: 6, useWebWorkers: false },
		//{ ...baseCfg, level: 6, useWebWorkers: true, useCompressionStream: false },
	];

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
		const pov = {
			cfg,
			results: { zip_sec, unzip_sec, zippedMiB },
		};

		// eslint-disable-next-line no-console
		console.log(JSON.stringify(pov, null, 2));
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
