interface IPokemonTransferEvent extends IEvent {
    Id: number;
    Cp: number;
    Perfection: number;
    BestCp: number;
    BestPerfection: number;
    FamilyCandies: number;
}