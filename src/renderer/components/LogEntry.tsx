import * as React from "react";
import { LogEntry } from "_/model/LogEntry";
import styled from 'styled-components'

export default function LogEntryItem({ entry, onSelect }: { entry: LogEntry, onSelect: () => void }) {
    return (
        <Container onClick={onSelect}>
            {entry.text}
            <MetaBar>
                <RouteHint>
                    {entry.route}
                </RouteHint>
                <div style={{ flex: 1 }} />
                <TimeHint>
                    {entry.time}
                </TimeHint>
            </MetaBar>
        </Container>
    );
}

const Container = styled.div`
    background-color: #252525;
    padding:8px;
    padding-bottom:2px;
    font-size:14px;
    color: white;
    font-family: Arial;
    margin-bottom:8px;
  `

const MetaBar = styled.div`
  font-size: 10px;
  color: gray;
  margin-top:4px;
  display:flex;
  flex-direction:row;
`

const RouteHint = styled.div`

`

const TimeHint = styled.div`
   
`