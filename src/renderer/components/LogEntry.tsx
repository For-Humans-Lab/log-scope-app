import * as React from "react";
import { LogEntry } from "_/model/LogEntry";

export default function LogEntryItem({ entry }: { entry: LogEntry }) {
    return (
        <div>
            <div>
                unparsed:
            {' '}
                {entry.debugUnparsed}
            </div>
            <div>
                route:
            {' '}
                {entry.route}
            </div>
            <div>
                text:
            {' '}
                {entry.text}
            </div>
            <div>
                object:
            {' '}
                {entry.object}
            </div>
        </div>
    );
  }