
export function fibonacci(n) {
    // Base case
    if (n <= 0) {
        return 0
    }
    else if (n == 1 || n == 2) {
        return 1
    }

    // Recursice case
    return fibonacci(n - 1) + fibonacci(n - 2)
}
