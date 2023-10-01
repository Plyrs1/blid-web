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
    }

    type CarType = keyof typeof carType

    const randomCarType = () => {
        const arr = Object.keys(carType)
        const rnd = Math.floor(Math.random()*arr.length)
        // TODO: find other alternative
        //       this hack won't work on server-side rendering
        return new URL(carType[arr[rnd] as CarType], import.meta.url).href
    }
</script>
<div class="flex flex-row p-2 gap-2 backdrop-blur-md bg-black/20 rounded-lg overflow-hidden border-2 border-white">
<!--div style="width: 100%; height: 100%; padding: 16px; background: rgba(0, 0, 0, 0.20); border-radius: 8px; overflow: hidden; border: 2px white solid; backdrop-filter: blur(20px); justify-content: space-between; align-items: flex-start; display: inline-flex" -->
    <div class="relative w-16 h-min">
        <img alt="icon" src="{randomRace()}" />
        <img alt="icon" class="absolute w-8 bottom-0 right-0" src="{randomCarType()}" />
    </div>
    <!-- <div style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: space-between; align-items: flex-start; display: inline-flex"> -->
    <div class="flex flex-col items-start">
        <div class="text-xl text-white overflow-ellipsis">Race Title</div>
        <div class="text-xl text-white overflow-ellipsis">Plyrs - 00:00.000</div>
        <div class="text-xs text-white overflow-ellipsis">Lv. 99 - 99 km</div>
    </div>
</div>