import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";

export default function LogEntryDetails({entry}: { entry: LogEntry | undefined }) {
    return <Container>{entry?.id}</Container>
}

const Container = styled.div`
    height:100%;
    width:100%;
`