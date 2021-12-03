
function memoize(
    callback: (...any) => any, 
    cache: Map<string, any> = new Map()
) {

    return (...args) => {
        const hash = String(args)

        if (cache.has(hash)) {
            return cache.get(hash)
        }
        else {
            cache.set(hash, callback(...args))

            return cache.get(hash)
        }
    }
}

export default memoize
