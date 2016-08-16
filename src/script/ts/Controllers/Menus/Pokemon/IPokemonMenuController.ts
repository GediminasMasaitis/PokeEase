interface IPokemonMenuController {
    pokemonListRequested(request: IRequest): void;
    updatePokemonList(pokemonList: IPokemonListEvent): void;
}