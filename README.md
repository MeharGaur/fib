# fib

3D visualization to understand how much of an improvement memoization makes to the time complexity of dynamic programming problems such as computing the fibonacci sequence.

The computation for each spiral takes place in its own WebWorker thread so they can run independently. JS has a synchronous call stack meaning if they run on the same thread then they will finish in the same order the code was written. More importantly, the recursive calls will also completely freeze the UI. Multithreading is critical in this project as browsers use the main thread for UI, meaning expensive operations can tank the frame rate.


## Developing

Install dependencies with `npm install` (or `pnpm install` or `yarn`), then start the development server:

```bash
npm run dev
```


## Building

Configured for the SvelteKit static adapter. Production build is just a bunch of static files you can deploy anywhere.

```bash
npm run build
```
