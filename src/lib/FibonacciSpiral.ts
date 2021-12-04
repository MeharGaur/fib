import { BufferGeometry, EllipseCurve, Line, LineBasicMaterial, Scene, Vector2, Vector3 } from "three"
import type { ColorRepresentation } from "three"
import { wrap } from "comlink"

import ValueBuffer from "./ValueBuffer"
import FibonacciWorkerConstructor from './FibonacciWorker?worker'
import type { FibonacciWorker } from './FibonacciWorker'

class FibonacciSpiral {

    /** Map for registering event handlers */
    private eventHandlers: Map<EventCode, Function[ ]> = new Map()
    private recentFibonaccis: ValueBuffer = new ValueBuffer(2)
    private worker: FibonacciWorker
    
    private arcs: Line[ ] = [ ]
    private arcMaterial: LineBasicMaterial
    private arcCenter = new Vector2(0, 0)
    
    public currentFibonacci = 0
    public currentIndex: number = 1
    
    constructor (
        private scene: Scene, 
        public color: ColorRepresentation, 
        public shouldMemoize: boolean
    ) {
        this.arcMaterial = new LineBasicMaterial({ color })

        // Initialize eventHandlers map with an empty array for each possible event code
        for (const eventCode in EventCode) {
            this.eventHandlers.set( EventCode[eventCode], [ ] )
        }

        // Start the fibonacci computation
        this.startComputation()
    }


    private async startComputation () {
        // Spawn worker for fibonacci computation
        const FibonacciWorker = wrap(
            new FibonacciWorkerConstructor()
        )
        
        // @ts-ignore
        this.worker = await new FibonacciWorker(this.shouldMemoize)

        while (true) { 
            this.currentFibonacci = await this.worker.computeNthFibonacci(
                this.currentIndex
            )

            this.updateSpiral()

            this.emit(EventCode.SpiralUpdate)
            
            // Minimum delay, allows for consistent animation 
            await new Promise(resolve => setTimeout(resolve, 750))
            
            this.recentFibonaccis.push(this.currentFibonacci)
            this.currentIndex++
        }
    }


    private updateSpiral () {
        // Determine which direction to move center point
        const direction: Direction = (this.currentIndex - 1) % 4

        // Calculate the magnitude to move center point
        const magnitude = -(this.recentFibonaccis.array[1] ?? 0)

        // Calculate center/origin coordinate
        if (direction == Direction.Left) {
            this.arcCenter.x -= magnitude
        }
        else if (direction == Direction.Down) {
            this.arcCenter.y -= magnitude
        }
        else if (direction == Direction.Right) {
            this.arcCenter.x += magnitude
        }
        else if (direction == Direction.Up) {
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
                point.length(), // Length of vector using pythagorean theorem.
                -point.y
            )
        ))

        const geometry = new BufferGeometry().setFromPoints(points)
        const material = this.arcMaterial

        const newArc = new Line(geometry, material)
        this.arcs.push(newArc)
        this.scene.add(newArc)
    }

    
    /** Register an event handler callback */
    on (eventCode: EventCode, callback: Function) {
        this.eventHandlers.get(eventCode).push(callback)
    }


    private emit (eventCode: EventCode) {
        for (const handler of this.eventHandlers.get(eventCode)) {
            handler(this.currentIndex, this.currentFibonacci)
        }
    }

}


enum Direction {
    Left = 0,
    Down = 1,
    Right = 2,
    Up = 3
}


enum EventCode {
    SpiralUpdate = 'spiralUpdate'
}


export default FibonacciSpiral

export { EventCode }
