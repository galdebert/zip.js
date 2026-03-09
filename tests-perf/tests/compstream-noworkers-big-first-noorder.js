// @ts-check
import { bigFirstTestCase, createTestCases, runTests } from "../utils/perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js
import * as zipdotjs from "../../index.js";

/** @type {import("../utils/perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: bigFirstTestCase,
	useCompressionStream: true,
	useWebWorkers: false,
	// on NODEJS it's interesting to test useCompressionStream=true && useWebWorkers=false && concurrency > 1 because it uses the nodejs thread pool (4 threads by default)
	// on BROWSER, concurrency has not effect
	concurrency: [2],
	keepOrder: false,
	bufferedWrite: true,
	unzip: true,
});

export function test() {
	return runTests(zipdotjs, "compstream-noworkers-big-first-noorder", testCases);
}

