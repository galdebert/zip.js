// @ts-check

import { createTestCases, runTests, smallFirstTestCase } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: smallFirstTestCase,
	useCompressionStream: true,
	useWebWorkers: true,
	concurrency: [1, 2, 4, 8, 16],
	keepOrder: true,
	bufferedWrite: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "compstream-workers-small-first-order", testCases);
}

