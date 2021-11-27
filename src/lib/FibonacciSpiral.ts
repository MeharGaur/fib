import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Vector2, Vector3 } from "three"
import { makeFibonacciComputer } from "./Fibonacci"


export class FibonacciSpiral extends Line {
    
    private currentFibonacci: number

    currentIndex: number
    computeNthFibonacci: (index: number) => number

    constructor({ shouldMemoize = false } = { }) {
        
        // Create the Line object to add to the scene
        const geometry = new BufferGeometry()
        const material = new LineBasicMaterial({ color : 0xff0000 })
        
        super( geometry, material )

        // Generate points and initial curve
        const coordinateCount = 10
        const coordinates = [ ]

        for (let n = 0; n < coordinateCount; n++) {
            const theta = Math.PI / 2
            const thetaProgress = n / (coordinateCount - 1)
            const arcPoint = this.pointOnArc(0, 0, theta * thetaProgress, 1)

            const x = arcPoint.x
            const y = 0 // n / 2
            const z = arcPoint.y

            coordinates[ n ] = new Vector3(x, y, z)
        }

        const curve = new CatmullRomCurve3(coordinates)
        const points = curve.getPoints( 10 * coordinateCount )

        this.geometry.setFromPoints(points)

        // Determine whether computeNthFibonacci should be memoized or not
        this.computeNthFibonacci = makeFibonacciComputer({ shouldMemoize })
        
        // Start the fibonacci computation
        this.currentIndex = 0

        // this.startComputation()
    }


    // ***** TODO: Need to calculate x,y coords for the arc now.
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

    /** Calculate a point on an arc */
    private pointOnArc(centerX, centerY, theta, radius) {
        const x = centerX + ( radius * -Math.cos(theta) )
        const y = centerY + ( radius * Math.sin(theta) )
    
        return new Vector2(x, y)
    }

}
