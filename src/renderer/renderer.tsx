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
import ActivityBadge from './components/ActivityBadge';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MENU_BAR_HEIGHT = 50

function App() {
  const [logEntries, setLogEntries] = React.useState<LogEntry[]>([]);
  const [isProcessActive, setIsProcessActive] = React.useState(false)

  function handleRestart() {
    setLogEntries([])
    toast("App launched", {
      style:{
        backgroundColor:"gray",
        color: "black"
      }
    })
  }

  function startListening() {
    const process = spawn('./emulate_realtime_stdout.sh',
      ['log_tin_example', '10']);

    setIsProcessActive(true)

    process.stdout.on('data', (databuffer: Buffer) => {
      const lines = databuffer.toString().split('\n');
      const logentries: LogEntry[] = [];

      for (const l of lines) {
        if (l.length == 0)
          continue;

        if (l.includes("BUNDLE")) {
          handleRestart()
          continue
        }
        const entry = extractLogEntryFromRawText(l.toString())
        console.log(entry)
        logentries.push(entry);
      }

      setLogEntries((oldlogentries) => [...oldlogentries, ...logentries]);
    });

    process.stderr.on('data', (data: Buffer) => {
      console.log(`stderr: ${data}`);
    });

    process.on('close', (_code: number) => {
      setIsProcessActive(false)
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
          <ActivityBadge isActive={isProcessActive} />
        </MenuBar>
        <div style={{ height: `calc(100% - ${MENU_BAR_HEIGHT}px - 1px)` }}>
          <LogEntryList entries={logEntries} />
        </div>
      </Content>
      <RightSideBar>
        <LogEntryDetails />
      </RightSideBar>
      <ToastContainer/>
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
  border-right: 1px solid gray
`

const Content = styled.div`
  background-color: #3f3f3f;
  flex:1;
`

const RightSideBar = styled.div`
  width:300px;
  border-left: 1px solid gray
`

const MenuBar = styled.div`
  height: ${MENU_BAR_HEIGHT}px;
  flex-direction: row;
  border-bottom:1px solid gray;
  display: flex;
`

ReactDOM.render(<App />,
  document.getElementById('app'));