// @ts-check

import { createTestCases, runTests, smallFirstTestCase } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: smallFirstTestCase,
	useCompressionStream: true,
	useWebWorkers: true,
	concurrency: [2],
	keepOrder: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "compstream-small-first", testCases);
}

