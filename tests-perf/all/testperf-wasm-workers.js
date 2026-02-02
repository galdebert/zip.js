// @ts-check
import * as zipdotjs from "../../index.js";
import {
	baseTestCase20x20,
	createTestCases,
	testPerf,
} from "../utils/perf-utils.js";

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
			name: "wasm-workers",
			doRunUnzip: false,
		},
		testCases,
	);
}
