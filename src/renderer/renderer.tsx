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
import isRouteIsSubset from '_/utils/isRouteIsSubset';
import unwrapRoute from '_/utils/unwrapRoute';
import { trimEnd } from 'lodash';
import StartIcon from '@material-ui/icons/PlayArrow';
import ReloadIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import isRoutePartEqual from '_/utils/isRoutePartsEqual';
import { EventRoute } from '_/model/EventRoute';
import useRemoteState from '_/utils/useRemoteState';
import Traceback from '_/model/Traceback';
import TracebackPanel from './TracebackPanel';



let server: ChildProcessWithoutNullStreams | undefined = undefined

function getAppDir() {
  return process.env["DEV_APPLICATION"] || process.cwd()
}

const logQueue: string[] = []
let isLogHandling = false

function App() {
  const [logEntries, setLogEntries, getLogEntries] = useRemoteState<LogEntry[]>([]);
  const [serverActivity, setServerActivity] = React.useState(ActivityState.Offline)
  const [selectedEntry, setSelectedEntry] = React.useState<LogEntry>()

  const [routes, setRoutes, getRoutes] = useRemoteState<EventRoute[]>([])

  const [raw, setRaw] = React.useState<string[]>([])

  const [selectedTraceback, setSelectedTraceback] = React.useState<Traceback | undefined>()
  const [tracebacks, setTracebacks] = useRemoteState<Traceback[]>([])

  function logRaw(...lines: string[]) {
    setRaw(raw => [...lines, ...raw])
  }

  React.useEffect(() => {
    console.log(getAppDir())
    patchCLI()
    window.onbeforeunload = () => { server?.kill() }

  }, [])

  function patchCLI() {
    const fs = require('fs')
    fs.copyFileSync("./static/watchMode.dat",
      getAppDir() + "/node_modules/@react-native-community/cli/build/commands/start/watchMode.js")
    //
  }


  function processLogEvents(log: string) {
    if (log.includes("BUNDLE")) {
      setLogEntries([])
      setServerActivity(ActivityState.Bundling)
      return false;
    }

    if (log.includes("Running")) {
      setServerActivity(ActivityState.Running)
      return false;
    }

    if (log.includes("Possible Unhandled Promise Rejection")) {
      setTracebacks([...tracebacks, new Traceback(log)])
      return false;
    }

    return true
  }

  async function readEventsRec() {
    console.log("Read invoked", logQueue.length, isLogHandling)
    if (!logQueue.length || isLogHandling)
      return

    isLogHandling = true

    const data = logQueue.pop()!

    if (!processLogEvents(data)) {
      isLogHandling = false
      return
    }

    logRaw(data)

    const lines = data.split('\n');

    const entries = getLogEntries()
    const routes = getRoutes()
    console.log('got data')

    const newLogEntries: LogEntry[] = []
    const newRoutes: EventRoute[] = []

    for (const l of lines) {
      if (l.length == 0)
        continue;

      const entry = extractLogEntryFromRawText(l.toString())

      if (!entry)
        continue

      const foundRoute = routes.find(p => isRoutePartEqual(p.parts, entry.routeParts))

      if (!foundRoute) {
        const event = new EventRoute(entry.routeParts, true)
        console.log("new")
        const nested = unwrapRoute(event)
        let onlyNew = nested.filter(n => !routes.some(r => isRoutePartEqual(r.parts, n.parts)))
        onlyNew = onlyNew.filter(n => !newRoutes.some(r => isRoutePartEqual(r.parts, n.parts)))
        newRoutes.push(...onlyNew)

        entry.route = foundRoute
      }
      else {
        entry.route = foundRoute
      }

      newLogEntries.push(entry)
    }
    setLogEntries([...entries, ...newLogEntries])
    setRoutes([...routes, ...newRoutes])

    isLogHandling = false;
    console.log("end")
    readEventsRec()
  }

  function startListening() {
    const appDir = getAppDir()
    server = spawn(appDir + "/node_modules/.bin/react-native", ["start"], {
      cwd: appDir,
    });

    setServerActivity(ActivityState.Idle)

    server.stdout.on('data', async (databuffer: Buffer) => {
      const data = databuffer.toString()

      logQueue.unshift(data)

      readEventsRec()
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
      for (const r of routes.filter(p => p.isActive)) {
        if (isRoutePartEqual(e.routeParts, r.parts))
          return true
      }
      return false
    })
  }

  function actionStopServer() {
    server?.kill()
    setRaw([])
    setRoutes([])
    setLogEntries([])
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
          onRouteUpdates={(routes) => {
            console.log("tree update")
            setRoutes([...routes])
          }}
          routes={routes} />
        <div style={{ flex: 1, height: "auto" }} />
        <RawLog>
          {raw.map(r => <RawLogEntry>{r}</RawLogEntry>)}
        </RawLog>
      </LeftSideBar>
      <Content>
        <MenuBar>
          {!serverActivity ? (
            <MenuBarButton onClick={startListening}>
              <StartIcon style={{ color: "gray" }} />
            </MenuBarButton>
          ) : null}

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
        <div style={{ flex: 1, overflowY: "scroll" }}>
          <LogEntryList
            onSelect={setSelectedEntry}
            entries={getActiveEntries()} />
        </div>

        <TracebacksList>
          {tracebacks.map(t => (
            <TracebackEntry onClick={(e) => {
              setSelectedTraceback(t)
            }}>
              {t.id}
              <div style={{ flex: 1 }} />
              <div
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation()
                  setTracebacks(tracebacks.filter(tr => tr.id != t.id))
                }} >HIDE</div>
            </TracebackEntry>
          ))}
        </TracebacksList>

        <MenuBar>
          <MenuBarButton>
            <MenuBarText>
              Entries {" " + logEntries.length}
            </MenuBarText>
          </MenuBarButton>

          <MenuBarButton>
            <MenuBarText>
              Routes {" " + routes.length}
            </MenuBarText>
          </MenuBarButton>
        </MenuBar>

      </Content>
      <RightSideBar>
        {selectedTraceback ? (
          <TracebackPanelContainer>
            <TracebackPanelCloseButton onClick={() => setSelectedTraceback(undefined)}>
              Close
            </TracebackPanelCloseButton>
            <TracebackPanel tr={selectedTraceback} />
          </TracebackPanelContainer>
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

const MENU_BAR_HEIGHT = 30

const TracebackPanelCloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;

`

const MenuBarText = styled.div`
  color:#aaaaaa;
  padding: 8px;
`

const TracebackEntry = styled.div`
  background-color: #b97b08;
  padding:8px;
  cursor: pointer;
  display: flex; 
  align-items: center;
  flex-direction: row;
  color:white;
`


const TracebacksList = styled.div`
  max-height: 400px;
  overflow-y: scroll;
  color:white;
`

const TracebackPanelContainer = styled.div`
  position: absolute;
  z-index: 5;
  height: 100%;
  overflow-y: scroll;
  overflow-wrap: anywhere;
  color: #444444;
`

const RawLog = styled.div`
  height: 200px;
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
  max-height: 100vh;
  overflow-y:hidden;
  display:flex;
  flex-direction: column;
  background-color: #2e2e2e;
  flex: 1;
`

const RightSideBar = styled.div`
  width:400px;
  overflow-x: scroll;
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