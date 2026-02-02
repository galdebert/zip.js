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
	useCompressionStreams: [true],
	useWebWorkerss: [false], // on NODEJS it's interesting to test useCompressionStreams=true && useWebWorkers=false because it uses the nodejs thread pool (4 threads by default)
	maxWorkerss: [1, 2, 4, 8],
});

export function test() {
	return testPerf(
		{
			zipdotjs,
			name: "compstream-noworkers",
			doRunUnzip: false,
		},
		testCases,
	);
}
