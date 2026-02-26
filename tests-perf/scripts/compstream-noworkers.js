// @ts-check
import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

// default init zipdotjs is ./lib/zip-fs-wasm.js ie web-worker-inline-wasm.js and zip-fs-core-wasm.js
import * as zipdotjs from "../../index.js";

//
// using both
// - import * as zipdotjs from "../../index.js";
// - import * as zipdotjs from "../../index-native.js";
// because 
// - their top level code will interfere
// - tests are not ran in isolation
// - modules are loaded ONCE so the top level init code is NOT re-executed
// - ../../index.js and ../../index-native.js both have some init code: configureWebWorker(configure);
// 

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStream: true,
	useWebWorkers: false,
	// on NODEJS it's interesting to test useCompressionStream=true && useWebWorkers=false && concurrencies > 1 because it uses the nodejs thread pool (4 threads by default)
	// on BROWSER we should only test concurrency=1
	concurrencies: [1, 4, 8],
});

export function test() {
	return runTests(zipdotjs, "compstream-noworkers", testCases);
}
