import { setMaxListeners } from "node:events";
import { console_log } from "./utils/perf-utils.js";
import Worker from "web-worker";
globalThis.Worker = Worker?.default ?? Worker;

// eslint-disable-next-line no-undef
const params = process.argv.slice(2);
const test_param = params[0];

setMaxListeners(100);

// tests are not ran in process isolation, so we setup web workers only once
(async () => {
	//console_log(`navigator.hardwareConcurrency = ${globalThis?.navigator?.hardwareConcurrency}`);
	console_log("");
	const { test } = await import(`./tests/${test_param}.js`);
	await test();
})();

