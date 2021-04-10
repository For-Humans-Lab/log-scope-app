import * as React from "react";
import styled from 'styled-components'
import { LogEntry } from "_/model/LogEntry";
import LogEntryItem from "../components/LogEntry";

export default function LogEntryList({ entries, onSelect }: { entries: LogEntry[], onSelect: (e: LogEntry) => void }) {
    console.log("list render")
    return (
        <Container>
            {entries.reverse().map((x) => <LogEntryItem onSelect={() => onSelect(x)} key={x.id.toString()} entry={x} />)}
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