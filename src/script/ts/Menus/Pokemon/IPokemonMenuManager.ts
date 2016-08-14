interface IPokemonMenuManager {
    pokemonListRequested(request: IRequest);
    updatePokemonList(pokemonList: IPokemonListEvent): void;
}