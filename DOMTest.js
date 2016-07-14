'use strict';
// Parent div for running child tests
let parent = document.body.appendChild(document.createElement('div'));
let startBtn = document.getElementById('start_btn');
let itersInput = document.getElementById('iters_input')

// Benchmarks
let appendNChildren = (n) => {
	let t1 = performance.now();
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t2 = performance.now();
	removeAllChildren(parent);
	return t2 - t1;
};

let removeNChildren = (n) => {
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t1 = performance.now();
	removeAllChildren(parent);
	let t2 = performance.now();
	return t2 - t1;
};

let iterateThroughChildrenForwards = (n) => {
	let t1 = performance.now();
	let child = parent.firstChild;
	while (child) {
		child = child.nextSibling;
	}
	let t2 = performance.now();
	return t2 - t1;
};

let iterateThroughChildrenBackwards = (n) => {
	let child = parent.lastChild;
	let t1 = performance.now();
	while (child) {
		child = child.previousSibling;
	}
	let t2 = performance.now();
	return t2 - t1;
};

let lastChildSizeN = (n) => {
	let totalTime = 0;
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
		let t1 = performance.now();
		let child = parent.lastChild;
		let t2 = performance.now();
		totalTime += t2 - t1;
	}
	removeAllChildren(parent);
	return totalTime;
}

let DOM_API_BENCHMARKS = [
	{
		task : 'appendChild',
		nChildren : 10000,
		cb : appendNChildren,
		preAppend : false
	},
	{
		task : 'removeChild',
		nChildren : 10000,
		cb : removeNChildren,
		preAppend : false
	},
	{
		task : 'nextSibling',
		nChildren : 100000,
		cb : iterateThroughChildrenForwards,
		preAppend : true
	},
	{
		task : 'previousSibling',
		nChildren : 100000,
		cb : iterateThroughChildrenBackwards,
		preAppend : true
	},
	{
		task : 'lastChild',
		nChildren : 10000,
		cb : lastChildSizeN,
		preAppend : false
	}
];

// Create a basic UI to enable/disable benchmarks and set # of iterations
let generateUI = () => {
	itersInput.addEventListener('input', (e) => {
		validInput();
	});
	// Create ui elements for each benchmark
	for (let bm of DOM_API_BENCHMARKS) {
		let wrapper = document.createElement('p');
		let checkbox = document.createElement('input');
		document.body.insertBefore(wrapper, startBtn);
		wrapper.innerHTML = 'Benchmark: ' + bm.task;
		wrapper.appendChild(checkbox);
		checkbox.type = 'checkbox';
		checkbox.checked = 'true';
		bm.run = true;
		checkbox.onclick = checkBoxEventHandle(bm, checkbox);
	}
}

// Wrap in closure so that the correct benchmark and checkbox is used
let checkBoxEventHandle = (bm, cb) => {
	return () => {
		bm.run = cb.checked;
	}
}

// Make sure iterations input is a positive integer
let validInput = () => {
	if (/[^0-9]/g.test(itersInput.value)) {
		startBtn.disabled = true;
	} else {
		startBtn.disabled = false;
	}
}

// Run each enabled benchmark # of iterations times and take an average of the time.
let runBenchmarks = () => {
	const iterations = parseInt(itersInput.value);
	let outputWrapper = document.getElementById('output');
	removeAllChildren(outputWrapper); // Clear previous output

	for (let bm of DOM_API_BENCHMARKS) {
		if (!bm.run) continue;
		// Remove any children left from previous benchmarks.
		removeAllChildren(parent);
		// Append children for benchmark if needed
		if (bm.preAppend) {
			for (let i = 0; i < bm.nChildren; i++) {
				parent.appendChild(document.createElement('div'));
			}
		}

		// Run benchmarks
		let totalTime = 0;
		for (let t = 0; t < iterations; t++) {
			totalTime += bm.cb(bm.nChildren);
		}
		totalTime = totalTime / iterations;

		// Output result
		let resultMsg = bm.task + ' benchmark: ' + totalTime + ' millis.';
		let newResult = document.createElement('p');
		newResult.innerHTML = resultMsg;
		outputWrapper.appendChild(newResult);
		console.log(resultMsg);
	}
};

// Helpers
let removeAllChildren = (p) => {
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
};

window.onload = () => {
	generateUI();
	validInput(document.getElementById('iters_input').value);
};
