interface IPokemonMenuManager {
    pokemonListRequested(request: IRequest): void;
    updatePokemonList(pokemonList: IPokemonListEvent): void;
}