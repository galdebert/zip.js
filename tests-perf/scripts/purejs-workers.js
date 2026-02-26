// @ts-check
//
// WE SHOULD NOT MIX import "../../index-native.js" and import "../../index.js" in the same non isolated tests suite
// BECAUSE THEIR TOP LEVEL INIT CODE WILL INTERFERE
//

import { baseTestCase, createTestCases,	runTests } from "./perf-utils.js";

// "index-native.js" uses "web-worker-inline-native.js" and "zip-fs-core-native.js"
import * as zipdotjs from "../../index-native.js";

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: baseTestCase,
	useCompressionStream: false,
	useWebWorkers: true,
	concurrency: [1, 2, 4, 8],
});

export function test() {
	return runTests(zipdotjs, "purejs-workers", testCases);
}
