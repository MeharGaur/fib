
- Use GSAP splittext to transition from the current fibonacci number to the new freshly computed one. Keep a "counter" of sorts at the bottom of the screen for each spiral.

- Zoom out the camera according to the largest spiral (memoized spiral) 



- Every time a fib number gets computed, compute the next number in the sequence immediately after. Do not move to next number until current one has been computed. Will need to put each spiral in its own worker thread so they can run independently. JS has synchronous call stack meaning if they run on same thread then they will finish in same order the code was written. 

memo | no memo
———————————
f(1) | f(1)
f(2) | f(2)
f(3) | f(3)
... keeps computing infinitely

Only difference is that the memoized one will crunch through the function calls much faster. 

