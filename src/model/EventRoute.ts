

export class EventRoute {
    id:number
    constructor(
        public parts: string[],
        public isActive: boolean,
        expId?: number
    ) { this.id = expId || Math.random() }
}