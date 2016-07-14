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

let removeNChildrenFront = (n) => {
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t1 = performance.now();
	removeAllChildren(parent);
	let t2 = performance.now();
	return t2 - t1;
};

let removeNChildrenBack = (n) => {
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t1 = performance.now();
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
	let t2 = performance.now();
	return t2 - t1;
};

let removeNChildrenRandom = (n) => {
	let children = [];
	for (let i = 0; i < n; i++) {
		let child = document.createElement('div');
		parent.appendChild(child);
		children.push(child);
	}
	// Shuffle list of indices
	for (let i = 0; i < 100 * children.length; i++) {
		let r = Math.floor(Math.random() * children.length);
		let tmp = children[0];
		children[0] = children[r];
		children[r] = tmp;
	}
	let t1 = performance.now();
	for (let child of children) {
		parent.removeChild(child);
	}
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

let createNodeLists = (n) => {
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t1 = performance.now();
	let nodeList = parent.childNodes;
	let t2 = performance.now();
	removeAllChildren(parent);
	return t2 - t1;
};

let nodeListForwards = (n) => {
	let nodeList = parent.childNodes;
	let t1 = performance.now();
	for (let i = 0; i < nodeList.length; i++) {
		let child = nodeList[i];
	}
	let t2 = performance.now();
	return t2 - t1;
}

let nodeListBackwards = (n) => {
	let nodeList = parent.childNodes;
	let t1 = performance.now();
	for (let i = nodeList.length; i >= 0; i--) {
		let child = nodeList[i];
	}
	let t2 = performance.now();
	return t2 - t1;
}

let DOM_API_BENCHMARKS = [
	{
		task : 'Append 100 children (appendChild)',
		nChildren : 100,
		cb : appendNChildren,
		preAppend : false
	},
	{
		task : 'Append 1000 children (appendChild)',
		nChildren : 1000,
		cb : appendNChildren,
		preAppend : false
	},
	{
		task : 'Append 10000 children (appendChild)',
		nChildren : 10000,
		cb : appendNChildren,
		preAppend : false
	},
	{
		task : 'Remove 10000 children from front (removeChild)',
		nChildren : 10000,
		cb : removeNChildrenFront,
		preAppend : false
	},
	{
		task : 'Remove 10000 children from back (removeChild)',
		nChildren : 10000,
		cb : removeNChildrenBack,
		preAppend : false
	},
	{
		task : 'Remove 10000 children randomly (removeChild)',
		nChildren : 10000,
		cb : removeNChildrenRandom,
		preAppend : false
	},
	{
		task : 'Iterate forwards through 100000 children (nextSibling)',
		nChildren : 100000,
		cb : iterateThroughChildrenForwards,
		preAppend : true
	},
	{
		task : 'Iterate backwards through 100000 children (previousSibling)',
		nChildren : 100000,
		cb : iterateThroughChildrenBackwards,
		preAppend : true
	},
	{
		task : 'Get the last child from 1 .. 10000 children (lastChild)',
		nChildren : 10000,
		cb : lastChildSizeN,
		preAppend : false
	},
	{
		task : 'Create NodeList object with 100000 children (childNodes)',
		nChildren : 10000,
		cb : createNodeLists,
		preAppend : false
	},
	{
		task : 'Iterate forwards through 100000 child NodeList (childNodes[i])',
		nChildren : 100000,
		cb : nodeListForwards,
		preAppend : true
	},
	{
		task : 'Iterate backwards through 100000 child NodeList (childNodes[i])',
		nChildren : 100000,
		cb : nodeListBackwards,
		preAppend : true
	}
];

// Create a basic UI to enable/disable benchmarks and set # of iterations
let generateUI = () => {
	itersInput.addEventListener('input', (e) => {
		validInput();
	});
	itersInput.value = '1000';
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
		let resultMsg = bm.task + ' benchmark: ' + totalTime.toFixed(3) + ' ms.';
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
