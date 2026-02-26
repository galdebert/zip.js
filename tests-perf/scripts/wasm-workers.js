// @ts-check

import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

//import * as zipdotjs from "../../lib/zip-fs-wasm.js"; // same as "../../index.js"

// init zipdotjs to use wasm
import { configure } from "../../lib/core/configuration.js";
import { configureWebWorker } from "../../lib/core/web-worker-inline-wasm.js";
configureWebWorker(configure);
import * as zipdotjs from "../../lib/zip-core-wasm.js";


/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStreams: [false],
	useWebWorkerss: [true],
	concurrencies: [1, 4, 8],
});

const name = "wasm-workers";

export function test() {
	return runTests(zipdotjs, name, testCases);
}
