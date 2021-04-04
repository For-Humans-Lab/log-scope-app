/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { spawn } from 'child_process';

import { LogEntry, parseDataLine } from '_utils/parser'

function showLogEntries(logentries: LogEntry[]) {
    if (logentries.length == 0)
        return (<div>Program not running</div>)
    else
        return (
            <div>
                Logs:
                <div>
                    {logentries.map(x => <>
                        {showLogEntry(x)}
                        <br></br>
                    </>)}
                </div>
            </div>
        )
}

function showLogEntry(logentry: LogEntry) {
    return (
        <div>
            <div>
                unparsed: {logentry.debug_unparsed}
            </div>
            <div>
                route: {logentry.route}
            </div>
            <div>
                text: {logentry.text}
            </div>
            <div>
                object: {logentry.object}
            </div>
        </div>
    )
}

function App() {
    const [logentries, setLogEntries] = React.useState<LogEntry[]>([])

    function run() {
        const process = spawn('./emulate_realtime_stdout.sh', ['log_tin_example', '10'])

        process.stdout.on('data', (databuffer: Buffer) => {
            var lines = databuffer.toString().split('\n')
            var logentries: LogEntry[] = []

            for (var i in lines) {
                if (lines[i].length == 0)
                    continue

                var data = lines[i]

                logentries.push(parseDataLine(data.toString()))
            }

            setLogEntries((oldlogentries) => [...oldlogentries, ...logentries])
        });

        process.stderr.on('data', (data: Buffer) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (_code: any) => {
            setLogEntries([])
        });
    }

    return (
        <div>
            <div><button onClick={run}>Run</button></div>
            {showLogEntries(logentries)}
        </div>
    )
}


ReactDOM.render(<App />,
    document.getElementById('app'),
);

