import { memoize } from "./Memoize"


export function makeFibonacciComputer(shouldMemoize = false) {

    // Base fibonacci computer that computes nth fibonacci number
    let fibonacci = (n) => {
        // Base case
        if (n <= 0) {
            return 0
        }
        else if (n == 1 || n == 2) {
            return 1
        }

        // Recursive case
        return fibonacci(n - 1) + fibonacci(n - 2)
    }

    // Memoize if asked to
    if (shouldMemoize) {
        fibonacci = memoize(fibonacci)
    }

    return fibonacci
}


