export default function (routeA: string[], routeB: string[]) {
    if (routeA.length > routeB.length)
        return

    for (let i = 0; i < routeA.length; i++)
        if (routeA[i] != routeB[i])
            return false

    return true
}