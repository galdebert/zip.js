// @ts-check

import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

// default init zipdotjs is "./lib/zip-fs-wasm.js";
import * as zipdotjs from "../../index.js";

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase,
	useCompressionStream: true,
	useWebWorkers: true,
	concurrencies: [1, 4, 8],
});

export function test() {
	return runTests(zipdotjs, "compstream-workers", testCases);
}

