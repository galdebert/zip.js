/* global TransformStream */
// @ts-check

import { baseTestCase, createTestCases, runTests } from "./perf-utils.js";

import { makeCompressionStream, makeDecompressionStream } from "compression-streams-polyfill/ponyfill"; // wraps fflate
import * as zipdotjs from "../../index-native.js";

const CompressionStream = makeCompressionStream(TransformStream);
const DecompressionStream = makeDecompressionStream(TransformStream);

// zipdotjs.TransformStreamLike lack the constructor property

zipdotjs.configure({
	CompressionStream,
	DecompressionStream,
});


// index-native.js contains <reference types="./index.d.ts" /> BUT here @ts-check does not pick index.d.ts for some reason
// to workaround this, we created a index-native.d.ts = index.d.ts

/** @type {import("./perf-utils.js").TestCase[]} */
const testCases = createTestCases({
	baseTestCase: baseTestCase,
	useCompressionStream: false,
	useWebWorkers: true,
	concurrency: [1, 2, 4, 8],
});

export function test() {
	return runTests(zipdotjs, "fflate-workers", testCases);
}
