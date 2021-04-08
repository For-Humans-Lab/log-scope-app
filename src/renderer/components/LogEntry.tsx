import * as React from "react";
import { LogEntry } from "_/model/LogEntry";
import styled from 'styled-components'
import _ from "lodash";

export default function LogEntryItem({ entry, onSelect }: { entry: LogEntry, onSelect: () => void }) {
    return (
        <Container hasData={Object.keys(entry.object).length != 0 } style={{ cursor: "pointer" }} onClick={onSelect}>
            <DataBlock>
                <Message>
                    {entry.message}
                </Message>
            </DataBlock>

            <MetaBar>
                <RouteHint>
                    {entry.route.join(" > ")}
                </RouteHint>
                <div style={{ flex: 1 }} />
                {/*  <TimeHint>
                    {entry.time}
                </TimeHint> */}
            </MetaBar>
        </Container>
    );
}

const Message = styled.span`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow-wrap: anywhere;
`

const Container = styled.div<{ hasData: boolean }>`
    background-color: #363636;
    padding:8px;
    margin:4px;
    margin-bottom:0;
    border-radius:8px;
    padding-bottom:2px;
    font-size:14px;
    color: white;
    font-family: Arial;
    border-left: ${props => props.hasData? "solid #5d5dac 4px" : "none"};
    border-right: ${props => props.hasData? "solid #5d5dac 4px" : "none"};
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

const DataBlock = styled.div`
    display:flex;
    flex-direction:row;
`