interface IMap {
    movePlayer: (position: IMapLocation) => void;
    setPokeStops: (pokeStops: IPokeStop[]) => void;
    setGyms: (gyms: IGym[]) => void;
    usePokeStop: (pokeStopUsed: IFortUsed) => void;
    onPokemonCapture: (pokemonCapture: IPokemonCapture) => void;
}