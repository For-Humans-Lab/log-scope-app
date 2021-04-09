import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";
import ReactJson from 'react-json-view'

export default function LogEntryDetails({ entry }: { entry: LogEntry | undefined }) {
    return (
        <Container>
            <RouteBlock>
                <div style={{ fontSize: 20, marginBottom: 8 }}>
                    Route
                </div>
                <Route>
                    {entry?.routeParts.map((r, i) => <div key={r} style={{ paddingLeft: i * 10 }}>{"> " + r}</div>)}
                </Route>

            </RouteBlock>

            <MessageBlock>
                <div style={{ fontSize: 20, marginBottom: 8 }}>
                    Message
                </div>
                <Message>
                    {entry?.message}
                </Message>
            </MessageBlock>

            <DataBlock>
                <div style={{ fontSize: 20, marginBottom: 8 }}>
                    Data
                </div>
                <ReactJson style={{ backgroundColor: "transparent" }} theme={"summerfruit"} src={entry?.object} />
            </DataBlock>
        </Container>
    )
}

const Container = styled.div`
    flex: 1;
    color:white;
    padding:8px;
`
const RouteBlock = styled.div`
    font-size:14px;
    padding:8px;
`

const Route = styled.div`
color: #c2c2c2;
`

const Message = styled.div`
color: #c2c2c2;
`

const MessageBlock = styled.div`
    font-size:14px;
    margin:8px;
`

const DataBlock = styled.div`
    font-size:14px;
    margin:8px;
`
