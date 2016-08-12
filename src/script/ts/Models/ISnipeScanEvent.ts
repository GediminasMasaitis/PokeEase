interface ISnipeScanEvent extends IEvent {
    PokemonId: number;
    Iv: number;
    Source: string;
    Bounds: IMapLocation;
}