import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Vector3 } from "three"
import { makeFibonacciComputer } from "./Fibonacci"


export class FibonacciSpiral extends Line {
    
    private currentFibonacci: number

    currentIndex: number
    computeNthFibonacci: (index: number) => number

    constructor({ shouldMemoize = false } = { }) {

        const coordinateCount = 10
        const coordinates = [ ]

        for (let n = 0; n < coordinateCount; n++) {
            const x = Math.cos(n)
            const y = n
            const z = Math.sin(n)

            coordinates[ n ] = new Vector3(x, y, z)
        }
        
        const curve = new CatmullRomCurve3(coordinates)

        const points = curve.getPoints( 10 * coordinateCount )
        
        const geometry = new BufferGeometry().setFromPoints( points )

        const material = new LineBasicMaterial({ color : 0xff0000 })

        // Create the final Line to add to the scene
        super( geometry, material )

        // Determine whether computeNthFibonacci should be memoized or not
        this.computeNthFibonacci = makeFibonacciComputer({ shouldMemoize })
        
        // Start the fibonacci computation
        this.currentIndex = 0

        this.startComputation()
    }


    // TODO: Need to calculate x,y coords for the arc now.
    // perhaps just do the "draw square" and then "draw arc" like the processing gist


    private async startComputation() {
        while (true) {
            this.currentFibonacci = this.computeNthFibonacci(
                this.currentIndex
            )

            console.log(`The ${ this.currentIndex }th fibonacci number is ${ this.currentFibonacci }`)

            this.currentIndex++
            
            // Minimum 1 second delay between fib numbers
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

}
