'use strict';
// Parent div for running child tests
let parent = document.body.appendChild(document.createElement('div'));

// Benchmarks
let appendNChildren = (n) => {
	let t1 = performance.now();
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t2 = performance.now();
	removeAllChildren();
	return t2 - t1;
};

let removeNChildren = (n) => {
	for (let i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	let t1 = performance.now();
	removeAllChildren();
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
	removeAllChildren();
	return totalTime;
}

const DOM_API_BENCHMARKS = [
	{
		task : 'appendChild',
		nChildren : 10000,
		cb : appendNChildren,
		preAppend : false,
		skip : true
	},
	{
		task : 'removeChild',
		nChildren : 10000,
		cb : removeNChildren,
		preAppend : false,
		skip : true
	},
	{
		task : 'nextSibling',
		nChildren : 100000,
		cb : iterateThroughChildrenForwards,
		preAppend : true,
		skip : false
	},
	{
		task : 'previousSibling',
		nChildren : 100000,
		cb : iterateThroughChildrenBackwards,
		preAppend : true,
		skip : false
	},
	{
		task : 'lastChild',
		nChildren : 10000,
		cb : lastChildSizeN,
		preAppend : false,
		skip : true
	}
];

let generateUI = () => {

}


let runBenchmarks = (iterations) => {
	for (let bm of DOM_API_BENCHMARKS) {
		if (bm.skip) continue;
		console.log('Running benchmark: ' + bm.task);

		// Remove any children left from previous benchmarks.
		removeAllChildren();
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
		console.log(bm.task + ' benchmark: ' + totalTime + ' millis.');
	}
};

// Helpers
let removeAllChildren = () => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

window.onload = () => {
	//runBenchmarks(1000);
};
