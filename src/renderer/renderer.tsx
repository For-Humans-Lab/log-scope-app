/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

const { spawn } = require('child_process');

function App(props: {}) {
  const [out, setOut] = React.useState<string[]>([])

  React.useEffect(() => {
    const ls = spawn('npx', ['run', 'start'], {cwd:__dirname+'../'}) as any;
    console.log(__dirname)
    ls.stdout.on('data', (data: Buffer) => {
      setOut([...out, data.toString()])
    });

    ls.stderr.on('data', (data: Buffer) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
    });
  }, [])

  return (
    <div>
      {out.map(p=><div>{p}</div>)}
    </div>
  )
}


ReactDOM.render(<App />,
  document.getElementById('app'),
);