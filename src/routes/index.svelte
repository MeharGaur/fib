<!--—————————— MARKUP ——————————-->
<svelte:head>
  <title>Fibonacci — Mehar Gaur</title>
</svelte:head>

<canvas bind:this={canvas} />


<!--—————————— SCRIPTS ——————————-->
<script context="module">
	export const ssr = false
</script>

<script lang="ts">
import { FibonacciSpiral } from '$lib/FibonacciSpiral';

    import { onMount } from 'svelte'

    import { AmbientLight, AxesHelper, BoxGeometry, Clock, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

    // Canvas
    let canvas: HTMLCanvasElement

    const sizes = { width: 0, height: 0 }

    onMount(() => {

        // ————————— 3D World —————————

        // Scene
        const scene = new Scene()

        // Instantiate Fibonacci Spiral
        const spiral = new FibonacciSpiral(scene, true)

        spiral.on('spiralUpdate', (currentFibonacci) => {
            console.log('spiral update', currentFibonacci)
            // camera.position.
        })
        // const spiralMemoized = new FibonacciSpiral(true)

        // Axes Helper
        // const axesHelper = new AxesHelper()
        // scene.add(axesHelper)

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
        const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 1, 999_999_999_999_999)
        camera.position.x = 20
        camera.position.y = 100
        camera.position.z = 20

        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.enablePan = false

        // Renderer
        const renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true
        })

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x333333)

        // Render Loop
        const clock = new Clock()

        function render() {
            const elapsedTime = clock.getElapsedTime()

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


