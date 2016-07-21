'use strict';
// Parent div for running child tests
var parent = document.body.appendChild(document.createElement('div'));
var startBtn = document.getElementById('start_btn');
var itersInput = document.getElementById('iters_input')

// Benchmarks
var appendNChildren = function (n) {
	var t1 = performance.now();
	for (var i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	var t2 = performance.now();
	removeAllChildren(parent);
	return t2 - t1;
};

var removeNChildrenFront = function(n) {
	for (var i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	var t1 = performance.now();
	removeAllChildren(parent);
	var t2 = performance.now();
	return t2 - t1;
};

var removeNChildrenBack = function(n) {
	for (var i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	var t1 = performance.now();
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
	var t2 = performance.now();
	return t2 - t1;
};

var removeNChildrenRandom = function(n) {
	var children = [];
	for (var i = 0; i < n; i++) {
		var child = document.createElement('div');
		parent.appendChild(child);
		children.push(child);
	}
	// Shuffle list of indices
	for (var i = 0; i < 100 * children.length; i++) {
		var r = Math.floor(Math.random() * children.length);
		var tmp = children[0];
		children[0] = children[r];
		children[r] = tmp;
	}
	var t1 = performance.now();
	for (var i = 0; i < children.length; i++) {
		parent.removeChild(children[i]);
	}
	var t2 = performance.now();
	return t2 - t1;
};

var iterateThroughChildrenForwards = function(n) {
	var t1 = performance.now();
	var child = parent.firstChild;
	while (child) {
		child = child.nextSibling;
	}
	var t2 = performance.now();
	return t2 - t1;
};

var iterateThroughChildrenBackwards = function(n) {
	var child = parent.lastChild;
	var t1 = performance.now();
	while (child) {
		child = child.previousSibling;
	}
	var t2 = performance.now();
	return t2 - t1;
};

var lastChildSizeN = function(n) {
	var totalTime = 0;
	for (var i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
		var t1 = performance.now();
		var child = parent.lastChild;
		var t2 = performance.now();
		totalTime += t2 - t1;
	}
	removeAllChildren(parent);
	return totalTime;
}

var createNodeLists = function(n) {
	for (var i = 0; i < n; i++) {
		parent.appendChild(document.createElement('div'));
	}
	var t1 = performance.now();
	var nodeList = parent.childNodes;
	var t2 = performance.now();
	removeAllChildren(parent);
	return t2 - t1;
};

var nodeListForwards = function(n) {
	var nodeList = parent.childNodes;
	var t1 = performance.now();
	for (var i = 0; i < nodeList.length; i++) {
		var child = nodeList[i];
	}
	var t2 = performance.now();
	return t2 - t1;
}

var nodeListBackwards = function(n) {
	var nodeList = parent.childNodes;
	var t1 = performance.now();
	for (var i = nodeList.length; i >= 0; i--) {
		var child = nodeList[i];
	}
	var t2 = performance.now();
	return t2 - t1;
}

var nodeListRandom = function(n) {
	var nodeList = parent.childNodes;
	var randIndices = [];
	for (var i = 0; i < nodeList.length; i++) {
		randIndices.push(i);
	}
	for (var i = 0; i < randIndices.length * 100; i++){
		var r = Math.floor(Math.random() * randIndices.length);
		var t = randIndices[0];
		randIndices[0] =  randIndices[r];
		randIndices[r] = t;
	}

	var t1 = performance.now();
	for (var i = 0; i < randIndices.length; i++) {
		var child = nodeList[randIndices[i]];
	}
	var t2 = performance.now();
	return t2 - t1;
}

var DOM_API_BENCHMARKS = [
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
	},
	{
		task : 'Iterate randomly through 100000 child NodeList (childNodes[i])',
		nChildren : 100000,
		cb : nodeListRandom,
		preAppend : true
	}
];

// Create a basic UI to enable/disable benchmarks and set # of iterations
var generateUI = function() {
	itersInput.addEventListener('input', function(e) {
		validInput();
	});
	itersInput.value = '1000';
	// Create ui elements for each benchmark
	for (var i = 0; i < DOM_API_BENCHMARKS.length; i++) {
		var bm = DOM_API_BENCHMARKS[i];
		var wrapper = document.createElement('p');
		var checkbox = document.createElement('input');
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
var checkBoxEventHandle = function(bm, cb) {
	return function() {
		bm.run = cb.checked;
	};
}

// Make sure iterations input is a positive integer
var validInput = function() {
	if (/[^0-9]/g.test(itersInput.value)) {
		startBtn.disabled = true;
	} else {
		startBtn.disabled = false;
	}
}

// Run each enabled benchmark # of iterations times and take an average of the time.
var runBenchmarks = function() {
	var iterations = parseInt(itersInput.value);
	var outputWrapper = document.getElementById('output');
	removeAllChildren(outputWrapper); // Clear previous output

	var startTime = performance.now();
	for (var i = 0; i < DOM_API_BENCHMARKS.length; i++) {
		var bm = DOM_API_BENCHMARKS[i];
		if (!bm.run) continue;
		// Remove any children left from previous benchmarks.
		removeAllChildren(parent);
		// Append children for benchmark if needed
		if (bm.preAppend) {
			for (var j = 0; j < bm.nChildren; j++) {
				parent.appendChild(document.createElement('div'));
			}
		}

		// Run benchmarks
		var totalTime = 0;
		for (var t = 0; t < iterations; t++) {
			totalTime += bm.cb(bm.nChildren);
		}
		totalTime = totalTime / iterations;

		// Output result
		msgToDOMandConsole(
			bm.task + ' benchmark: ' + totalTime.toFixed(3) + ' ms.',
			outputWrapper);
	}
	var endTime = performance.now();
	msgToDOMandConsole(
		'Benchmarks ran in ' + ((endTime-startTime) / 1000).toFixed(2) + ' seconds.',
		outputWrapper);
};

// Helpers

var msgToDOMandConsole = function(msg, wrapper) {
	var newResult = document.createElement('p');
	newResult.innerHTML = msg;
	wrapper.appendChild(newResult);
	console.log(msg);
};

var removeAllChildren = function(p) {
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
};

window.onload = function() {
	generateUI();
	validInput(document.getElementById('iters_input').value);
};
