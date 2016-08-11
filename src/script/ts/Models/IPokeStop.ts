interface IPokeStop extends IFort {
    CooldownCompleteTimestampMs: string;
    LastModifiedTimestampMs: string;
    LureInfo: ILureInfo;
    Status?: PokeStopStatus;
}