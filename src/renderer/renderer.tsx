/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { spawn } from 'child_process';

interface DataLine {
    linenumber: number,
    data: string
}

function showOut(out: DataLine[]) {
    if (out.length == 0)
        return (<div>Program not running</div>)
    else
        return (
            <div>
                Program out:
                <div>
                    {out.map(p => <><b>{p.linenumber}</b>. <div>{p.data}</div> </>)}
                </div>
            </div>
        )
}

function App() {
    const [out, setOut] = React.useState<DataLine[]>([])

    function run() {
        var linenumber: number = 0

        const process = spawn('./emulate_realtime_stdout.sh', ['log_tin_example', '10'])

        process.stdout.on('data', (data: Buffer) => {
            var lines = data.toString().split('\n')
            var datalines: DataLine[] = []
            for (var i in lines) {
                if (lines[i].length == 0)
                    continue

                linenumber++
                datalines.push({ linenumber, data: lines[i] })
            }

            setOut((oldout) => [...oldout, ...datalines])
            // console.log(data.toString().split('\n'))
        });

        process.stderr.on('data', (data: Buffer) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (_code: any) => {
            setOut([])
        });
    }

    return (
        <div>
            <div><button onClick={run}>Run</button></div>
            {showOut(out)}
        </div>
    )
}


ReactDOM.render(<App />,
    document.getElementById('app'),
);

