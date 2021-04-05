import { Route } from "_/model/Route"


export default function genTreeFromRoutes(routes: Route[], selected: Route[], route: Route) {
    const leafs: any[] = [] // aka results
    const routeGroups: Map<string, Route[]> = new Map() // routes grouped by first element
    const selectionGroups: Map<string, Route[]> = new Map() // the same for selections
    const isGroupChecks: Map<string, boolean> = new Map()

    for (let r of routes) {
        if (r.length) {
            const f = r[0] // extract current root
            const selectedChuldren = selected.filter(p => p.length && p[0] == f) // filter look-a-like routes
            isGroupChecks.set(f, selectedChuldren.some(p => p.length == 1 && p[0] == f) && !!selected.length) // are selections contain this root

            const selectedInherited = selectedChuldren.filter(s => s.length > 0).map(s => s.slice(1)) // remove root
            const routesInherited = r.slice(1) // the same for routes

            if (!routeGroups.has(f)) { // add if empty
                selectionGroups.set(f, selectedInherited)
                routeGroups.set(f, [routesInherited])
            } else { // merge
                selectionGroups.set(f, [...selectionGroups.get(f)!, ...selectedInherited])
                routeGroups.set(f, [...routeGroups.get(f)!, routesInherited])
            }
        }
    }

    for (let gName of routeGroups.keys()) { // for every root
        const next = routeGroups.get(gName)!
        const cRoute = [...route, gName]
        const children = genTreeFromRoutes(next, selectionGroups.get(gName)!, cRoute) // recursively find leafs
        leafs.push({
            name: gName,
            children,
            isExpanded: !!children.length,
            isChecked: isGroupChecks.get(gName),
            route: cRoute
        })
    }

    return leafs
}