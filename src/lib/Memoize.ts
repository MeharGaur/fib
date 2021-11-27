
export function memoize(
    callback: (...any) => any, 
    cache: Map<string, any> = new Map()
) {

    return (...args) => {
        const hash = String(args)

        if (cache.has(hash)) {
            console.log('xddd', hash)
            return cache.get(hash)
        }
        else {
            cache.set(hash, callback(...args))

            return cache.get(hash)
        }
    }
}
