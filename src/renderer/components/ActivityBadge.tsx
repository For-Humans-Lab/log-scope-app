import * as React from "react";
import styled from 'styled-components'

export enum ActivityState {
    Offline,
    Idle,
    Bundling,
    Running
}

export default function ActivityBadge({ activity }: { activity: ActivityState }) {
    console.log("render")
    return (
        <>
            <Badge color={activity == ActivityState.Idle ? "#41A9AF" : "gray"} />
            <Badge color={activity == ActivityState.Bundling ? "#8F68CE" : "gray"}  />
            <Badge color={activity == ActivityState.Running ? "#AE529A" : "gray"}  />
        </>
    )
}

const Badge = styled.div<{ color: string }>`
    transition-duration: 400ms;
    height: 12px;
    width:12px;
    margin: 4px;
    border-radius: 20px;
    background-color: ${props => props.color}
`