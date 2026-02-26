import { setMaxListeners } from "node:events";
import { test } from "node:test";
import { console_log, setupWebWorkerOnNodejs } from "./utils/perf-utils.js";

// eslint-disable-next-line no-undef
const params = process.argv.slice(2);
const test_param = params[0];

setMaxListeners(100);

// tests are not ran in process isolation, so we setup web workers only once
(async () => {
	console_log(`navigator.hardwareConcurrency = ${globalThis?.navigator?.hardwareConcurrency}`);

	await setupWebWorkerOnNodejs(true);

	test({
		name: test_param,
		fn: async () => (await import(`./${test_param}.js`)).test(),
	});
})();

// node:test's harness runs tests automatically once they're registered - you don't need an explicit run().
// but given it's all in the same file, all tests in the same process without isolation.
//
// TODO each test should be in its own xxx.test.js file and we should run node --test --file xxx.test.js
//
// run({ isolation: "process", concurrency: true })
// 	.compose(spec)
// 	.pipe(process.stdout);
