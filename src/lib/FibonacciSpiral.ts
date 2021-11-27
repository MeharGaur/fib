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


    private async startComputation() {
        this.currentIndex = 1

        while (true) {
            this.currentFibonacci = this.computeNthFibonacci(
                this.currentIndex
            )

            this.updateSpiral()



            // TODO:
            /**
             * After every spiralUpdate, I need to zoom out
             * the camera a bit. 
             * 
             * After adding camera zoom logic, instantiate
             * a second fib spiral and then figure out 
             * parameters for positioning it. Make em different colors,
             * refer to my logo's color.
             * 
             * Then do UI, show "The memoized spiral has computed 36 fibonacci numbers so far"
             */
            


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
        const magnitude = -(this.recentFibonaccis.array[1] ?? 0)

        // Calculate center/origin coordinate
        if (direction == Directions.Left) {
            this.arcCenter.x -= magnitude
        }
        else if (direction == Directions.Down) {
            this.arcCenter.y -= magnitude
        }
        else if (direction == Directions.Right) {
            this.arcCenter.x += magnitude
        }
        else if (direction == Directions.Up) {
            this.arcCenter.y += magnitude
        }
        
        // Calculate radius of new arc
        const radius = this.currentFibonacci

        // Generate curve and its points
        const curve = new EllipseCurve(
            this.arcCenter.x, this.arcCenter.y,
            radius, radius,
            Math.PI, (3 * Math.PI) / 2,
            false,
            (Math.PI / 2) * (this.currentIndex - 1)
        )
        
        const height = this.arcs.length * 50
        const points = curve.getPoints(50)
            .map((point, index) => new Vector3(point.x, (height + index), -point.y))

        const geometry = new BufferGeometry().setFromPoints(points)
        const material = this.arcMaterial

        const newArc = new Line(geometry, material)
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
