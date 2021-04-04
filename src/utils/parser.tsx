export interface LogEntry {
    route: string
    text: string
    object: string
    debug_unparsed: string
}

export function parseDataLine(data: string) {
    var route: string = ""
    var text: string = ""
    var object: string = ""

    var t = data.split("->")
    route = t[0]

    t = t[1].split("|")
    text = t[0]

    object = t[1]

    return { route, text, object, debug_unparsed: data }
}
