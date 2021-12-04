<!--—————————— MARKUP ——————————-->
<svelte:head>
  <title>Fibonacci — Mehar Gaur</title>
</svelte:head>

<canvas bind:this={canvas} />

<DashBar 
    { bruteForceSpiral }
    { memoizedSpiral }
/>


<!--—————————— SCRIPTS ——————————-->
<script context="module">
	export const ssr = false
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    
    import { gsap } from 'gsap'
    import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

    import DashBar from '$lib/components/DashBar.svelte'
    import FibonacciSpiral, { EventCode } from '$lib/FibonacciSpiral'

    // Canvas
    let canvas: HTMLCanvasElement

    const sizes = { width: 0, height: 0 }

    // Fibonacci Spirals
    let memoizedSpiral: FibonacciSpiral
    let bruteForceSpiral: FibonacciSpiral

    onMount(() => {
        // ————————— 3D World —————————

        // Scene
        const scene = new Scene()

        // Instantiate Fibonacci Spiral
        memoizedSpiral = new FibonacciSpiral(scene, 0x00ffff, true)
        // Brute-force second because we want it to overlap
        bruteForceSpiral = new FibonacciSpiral(scene, 0xff00ff, false) 

        // Zoom out the camera in proportion to the spiral size.
        memoizedSpiral.on(EventCode.SpiralUpdate, 
            (currentIndex: number, currentFibonacci: number) => {
                gsap.to({ }, {
                    duration: 0.5,
                    ease: 'power1.inOut',
                    onUpdate() {
                        // The larger the divisor, the more zoomed in it is.
                        // Tween progress is a factor so that easing still shows.
                        const divisor = Math.PI * ( (this.progress() * 5) + 5 )
                        camera.translateZ( currentFibonacci / divisor )
                    }
                })
            }
        )


        // ————————— WebGL Boilerplate —————————

        // Window & Resizing
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            renderer.setSize(sizes.width, sizes.height)

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

        }, { passive: true })

        // Camera
        const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 1, 999_999_999_999_999_999_999_999)
        camera.position.x = 10
        camera.position.y = 25
        camera.position.z = 10

        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.enablePan = false
        controls.enableZoom = false

        // Renderer
        const renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true
        })

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x333333)

        // Render Loop
        function render() {
            // Update controls
            controls.update()

            // Render to canvas
            renderer.render(scene, camera)

            // Call render again on the next frame
            window.requestAnimationFrame(render)
        }

        // Start render loop
        render()

        // Get rid of the WebGL context onDestroy
        return function onDestroy() {
            canvas = undefined
            renderer.dispose()

            renderer.getContext()
                .getExtension('WEBGL_lose_context')
                .loseContext()
        }

    })
</script>


<!--—————————— STYLES ——————————-->

<style lang="scss">
    :root {
        font-family: Helvetica, Arial, sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
    }

    html, body {
        overflow: hidden;
    }

    canvas {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        outline: none;
        user-select: none;
        cursor: all-scroll;
    }
</style>


