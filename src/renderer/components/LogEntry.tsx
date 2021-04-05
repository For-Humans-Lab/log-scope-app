import * as React from "react";
import { LogEntry } from "_/model/LogEntry";
import styled from 'styled-components'
import _ from "lodash";

export default function LogEntryItem({ entry, onSelect }: { entry: LogEntry, onSelect: () => void }) {
    return (
        <Container style={{ cursor: "pointer" }} onClick={onSelect}>
            <DataBlock>
                <Message>
                    {entry.message}
                </Message>

                <div style={{ flex: 1 }} />
                {Object.keys(entry.object).length != 0 ? <DataChip >DATA</DataChip> : null}
            </DataBlock>

            <MetaBar>
                <RouteHint>
                    {entry.route.join(" > ")}
                </RouteHint>
                <div style={{ flex: 1 }} />
                <TimeHint>
                    {entry.time}
                </TimeHint>
            </MetaBar>
        </Container>
    );
}

const Message = styled.span`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const DataChip = styled.span`
    border-radius:8px;
    border:1px solid white;
    padding:4px;
    
    background-color:#444444;
    font-size:8px;
`

const Container = styled.div`
    background-color: #363636;
    padding:8px;
    margin:4px;
    margin-bottom:0;
    border-radius:8px;
    padding-bottom:2px;
    font-size:14px;
    color: white;
    font-family: Arial;
  `

const MetaBar = styled.div`
  font-size: 10px;
  color: gray;
  padding-top:4px;
  display:flex;
  flex-direction:row;
`

const RouteHint = styled.div`

`

const TimeHint = styled.div`
   
`

const DataBlock = styled.div`
    display:flex;
    flex-direction:row;
`