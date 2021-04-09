import { truncate } from "lodash"
import { EventRoute } from "_/model/EventRoute"


export default function genTreeFromRoutes(routes: EventRoute[], parts?: string[]) {
    const leafs: any[] = [] // aka results
    const routeGroups: Map<string, EventRoute[]> = new Map() // routes grouped by first element
    const rootRoutes: Map<string, EventRoute> = new Map()

    for (let r of routes) {
        const root = r.parts[0]

        if (r.parts.length == 0)
            continue;

        r.parts.shift()

        if (r.parts.length == 0) {
            rootRoutes.set(root, r)
        }

        let group = routeGroups.get(root)
        if (!group) {
            group = []
            routeGroups.set(root, group)
        }

        group!.push(r)
    }

    for (let gName of routeGroups.keys()) { // for every root
        const next = routeGroups.get(gName)!
        const cRoute = [...(parts || []), gName]
        const children = genTreeFromRoutes(next, cRoute) // recursively find leafs
        const rootRoute = rootRoutes.get(gName)!
        leafs.push({
            name: gName,
            id: rootRoute.id,
            children,
            onChange: () => { },
            isExpanded: !!children.length,
            isChecked: rootRoute?.isActive,
        })
    }


    return leafs
}