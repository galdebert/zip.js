/* global document, location, addEventListener, URL */

// Open `index.html` in a browser to run this file

const params = new URL(import.meta.url).searchParams;
const test_param = params.get("test");
const tests = [{ title: test_param, script: `./${test_param}.js` },];


const table = document.createElement("table");
const MAX_TESTS = 1; // max test count running concurrently. Must be 1 when running perf tests
let indexTest;
for (indexTest = 0; indexTest < Math.min(MAX_TESTS, tests.length); indexTest++) {
	const test = tests[indexTest];
	if (!test.env || test.env.includes("browser")) {
		addTest(test);
	}
}
document.body.appendChild(table);
if (!location.search.startsWith("?keepTests")) {
	addEventListener("message", event => {
		const result = JSON.parse(event.data);
		if (!result.error) {
			Array.from(document.querySelectorAll("tr")).find(row => row.dataset.script == result.script).remove();
		}
		const test = tests[indexTest];
		indexTest++;
		if (test) {
			if (!test.env || test.env.includes("browser")) {
				addTest(test);
			}
		} else if (!document.querySelectorAll("tr").length) {
			document.body.innerHTML = "ok, open the console to see tests-perf results";
		}
	}, false);
}

function addTest(test) {
	const row = document.createElement("tr");
	const cellTest = document.createElement("td");
	const cellLink = document.createElement("td");
	const iframe = document.createElement("iframe");
	const link = document.createElement("a");
	link.textContent = test.title;
	link.target = test.script;
	row.dataset.script = test.script;
	link.href = iframe.src = "/tests-perf/scripts/loader.html#" + encodeURIComponent(JSON.stringify({ script: test.script }));
	cellTest.appendChild(iframe);
	cellLink.appendChild(link);
	row.appendChild(cellLink);
	row.appendChild(cellTest);
	table.appendChild(row);
}