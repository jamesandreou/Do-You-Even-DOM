# Do You Even DOM?
Micro benchmark tests for DOM Node WebAPI focusing on children operations.
https://developer.mozilla.org/en-US/docs/Web/API/Node
https://developer.mozilla.org/en-US/docs/Web/API/NodeList
## Usage
- Clone this repo
- Open DUED.html in the browser you want to test
- Enter the number of times to run each benchmark
- Select which benchmarks you want to run
- Click Run

**Note:** Using a high amount of iterations may take a long time run. Benchmarks will print in the console as they finish.
## Benchmarks
- Append 10000 children (appendChild)
- Remove 10000 children from front (removeChild)
- Remove 10000 children from back (removeChild)
- Remove 10000 children randomly (removeChild)
- Iterate forwards through 100000 children (nextSibling)
- Iterate backwards through 100000 children (previousSibling)
- Get the last child from 1 .. 10000 children (lastChild)
- Create NodeList object with 100000 children (childNodes)
- Iterate forwards through 10000 child NodeList (childNodes[i])
- Iterate backwards through 100000 child NodeList (childNodes[i])
- Prepend 10000 children (insertBefore(child, firstChild))
- Insert 5000 children in a node of 5000 children (insertBefore(child, child[i]))
- Replace 5000 children (replaceChild(child, child[i]))