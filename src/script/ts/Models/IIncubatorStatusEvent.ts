interface IIncubatorStatusEvent extends IEvent {
    IncubatorId: string;
    KmRemaining: number;
    KmToWalk: number;
    KmWalked: number;
    PokemonId: string;
    WasAddedNow: boolean;
}