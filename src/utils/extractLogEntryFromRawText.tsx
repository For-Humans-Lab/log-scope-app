import { LogEntry } from "_/model/LogEntry";

export function extractLogEntryFromRawText(data: string): LogEntry {
  let route = '';
  let text = '';
  let object = '';

  let t = data.split('->');
  [route] = t;

  t = t[1].split('|');
  [text, object] = t;

  return {
    id: Math.random().toString(),
    route,
    text,
    object,
    debugUnparsed: data,
  };
}
