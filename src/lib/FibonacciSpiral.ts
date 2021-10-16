import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Vector3 } from "three"


export class FibonacciSpiral extends Line {

    constructor( memoize: boolean = false ) {

        const coordinateCount = 100
        const coordinates = [ ]

        for (let i = 0; i < coordinateCount; i++) {
            const x = Math.cos(i)
            const z = Math.sin(i)
            coordinates[ i ] = new Vector3(x, i, z)
        }
        
        const curve = new CatmullRomCurve3(coordinates)

        const points = curve.getPoints( 10 * coordinateCount )
        
        const geometry = new BufferGeometry().setFromPoints( points )

        const material = new LineBasicMaterial( { color : 0xff0000 } )

        // Create the final Line to add to the scene
        super( geometry, material )
    }

}
