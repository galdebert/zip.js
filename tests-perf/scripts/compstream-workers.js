// @ts-check
import * as zipdotjs from "../../index.js";
import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStreams: [true],
	useWebWorkerss: [true],
	concurrencies: [1, 4, 8],
});

const name = "compstream-workers";

export function test() {
	return runTests(zipdotjs, name, testCases);
}

