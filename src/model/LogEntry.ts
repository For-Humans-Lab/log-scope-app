import { EventRoute } from "./EventRoute";


export interface LogEntry {
    id: string,
    time: string,
    route?: EventRoute,
    routeParts: string[]
    message: string
    object: any
}