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
import isRoutesEqual from '_/utils/isRoutesEqual';
import isRouteIsSubset from '_/utils/isRouteIsSubset';
import { Route } from '_/model/Route';
import unwrapRoute from '_/utils/unwrapRoute';

const MENU_BAR_HEIGHT = 50


function App() {
  const [logEntries, setLogEntries] = React.useState<LogEntry[]>([]);
  const [isProcessActive, setIsProcessActive] = React.useState(false)
  const [selectedEntry, setSelectedEntry] = React.useState<LogEntry>()

  const [routes, setRoutes] = React.useState<Route[]>([])
  const [selectedRoutes, setSelectedRoutes] = React.useState<Route[]>([])

  function handleRestart() {
    setLogEntries([])
    toast("App launched", {
      style: {
        backgroundColor: "gray",
        color: "black"
      },
      position: 'bottom-right'
    })
  }

  function startListening() {
    const process = spawn('./emulate_realtime_stdout.sh',
      ['log_tin_example', '10']);

    setIsProcessActive(true)

    process.stdout.on('data', (databuffer: Buffer) => {
      const lines = databuffer.toString().split('\n');
      const logentries: LogEntry[] = [];
      const newRoutes: Route[] = []

      for (const l of lines) {
        if (l.length == 0)
          continue;

        if (l.includes("BUNDLE")) {
          handleRestart()
          continue
        }
        const entry = extractLogEntryFromRawText(l.toString())

        const explored = routes.find(p => isRoutesEqual(p, entry.route))
        if (!explored) {
          newRoutes.push(entry.route)
        }

        logentries.push(entry);
      }

      setLogEntries((oldlogentries) => [...oldlogentries, ...logentries]);

      const allVariationsOfRoutes = newRoutes.reduce((p, r) => [...p, ...unwrapRoute(r)], [] as Route[])
      setSelectedRoutes((selected) =>
        [...selected,
        ...allVariationsOfRoutes.filter(r => !routes.some(kr => isRoutesEqual(r, kr)))])

      setRoutes(rts => [...rts, ...newRoutes])
    });

    process.stderr.on('data', (data: Buffer) => {
      console.log(`stderr: ${data}`);
    });

    process.on('close', (_code: number) => {
      setIsProcessActive(false)
    });
  }

  function getActiveEntries() {
    console.log('render', selectedRoutes)
    return logEntries.filter(e => {
      for (const r of selectedRoutes) {
        if (isRouteIsSubset(e.route, r))
          return true
      }
      return false
    })
  }

  return (
    <Container>
      <LeftSideBar>
        <TreeFilter
          onSelectedChange={(routes) => setSelectedRoutes(routes)}
          selectedRoutes={selectedRoutes}
          routes={routes} />
      </LeftSideBar>
      <Content>
        <MenuBar>
          <button onClick={startListening}>Run</button>
          <ActivityBadge isActive={isProcessActive} />
        </MenuBar>
        <div style={{ height: `calc(100% - ${MENU_BAR_HEIGHT}px - 1px)` }}>
          <LogEntryList
            onSelect={setSelectedEntry}
            entries={getActiveEntries()} />
        </div>
      </Content>
      <RightSideBar>
        {selectedEntry ?
          <LogEntryDetails entry={selectedEntry} />
          : (
            <EntryDetailsHint>
              Select one of messages
            </EntryDetailsHint>
          )
        }

      </RightSideBar>
      <ToastContainer />
    </Container>
  );
}

const EntryDetailsHint = styled.div`
  display:flex;
  flex: 1;
  height: 100%;
  color: #a8a8a8;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  flex-direction:row;
  display: flex;
  height: 100%;
  background-color:#242424
`

const LeftSideBar = styled.div`
  width:300px;
`

const Content = styled.div`
  background-color: #3f3f3f;
  flex:1;
`

const RightSideBar = styled.div`
  width:300px;
`

const MenuBar = styled.div`
  height: ${MENU_BAR_HEIGHT}px;
  flex-direction: row;
  border-bottom:1px solid gray;
  display: flex;
`

ReactDOM.render(<App />,
  document.getElementById('app'));