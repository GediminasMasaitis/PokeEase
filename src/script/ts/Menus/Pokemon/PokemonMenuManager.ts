class PokemonMenuManager implements IPokemonMenuManager {
    private config: IPokemonMenuManagerConfig;

    constructor(config: IPokemonMenuManagerConfig) {
        this.config = config;
    }

    updatePokemonList = (pokemonList: IPokemonListEvent): void => {
        this.config.pokemonMenuElement.find(".pokemon").remove();
        _.each(pokemonList.Pokemons, pokemon => {
            const pokemonName = this.config.translationManager.translation.pokemonNames[pokemon.PokemonId];
            const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
            const html =
`<div class="pokemon">
    <h1 class="name">${pokemonName}</h1>
    <div class="image-container">
        <img src="images/pokemon/${pokemon.PokemonId}.png"/>
    </div>
    <h3 class="cp">${pokemon.Cp}</h3>
    <h3 class="iv">${roundedIv}</h3>
</div>`;
            const pokemonElement = $(html);
            this.config.pokemonMenuElement.append(pokemonElement);
        });
    }
}