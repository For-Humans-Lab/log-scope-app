import { LogEntry } from "_/model/LogEntry";


export function extractLogEntryFromRawText(data: string): LogEntry {
  const pattern = /\[(?<time>.+)\]\s+LOG\s+(?<route>(\w|\s|\>)+)-\>(?<message>[^|]+)\|(?<object>.+)$/gm
  const match = pattern.exec(data.trim())


  return {
    id: Math.random().toString(),
    time: match?.groups!["time"] || "",
    route: match?.groups!["route"] || "",
    text: match?.groups!["message"] || "",
    object: match?.groups!["object"] || "",
    debugUnparsed: data,
  };
}
