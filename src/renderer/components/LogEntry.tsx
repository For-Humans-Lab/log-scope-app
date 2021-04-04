import * as React from "react";
import { LogEntry } from "_/model/LogEntry";
import styled from 'styled-components'

export default function LogEntryItem({ entry }: { entry: LogEntry }) {
    return (
       <Container>
           {entry.text}
       </Container>
    );
  }

  const Container = styled.div`
    background-color: #252525;
    padding:8px;
    font-size:14px;
    color: white;
    font-family: Arial;
    margin-bottom:8px;
  `