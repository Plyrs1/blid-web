<script lang="ts">
    const raceType = {
        circuit: '/assets/icon/circuit.png',
        drag: '/assets/icon/drag.png',
        pursuit_mp: '/assets/icon/pursuit_mp.png',
        pursuit_sp: '/assets/icon/pursuit_sp.png',
        sprint: '/assets/icon/sprint.png',
    } as const

    type RaceType = keyof typeof raceType

    const randomRace = () => {
        const arr = Object.keys(raceType)
        const rnd = Math.floor(Math.random()*arr.length)
        // TODO: find other alternative
        //       this hack won't work on server-side rendering
        return new URL(raceType[arr[rnd] as RaceType], import.meta.url).href
    }

    const carType = {
        s: '/assets/icon/class/s.png',
        a: '/assets/icon/class/a.png',
        b: '/assets/icon/class/b.png',
        c: '/assets/icon/class/c.png',
        d: '/assets/icon/class/d.png',
        e: '/assets/icon/class/e.png',
    } as const

    type CarType = keyof typeof carType

    const randomCarType = () => {
        const arr = Object.keys(carType)
        const rnd = Math.floor(Math.random()*arr.length)
        // TODO: find other alternative
        //       this hack won't work on server-side rendering
        return new URL(carType[arr[rnd] as CarType], import.meta.url).href
    }

    export let imgUrl = '/assets/img/car1.png'
</script>

<div class="flex flex-col backdrop-blur-md bg-black/20 rounded-lg overflow-hidden hover:outline hover:outline-4 hover:outline-white hover:outline-offset-2">
    <div class="bg-center w-full h-32" style="background-image:url('{imgUrl}')">
        <div class="grid grid-flow-row md:grid-flow-col justify-end align-bottom content-end gap-1 p-1 w-full h-full overflow-hidden bg-black/40">
            <div class="px-2 py-[1px] border-[1px] h-min border-white rounded-md text-white text-sm hover:bg-black/40">$ 100.000</div>
            <div class="px-2 py-[1px] border-[1px] h-min border-white rounded-md text-white text-sm hover:bg-black/40">99 Challenger</div>
            <div class="h-min text-end place-self-end">
                <img class="h-6 aspect-square" src="{randomCarType()}" alt="" />
            </div>
        </div>
    </div>
    <!-- div style="padding: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex" -->
    <div class="flex flex-col p-4 gap-2 items-start">
        <div class="gap-2 inline-flex">
        <!-- div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex" -->
            <img class="h-8" src="{randomRace()}" alt="" />
            <div class="text-white text-lg">Name</div>
        </div>
        <div class="gap-2 inline-flex">
            <img class="h-8" src="{randomRace()}" alt="" />
            <div class="text-white text-lg">Speed Limit</div>
        </div>
        <div class="gap-2 inline-flex">
            <img class="h-8" src="{randomRace()}" alt="" />
            <div class="text-white text-lg">Time Limit</div>
        </div>
        <div class="gap-2 inline-flex">
            <img class="h-8" src="{randomRace()}" alt="" />
            <div class="text-white text-lg">Car</div>
        </div>
        <div class="gap-2 inline-flex">
            <img class="h-8" src="{randomRace()}" alt="" />
            <div class="text-white text-lg">Power Up</div>
        </div>
    </div>
</div>