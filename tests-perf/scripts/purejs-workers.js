// @ts-check
//
// WE SHOULD NOT MIX import "../../index-native.js" and import "../../index.js" in the same non isolated tests suite
// BECAUSE THEIR TOP LEVEL INIT CODE WILL INTERFERE
//

import * as zipdotjs from "../../index-native.js"; // native means purejs
import { baseTestCase, createTestCases,	runTests } from "./perf-utils.js";

// index-native.js contains <reference types="./index.d.ts" /> BUT here @ts-check does not pick index.d.ts for some reason
// to workaround this, we created a index-native.d.ts = index.d.ts

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: baseTestCase,
	useCompressionStreams: [false],
	useWebWorkerss: [true],
	concurrencies: [1, 4, 8],
});
const name = "purejs-workers";

export function test() {
	return runTests(zipdotjs, name, testCases);
}
