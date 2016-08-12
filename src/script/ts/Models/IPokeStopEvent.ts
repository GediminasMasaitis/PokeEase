interface IPokeStopEvent extends IFortEvent {
    CooldownCompleteTimestampMs: string;
    LastModifiedTimestampMs: string;
    LureInfo: ILureInfoEvent;
    Status?: PokeStopStatus;
}

enum PokeStopStatus {
    Normal = 0,
    Visited = 1 << 0,
    Lure = 1 << 1,
    VisitedLure = Visited | Lure
}