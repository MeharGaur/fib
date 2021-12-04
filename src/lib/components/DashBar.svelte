<!--—————————— MARKUP ——————————-->
{#if mounted}
    <div class="dash-bar">
        <div class="dash-bar__column dash-bar__column--brute-force">
            <div class="dash-bar__heading">
                Brute-force Approach
            </div>
            <span>
                The brute-force spiral has computed
                <span class="dash-bar__index">
                    <strong>{ bruteForceSpiral.currentIndex }</strong> 
                </span>
                fibonacci numbers so far!
            </span>
        </div>
        <div class="dash-bar__column dash-bar__column--memoized">
            <div class="dash-bar__heading">
                Memoization Approach
            </div>
            <span>
                The memoized spiral has computed 
                <span class="dash-bar__index">
                    <strong>{ memoizedSpiral.currentIndex }</strong> 
                </span>
                fibonacci numbers so far!
            </span>
        </div>
    </div>
{/if}


<!--—————————— SCRIPTS ——————————-->
<script lang="ts">
    import type FibonacciSpiral from "$lib/FibonacciSpiral"
    import { EventCode } from "$lib/FibonacciSpiral"
    import gsap from "gsap"
    import { onMount } from "svelte"

    // Props
    export let bruteForceSpiral: FibonacciSpiral
    export let memoizedSpiral: FibonacciSpiral

    let mounted = false

    onMount(async () => {
        mounted = true
        
        // Throw this onMount call onto the Task Queue so it runs after all other synchronous code
        await new Promise(resolve => setTimeout(resolve, 0))

        const bruteForceIndex = document.querySelector('.dash-bar__column--brute-force strong')
        const memoizedIndex = document.querySelector('.dash-bar__column--memoized strong')

        bruteForceSpiral.on(
            EventCode.SpiralUpdate, 
            () => {
                flipIndexText(bruteForceIndex)
                // Force svelte to react to changes by reassigning to itself
                bruteForceSpiral = bruteForceSpiral
            }
        )

        memoizedSpiral.on(
            EventCode.SpiralUpdate, 
            () => {
                flipIndexText(memoizedIndex)
                memoizedSpiral = memoizedSpiral
            }
        )
    })

    function flipIndexText (element: Element) {
        gsap.timeline()
            .to(element, {
                y: '-100%',
                opacity: 0.4,
                duration: 0.25
            })
            .fromTo(element, {
                y: '100%',
                opacity: 0.5,
                duration: 0.3
            }, {
                y: '0%',
                opacity: 1
            })
    }

</script>


<!--—————————— STYLES ——————————-->
<style lang="scss">
    .dash-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;

        color: white;
        width: 100vw;
        display: flex;
        flex-flow: row wrap;

        &__column {
            flex: 50%;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            padding: 1.25rem 0 2.5rem 0;
            font-size: 1.25rem;
            transform: translateY(1rem);
            // 👇 Deal with antialiasing issue after transforming text
            backface-visibility: hidden;
            transition: 0.3s ease;
            transition-property: transform, border-radius;

            &:hover {
                transform: translateY(0rem);
                border-radius: 30px 30px 0 0;
            }

            &--brute-force {
                background-color: #FF00FF99;
                backdrop-filter: blur(20px);
                border-radius: 30px 0 0 0;
            }

            &--memoized {
                background-color: #00FFFF99;
                backdrop-filter: blur(20px);
                border-radius: 0 30px 0 0;
            }
        }

        &__heading {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
        }

        &__index {
            display: inline-block;
            overflow: hidden;
            margin: 0 2px -3px 2px;
            letter-spacing: 1px;

            strong {
                display: inline-block;
                backface-visibility: hidden;
            }
        }
    }
</style>