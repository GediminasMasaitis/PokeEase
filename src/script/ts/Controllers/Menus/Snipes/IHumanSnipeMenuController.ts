interface IHumanSnipeMenuController {
    pokemonListRequested(request: IRequest): void;
    updateSnipePokemonList(snipeEvent: IHumanWalkSnipeListEvent): void;
}