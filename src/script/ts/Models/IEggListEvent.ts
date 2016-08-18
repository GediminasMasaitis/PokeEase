interface IEggListEvent extends IEvent {
    Incubators: IEggListIncubatorEntry[];
    UnusedEggs: IPokemonListEntry[];
    PlayerKmWalked?: number;
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