import { setMaxListeners } from "node:events";
import { test } from "node:test";
import { setupWebWorkerOnNodejs } from "./utils/perf-utils.js";

import tests from "./tests-data.js";

setMaxListeners(100);

// tests are not ran in process isolation, so we setup web workers only once
(async () => {
	await setupWebWorkerOnNodejs(true);

	// beforeEach(() => globalThis.fetch = mock.fn(async url => {
	// 	const blob = await openAsBlob("." + url.toString().match(/(\/data\/.*)/)[1]);
	// 	return {
	// 		status: 200,
	// 		body: blob.stream(),
	// 		arrayBuffer: () => blob.arrayBuffer()
	// 	};
	// }));

	for (const testData of tests) {
		// if (testData.title !== "native-workers") {
		// 	continue;
		// }
		if (!testData.env || testData.env.includes("node")) {
			test({
				name: testData.title,
				fn: async () => (await import("./all/" + testData.script)).test(),
			});
		}
	}
})();

// node:test's harness runs tests automatically once they're registered - you don't need an explicit run().
// but given it's all in the same file, all tests in the same process without isolation.
//
// TODO each test should be in its own xxx.test.js file and we should run node --test --file xxx.test.js
//
// run({ isolation: "process", concurrency: true })
// 	.compose(spec)
// 	.pipe(process.stdout);
