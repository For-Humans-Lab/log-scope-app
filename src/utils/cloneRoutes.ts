import { EventRoute } from "_/model/EventRoute";

export default function (routes: EventRoute[]) {
    return routes.map(r => new EventRoute([...r.parts], r.isActive, r.id))
}