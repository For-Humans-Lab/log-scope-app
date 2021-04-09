import { useCallback, useRef, useState } from "react";

export default function <T>(initial: T) {
    const stateRef = useRef<T>(initial)
    const [, updateState] = useState(0);

    return [
        stateRef.current,
        (value: T) => {
            stateRef.current = value
            updateState(state => state + 1)
        },
        () => {
            return stateRef.current
        }
    ] as [T, (arg: T) => void, () => T]
}