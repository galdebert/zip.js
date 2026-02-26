// @ts-check

import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js ie web-worker-inline-wasm.js and zip-fs-core-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStream: false,
	useWebWorkers: true,
	concurrencies: [1, 4, 8],
});

export function test() {
	return runTests(zipdotjs, "wasm-workers", testCases);
}
