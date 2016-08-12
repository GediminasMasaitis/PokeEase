interface IMap {
    movePlayer: (position: IMapLocationEvent) => void;
    setPokeStops: (pokeStops: IPokeStopEvent[]) => void;
    setGyms: (gyms: IGymEvent[]) => void;
    usePokeStop: (pokeStopUsed: IFortUsedEvent) => void;
    onPokemonCapture: (pokemonCapture: IPokemonCaptureEvent) => void;
}