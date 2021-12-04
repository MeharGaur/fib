// This is a WebWorker script file, gets processed by Vite

import { expose } from 'comlink'
import memoize from './memoize'

class FibonacciWorker {

    public computeNthFibonacci: (n: number) => number

    constructor (public shouldMemoize: boolean = false) {
        // Base fibonacci function that computes nth fibonacci number
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

        this.computeNthFibonacci = fibonacci
    }

}


// Comlink expose
expose(FibonacciWorker)


export type { FibonacciWorker }
