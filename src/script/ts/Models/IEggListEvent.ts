interface IEggListEvent extends IEvent {
    Incubators: IEggListIncubatorEntry[];
    PlayerKmWalked: number;
    UnusedEggs: IPokemonListEntry[];
}

interface IEggListIncubatorEntry {
    Id: string;
    IncubatorType: number;
    ItemId: number;
    PokemonId: string;
    StartKmWalked: number;
    TargetKmWalked: number;
    UsesRemaining: number;
}