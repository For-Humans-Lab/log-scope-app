import { Route } from "_/model/Route";

export default function (route: Route): Route[] {
    const accum: Route = []
    return route.map(r => {
        accum.push(r)
        return [...accum]
    })
}