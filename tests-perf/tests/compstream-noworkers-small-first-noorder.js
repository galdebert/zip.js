// @ts-check
import { createTestCases, runTests, smallFirstTestCase } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: smallFirstTestCase,
	useCompressionStream: true,
	useWebWorkers: false,
	// on NODEJS it's interesting to test useCompressionStream=true && useWebWorkers=false && concurrency > 1 because it uses the nodejs thread pool (4 threads by default)
	// on BROWSER, concurrency has not effect
	concurrency: [1, 2, 4, 8, 16],
	keepOrder: false,
	bufferedWrite: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "compstream-noworkers-small-first-noorder", testCases);
}
