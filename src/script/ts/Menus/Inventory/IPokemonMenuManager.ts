interface IInventoryMenuManager {
    inventoryListRequested(request: IRequest): void;
    updateInventoryList(pokemonList: IPokemonListEvent): void;
}