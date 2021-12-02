import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Scene, Vector2, Vector3 } from "three"
import type { ColorRepresentation } from "three"
import { makeFibonacciComputer } from "./Fibonacci"
import ValueBuffer from "./ValueBuffer"


export class FibonacciSpiral {

    /** Map for registering event handlers */
    private eventHandlers = events
    
    private recentFibonaccis: ValueBuffer = new ValueBuffer(2)
    private currentFibonacci = 0

    private arcs: Line[ ] = [ ]
    private arcMaterial: LineBasicMaterial
    private arcCenter = new Vector2(0, 0)

    currentIndex: number
    computeNthFibonacci: (index: number) => number
    
    constructor (
        private scene: Scene, 
        public color: ColorRepresentation, 
        public shouldMemoize: boolean
    ) {
        this.arcMaterial = new LineBasicMaterial({ color })

        // Determine whether computeNthFibonacci should be memoized or not
        this.computeNthFibonacci = makeFibonacciComputer(shouldMemoize)
        
        // Start the fibonacci computation
        this.startComputation()
    }


    private async startComputation () {
        this.currentIndex = 1

        while (true) {
            this.currentFibonacci = this.computeNthFibonacci(
                this.currentIndex
            )

            this.updateSpiral()

            this.emit('spiralUpdate')
            
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
             * ****** Make them overlap on top of each other instead of side by side
             * 
             * Then do UI, show "The memoized spiral has computed 36 fibonacci numbers so far"
             */
            


            // Minimum delay, allows for consistent animation 
            await new Promise(resolve => setTimeout(resolve, 750))
            
            this.recentFibonaccis.push(this.currentFibonacci)
            this.currentIndex++
        }
    }


    private updateSpiral () {
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
        
        const points = curve.getPoints(50).map((point) => (
            new Vector3(
                point.x, 
                point.length(), 
                -point.y
            )
        ))

        const geometry = new BufferGeometry().setFromPoints(points)
        const material = this.arcMaterial

        const newArc = new Line(geometry, material)
        this.arcs.push(newArc)
        this.scene.add(newArc)
    }

    
    /** Register event handler. TODO: enum for possible events */
    on (eventCode: string, callback: Function) {
        this.eventHandlers[ eventCode ].push(callback)
    }


    private emit (eventCode: string) {
        for (const handler of this.eventHandlers[ eventCode ]) {
            if (eventCode == 'spiralUpdate') {
                handler(this.currentFibonacci)
            }
            else {
                handler()
            }
        }
    }

}


enum Directions {
    'Left' = 0,
    'Down' = 1,
    'Right' = 2,
    'Up' = 3
}


interface Events {
    [ key: string ]: Function[ ]
}

/** TODO: this should be a class so we don't need to mutate global constant */
const events: Events = {
    'spiralUpdate': [ ]
}
