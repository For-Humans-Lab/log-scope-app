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
            <Badge color={activity == ActivityState.Bundling ? "#e9a348" : "gray"}  />
            <Badge color={activity == ActivityState.Running ? "#DD6BDF" : "gray"}  />
        </>
    )
}

const Badge = styled.div<{ color: string }>`
    transition-duration: 400ms;
    height: 12px;
    width:20px;
    margin: 4px;
    border-radius: 20px;
    background-color: ${props => props.color}
`