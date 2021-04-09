import { EventRoute } from "_/model/EventRoute";

export default function (route: EventRoute): EventRoute[] {
    const accum: string[] = []
    return route.parts.map(r => {
        accum.push(r)
        return new EventRoute([...accum], true)
    })
}