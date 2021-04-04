/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components'
import { spawn } from 'child_process';
import { LogEntry } from '_/model/LogEntry';
import LogEntryItem from './components/LogEntry';
import { extractLogEntryFromRawText } from '_/utils/extractLogEntryFromRawText';
import LogEntryList from './LogEntriesList/LogEntriesList';
import LogEntryDetails from './LogEntryDetails/LogEntryDetails';
import TreeFilter from './TreeFilter/TreeFilter';

const MENU_BAR_HEIGHT=50

function App() {
  const [logEntries, setLogEntries] = React.useState<LogEntry[]>([]);
 x

  function startListening() {
    const process = spawn('./emulate_realtime_stdout.sh',
      ['log_tin_example', '10']);

    process.stdout.on('data', (databuffer: Buffer) => {
      const lines = databuffer.toString().split('\n');
      const logentries: LogEntry[] = [];

      for (const i in lines) {
        if (lines[i].length == 0) continue;

        const data = lines[i];

        logentries.push(extractLogEntryFromRawText(data.toString()));
      }

      setLogEntries((oldlogentries) => [...oldlogentries, ...logentries]);
    });

    process.stderr.on('data', (data: Buffer) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (_code: number) => {
      setLogEntries([]);
    });
  }

  return (
    <Container>
      <LeftSideBar>
        <TreeFilter />
      </LeftSideBar>
      <Content>
        <MenuBar>
          <button onClick={startListening}>Run</button>
        </MenuBar>
        <div style={{height:`calc(100% - ${MENU_BAR_HEIGHT}px)`}}>
          <LogEntryList entries={logEntries} />
        </div>
      </Content>
      <RightSideBar>
        <LogEntryDetails />
      </RightSideBar>
    </Container>
  );
}

const Container = styled.div`
  flex-direction:row;
  display: flex;
  height: 100%;
`

const LeftSideBar = styled.div`
  width:300px;
`

const Content = styled.div`
  flex:1;
`

const RightSideBar = styled.div`
  width:300px;
`

const MenuBar = styled.div`
  height: ${MENU_BAR_HEIGHT}px;
  background-color: #3d3d3d;
`

ReactDOM.render(<App />,
  document.getElementById('app'));