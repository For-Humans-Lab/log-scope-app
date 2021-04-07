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
import ActivityBadge, { ActivityState } from './components/ActivityBadge';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isRoutesEqual from '_/utils/isRoutesEqual';
import isRouteIsSubset from '_/utils/isRouteIsSubset';
import { Route } from '_/model/Route';
import unwrapRoute from '_/utils/unwrapRoute';
import { trimEnd } from 'lodash';
import StartIcon from '@material-ui/icons/PlayArrow';
import ReloadIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'

const MENU_BAR_HEIGHT = 30

let server: ChildProcessWithoutNullStreams | undefined = undefined

function App() {
  const [logEntries, setLogEntries] = React.useState<LogEntry[]>([]);
  const [serverActivity, setServerActivity] = React.useState(ActivityState.Offline)
  const [selectedEntry, setSelectedEntry] = React.useState<LogEntry>()

  const [routes, setRoutes] = React.useState<Route[]>([])
  const [selectedRoutes, setSelectedRoutes] = React.useState<Route[]>([])

  const [raw, setRaw] = React.useState<string[]>([])

  const [warning, setWarning] = React.useState<string | undefined>()

  function handleRestart() {
    setLogEntries([])
    logRaw("--- RESTART ---")
  }

  function logRaw(...lines: string[]) {
    setRaw(raw => [...lines, ...raw])
  }

  React.useEffect(() => {
    patchCLI()
    window.onbeforeunload = () => { server?.kill() }

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

  function processLogEvents(log: string) {
    if (log.includes("BUNDLE")) {
      setServerActivity(ActivityState.Bundling)
      return false;
    }

    if (log.includes("Running")) {
      setServerActivity(ActivityState.Running)
      return false;
    }

    if (log.includes("Possible Unhandled Promise Rejection")) {
      setWarning(log)
      return false;
    }

    return true
  }

  function startListening() {
    const appDir = getAppDir()
    server = spawn(appDir + "/node_modules/.bin/react-native", ["start"], {
      cwd: appDir,
    });

    setServerActivity(ActivityState.Idle)

    server.stdout.on('data', (databuffer: Buffer) => {
      const data = databuffer.toString()

      if (!processLogEvents(data)) {
        return
      }

      logRaw(data)
      const lines = data.split('\n');


      const logentries: LogEntry[] = [];
      const newRoutes: Route[] = []

      for (const l of lines) {
        if (l.length == 0)
          continue;

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
    });

    server.on('close', (_code: number) => {
      setServerActivity(ActivityState.Offline)
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

  function actionStopServer() {
    server?.kill()
    setRaw([])
    setLogEntries([])
    setRoutes([])
    setSelectedRoutes([])
    setSelectedEntry(undefined)
  }
  function actionReloadApp() {
    setServerActivity(ActivityState.Bundling)
    server?.stdin.write("r\r\n")
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
          <MenuBarButton onClick={startListening}>
            <StartIcon style={{ color: "gray" }} />
          </MenuBarButton>

          {serverActivity != ActivityState.Offline ? (<>
            <MenuBarButton onClick={actionReloadApp}>
              <ReloadIcon style={{ color: "gray", fontSize: 18 }} />
            </MenuBarButton>
            <MenuBarButton onClick={actionStopServer}>
              <StopIcon style={{ color: "gray" }} />
            </MenuBarButton>
          </>) : null}
          <div style={{ flex: 1 }} />

          <MenuBarButton>
            <ActivityBadge activity={serverActivity} />
          </MenuBarButton>

        </MenuBar>
        <div style={{ height: `calc(100% - ${MENU_BAR_HEIGHT}px - 1px)` }}>
          <LogEntryList
            onSelect={setSelectedEntry}
            entries={getActiveEntries()} />
        </div>
      </Content>
      <RightSideBar>
        {warning ? (
          <WarningPanel>
            <WarningPanelCloseButton onClick={()=>setWarning(undefined)}>
              Close
            </WarningPanelCloseButton>
            {warning}
          </WarningPanel>
        ) : null}

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

const WarningPanelCloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: darkorange;

`

const WarningPanel = styled.div`
  position: absolute;
  background-color: orange;
  height: 100%;
  width: 300px;
  overflow-y: scroll;
  overflow-wrap: anywhere;
`

const RawLog = styled.div`
  height: 300px;
  color: #8b8b8b;
  padding: 4px;
  overflow-y:scroll;
  overflow-x: hidden;
`

const RawLogEntry = styled.div`
  margin-bottom:8px;
  overflow: anywhere;
  border-bottom: 1px solid #303030

`
const MenuBarButton = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  height: ${MENU_BAR_HEIGHT}px;
  min-width:${MENU_BAR_HEIGHT}px;
  :hover{
    background-color: #ffffff11;
  }
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
padding: 0 8px;
  height: ${MENU_BAR_HEIGHT}px;
  flex-direction: row;
  background-color: #3f3f3f;
  display: flex;
`

ReactDOM.render(<App />,
  document.getElementById('app'));