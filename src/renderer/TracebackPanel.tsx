import * as React from "react";
import styled from "styled-components";
import Traceback from "_/model/Traceback";

export default function TracebackPanel({ tr }: { tr: Traceback }) {
    return (
        <Container>
            <span style={{color: "gray"}}>
                {tr.title}
            </span>
            <div style={{ height: 8 }} />
            {tr.entries.map(e => (
                <div>
                    <span style={{color: "teal"}}>{`${e.invocation}`}</span>
                    <span style={{ color: "violet" }}>
                        {`<(${e.bundle})>`}
                    </span>
                </div>
            ))}
        </Container>
    )
}

const Container = styled.div`
    padding: 8px;
`