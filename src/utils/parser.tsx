export interface LogEntry {
  route: string
  text: string
  object: string
  debugUnparsed: string
}

export function parseDataLine(data: string): LogEntry {
  let route = '';
  let text = '';
  let object = '';

  let t = data.split('->');
  [route] = t;

  t = t[1].split('|');
  [text, object] = t;

  return {
    route, text, object, debugUnparsed: data,
  };
}
