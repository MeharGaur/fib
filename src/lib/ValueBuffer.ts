
/**
 * Fixed-size value buffer.
 * Essentially an array that will only store up to N-number of values. 
 * Any additional values added overwrite the oldest values.
 */
export default class ValueBuffer {

    private _maxSize: number
    array: any[ ] = [ ]

    constructor(maxSize) {
        this.maxSize = maxSize
    }

    get maxSize() {
        return this._maxSize
    }

    set maxSize(newSize: number) {
        this._maxSize = newSize
        this.array.length = newSize
    }

    push(value) {
        this.array.unshift(value)

        if (this.array.length > this._maxSize) {
            this.array.pop()
        }
    }

}
