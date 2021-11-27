import { BufferGeometry, CatmullRomCurve3, EllipseCurve, Line, LineBasicMaterial, Scene, Vector2, Vector3 } from "three"
import { makeFibonacciComputer } from "./Fibonacci"
import ValueBuffer from "./ValueBuffer"


export class FibonacciSpiral {
    
    private recentFibonaccis: ValueBuffer = new ValueBuffer(2)
    private currentFibonacci = 0

    private arcs: Line[ ] = [ ]
    private arcMaterial = new LineBasicMaterial({ color : 0xff0000 })
    private arcCenter = new Vector2(0, 0)

    currentIndex: number
    computeNthFibonacci: (index: number) => number
    
    constructor(private scene: Scene, shouldMemoize: boolean) {

        // Determine whether computeNthFibonacci should be memoized or not
        this.computeNthFibonacci = makeFibonacciComputer({ shouldMemoize })
        
        // Start the fibonacci computation
        this.startComputation()
    }


    // TODO: Need to calculate x,y coords for the arc now.
    // Need to transform the squares as so: right, left, up, down. 

    // *** THE CENTER POINT MOVES AS FOLLOWS: left, down, right up. 
    // ^ magnitude (how many units to move) is the (n - 2) fib number. So the last to last one of the currentFibonacci.
    //      - Need to access the memo cache to access that
    // Then the radius is just gonna be the currentFibonacci


    private async startComputation() {
        this.currentIndex = 1

        while (true) {
            this.currentFibonacci = this.computeNthFibonacci(
                this.currentIndex
            )

            console.log(`The ${ this.currentIndex }th fibonacci number is ${ this.currentFibonacci }`)

            this.updateSpiral()
            
            // Minimum 1 second delay between fib numbers
            await new Promise(resolve => setTimeout(resolve, 1_000))
            
            this.recentFibonaccis.push(this.currentFibonacci)
            this.currentIndex++
        }
    }


    private updateSpiral() {
        // Determine direction to move center point
        const direction: Directions = (this.currentIndex - 1) % 4

        // Calculate magnitude to move center point
        const magnitude = this.recentFibonaccis.array[1] ?? 0

        // Calculate center/origin coordinate
        // if (direction == Directions.Left) {
        //     this.arcCenter.x += magnitude / 2
        // }
        // else if (direction == Directions.Down) {
        //     this.arcCenter.y += magnitude / 2
        // }
        // else if (direction == Directions.Right) {
        //     this.arcCenter.x -= magnitude / 2
        // }
        // else if (direction == Directions.Up) {
        //     this.arcCenter.y -= magnitude / 2
        // }

        // Calculate radius of new arc
        const radius = this.currentFibonacci

        // Generate curve and its points
        const curve = new EllipseCurve(
            this.arcCenter.x, this.arcCenter.y,
            radius, radius,
            Math.PI, (3 * Math.PI) / 2,
            false,
            (Math.PI / 2) * this.currentIndex
        )
        const points = curve.getPoints(50).map(point => new Vector3(point.x, 0, point.y))

        const geometry = new BufferGeometry().setFromPoints(points)
        const material = this.arcMaterial

        const newArc = new Line(geometry, material)
        // newLine.rotation.y = (Math.PI * 2) * radius
        this.arcs.push(newArc)
        this.scene.add(newArc)
    }

}


enum Directions {
    'Left' = 0,
    'Down' = 1,
    'Right' = 2,
    'Up' = 3
}
