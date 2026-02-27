// @ts-check

import { baseTestCase, createTestCases, runTests } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js ie web-worker-inline-wasm.js and zip-fs-core-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStream: false,
	useWebWorkers: true,
	concurrency: [1, 2, 4, 8, 16],
	keepOrder: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "wasm", testCases);
}
