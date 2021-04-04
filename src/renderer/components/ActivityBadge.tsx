import * as React from "react";

export default function ActivityBadge(props: { isActive: boolean }) {
    return (
        <div style={{
            height: 20,
            width:20,
            borderRadius: 20,
            backgroundColor: props.isActive? "green":"darkgreen"
        }}>

        </div>
    )
}