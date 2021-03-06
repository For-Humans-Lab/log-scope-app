import { LogEntry } from "_/model/LogEntry";


export function extractLogEntryFromRawText(data: string): LogEntry | undefined {
  const pattern = /(\[(?<time>.+)\]\s+)?LOG\s+(?<route>(\w|\s|\>)+)-\>(?<message>[^|]+)\|(?<object>.+)$/gm
  const match = pattern.exec(data.trim())

  if (!match?.groups!["route"])
    return
  try {
    return {
      id: Math.random().toString(),
      route: undefined,
      time: match?.groups!["time"] || "",
      routeParts: match?.groups!["route"] ? match?.groups!["route"].split(">").map(p => p.trim()) : [],
      message: match?.groups!["message"] || "",
      object: match?.groups!["object"] ? JSON.parse(match?.groups!["object"]) : {}
    };
  } catch (ex) {
    return undefined
  }

}
