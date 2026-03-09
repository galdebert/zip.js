// @ts-check

import { bigFirstTestCase, createTestCases, runTests } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: bigFirstTestCase,
	useCompressionStream: true,
	useWebWorkers: true,
	concurrency: [1, 2, 4, 8, 16],
	keepOrder: false,
	bufferedWrite: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "compstream-workers-big-first-noorder", testCases);
}

