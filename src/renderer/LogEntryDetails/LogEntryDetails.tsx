import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";

export default function LogEntryDetails({ entry }: { entry: LogEntry | undefined }) {
    return (
        <Container>
            <Route>
                {entry?.route}
            </Route>
        </Container>
    )
}

const Container = styled.div`
    height:100%;
    width:100%;
    color:white;
`
const Route = styled.div`
    font-size:20px;
`