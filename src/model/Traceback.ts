export interface TracebackEntry{
    invocation: string,
    bundle: string
}

export default class Traceback {
    id: number
    title:string
    entries: TracebackEntry[]

    constructor(
        public text: string
    ) {
        this.id = Math.random()
        const titleRegex = /Possible Unhandled Promise Rejection\s\(id:\s\d+\):(?<error>[^(]+)/gm
        const entriesRegex = /\(http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/(?<bundle>[^?]+)\?[^)]+\)(?<entry>[^:]+)\(http[^)]+\)/gm

        const title = titleRegex.exec(text)?.groups!["error"] || "<No invocation info>"
        const entries:TracebackEntry[] = []
        let entryMatch;
        do {
            entryMatch = entriesRegex.exec(text)
            console.log("Match", entryMatch?.groups)
            if (!entryMatch)
                continue;
            entries.push({
                bundle: entryMatch.groups!["bundle"],
                invocation: entryMatch.groups!["entry"].replace("\n","").replace("at","").trim()
            })
        } while (entryMatch)

        this.entries = entries
        this.title = title
    }
}