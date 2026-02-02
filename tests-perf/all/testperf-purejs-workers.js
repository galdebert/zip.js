// @ts-check
import * as zipdotjs from "../../index-native.js"; // "./lib/zip-fs-native.js"
import {
	baseTestCase20x20,
	createTestCases,
	testPerf,
} from "../utils/perf-utils.js";
// index-native.js contains <reference types="./index.d.ts" /> BUT here @ts-check does not pick index.d.ts for some reason
// to workaround this, we created a index-native.d.ts = index.d.ts

/**
 * @typedef {import("../utils/perf-utils.js").TestCase} TestCase
 */

/** @type TestCase[] */
const testCases = createTestCases({
	baseTestCase: baseTestCase20x20,
	useCompressionStreams: [false],
	useWebWorkerss: [true],
	maxWorkerss: [1, 2, 4, 8],
});

export function test() {
	return testPerf(
		{
			zipdotjs,
			name: "purejs-workers",
			doRunUnzip: false,
		},
		testCases,
	);
}
