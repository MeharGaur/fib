<!--—————————— MARKUP ——————————-->
<div class="dash-bar">
    <div class="dash-bar__column dash-bar__column--brute-force">
        <div class="dash-bar__heading">
            Brute-force Approach
        </div>
        <span>The brute-force spiral has computed { bruteForce } fibonacci numbers so far!</span>
    </div>
    <div class="dash-bar__column dash-bar__column--memoized">
        <div class="dash-bar__heading">
            Memoization Approach
        </div>
        <span>The memoized spiral has computed { memoized } fibonacci numbers so far!</span>
    </div>
</div>


<!--—————————— SCRIPTS ——————————-->
<script lang="ts">
    import type FibonacciSpiral from "$lib/FibonacciSpiral"

    // Props
    export let bruteForceSpiral: FibonacciSpiral
    export let memoizedSpiral: FibonacciSpiral

    // TODO: Figure out how to make svelte react to the currentIndex changes
    $: bruteForce = bruteForceSpiral?.currentIndex ?? 0
    $: memoized = memoizedSpiral?.currentIndex ?? 0
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
            padding: 1rem 0 2.5rem 0;
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
                background-color: #FF00FF88;
                backdrop-filter: blur(20px);
                border-radius: 30px 0 0 0;
            }

            &--memoized {
                background-color: #00FFFF88;
                backdrop-filter: blur(20px);
                border-radius: 0 30px 0 0;
            }
        }

        &__heading {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
    }
</style>