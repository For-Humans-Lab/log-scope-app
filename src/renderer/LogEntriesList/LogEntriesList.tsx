import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";
import LogEntryItem from "../components/LogEntry";

export default function LogEntryList({ entries, onSelect }: { entries: LogEntry[], onSelect: (e: LogEntry) => void }) {
    return (
        <Container>
            {entries.map((x) => <LogEntryItem onSelect={() => onSelect(x)} key={x.id} entry={x} />)}
        </Container>
    )
}

const Container = styled.div`
    height:100%;
    width:100%;
    display: flex;
    flex-direction:column;
    overflow-y:scroll;
`