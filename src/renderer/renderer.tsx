/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components'
import { ChildProcess, ChildProcessByStdio, ChildProcessWithoutNullStreams, spawn } from 'child_process';
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
import { toastInfo, toastWarn } from '_/utils/toasts';
import { trimEnd } from 'lodash';

const MENU_BAR_HEIGHT = 50

let server: ChildProcessWithoutNullStreams | undefined = undefined

function App() {
  const [logEntries, setLogEntries] = React.useState<LogEntry[]>([]);
  const [isProcessActive, setIsProcessActive] = React.useState(false)
  const [selectedEntry, setSelectedEntry] = React.useState<LogEntry>()

  const [routes, setRoutes] = React.useState<Route[]>([])
  const [selectedRoutes, setSelectedRoutes] = React.useState<Route[]>([])

  const [raw, setRaw] = React.useState<string[]>([])

  function handleRestart() {
    setLogEntries([])
    toastInfo("App launched")
    logRaw("--- RESTART ---")
  }

  function logRaw(...lines: string[]) {
    setRaw(raw => [...lines, ...raw])
  }
  /* 
  require('electron').remote.getCurrentWindow().on('close', () => {
    server?.kill()
    console.log("kill")
  }) */

  React.useEffect(() => {
    patchCLI()
    window.onbeforeunload = () => { server?.kill() }
    if (process.env["DEV_APPLICATION"])
      toastWarn("Started with special app " + process.env["DEV_APPLICATION"])
  }, [])

  function patchCLI() {
    const fs = require('fs')
    fs.copyFileSync("./static/watchMode.dat",
      getAppDir() + "/node_modules/@react-native-community/cli/build/commands/start/watchMode.js")
    //
  }

  function getAppDir() {
    return process.env["DEV_APPLICATION"] || process.cwd()
  }

  function startListening() {

    const appDir = getAppDir()
    server = spawn(appDir + "/node_modules/.bin/react-native", ["start"], {
      cwd: appDir,
    });

    setIsProcessActive(true)

    server.stdout.on('data', (databuffer: Buffer) => {
      const lines = databuffer.toString().split('\n');
      logRaw(...lines)

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

    server.stderr.on('data', (data: Buffer) => {
      console.log(`stderr: ${data}`);
      toast(`Error ${data.toString()}`, {
        style: {
          backgroundColor: "orange",
          color: "black"
        },
        position: 'bottom-right'
      })
    });

    server.on('close', (_code: number) => {
      setIsProcessActive(false)
    });
  }

  function getActiveEntries() {
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
        <div style={{ flex: 1, height: "auto" }} />
        <RawLog>
          {raw.map(r => <RawLogEntry>{r}</RawLogEntry>)}
        </RawLog>
      </LeftSideBar>
      <Content>
        <MenuBar>
          <button onClick={() => {
            try {
              startListening()
            } catch (ex) {
              toast(ex)
            }
          }}>Run</button>
          <button onClick={() => {
            server?.stdin.write("r\r\n")
          }}>Restart</button>
          {isProcessActive ? <button onClick={() => {
            server?.kill()
            toastInfo("Server stopped manually")
          }}>Stop server</button> : null}

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

const RawLog = styled.div`
  height: 300px;
  color: #8b8b8b;
  padding: 4px;
  overflow-y:scroll;
`

const RawLogEntry = styled.div`
  margin-bottom:8px;
  overflow: anytime;
  border-bottom: 1px solid #303030

`

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
  display:flex;
  flex-direction:column;
`

const Content = styled.div`
  background-color: #2e2e2e;
  flex:1;
`

const RightSideBar = styled.div`
  width:300px;
`

const MenuBar = styled.div`
  height: ${MENU_BAR_HEIGHT}px;
  flex-direction: row;
  background-color: #3f3f3f;
  display: flex;
`

ReactDOM.render(<App />,
  document.getElementById('app'));