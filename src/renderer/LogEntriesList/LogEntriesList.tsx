import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";
import LogEntryItem from "../components/LogEntry";

export default function LogEntryList({ entries }: { entries: LogEntry[] }) {

    return (
        <Container>
            {entries.map((x) => <LogEntryItem key={x.id} entry={x} />)}
        </Container>
    )
}

const Container = styled.div`
    background-color: red;
    height:100%;
    width:100%;
`