class PokemonMenuManager implements IPokemonMenuManager {
    private config: IPokemonMenuManagerConfig;

    private pokemonList: IPokemonListEvent;

    constructor(config: IPokemonMenuManagerConfig) {
        this.config = config;
    }

    public pokemonListRequested = (request: IRequest): void => {
        this.config.pokemonMenuElement.find(".spinner-overlay").show();
    }

    updatePokemonList = (pokemonList: IPokemonListEvent): void => {
        this.config.pokemonMenuElement.find(".pokemon").remove();
        this.pokemonList = pokemonList;
        for (let i = 0; i < pokemonList.Pokemons.length; i++) {
            const pokemon = pokemonList.Pokemons[i];
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
            pokemonElement.prop("pokemon-index", i);
            pokemonElement.click(this.pokemonClick);
            this.config.pokemonMenuElement.append(pokemonElement);
        }
        this.config.pokemonMenuElement.find(".spinner-overlay").hide();
    }

    pokemonClick = (ev: JQueryEventObject) => {
        const pokemonBox = $(ev.target).closest(".pokemon");
        const pokemonIndex = pokemonBox.prop("pokemon-index") as number;
        const pokemon = this.pokemonList.Pokemons[pokemonIndex];
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemon.PokemonId];
        const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
        this.config.pokemonDetailsElement.fadeIn();
        this.config.pokemonMenuElement.closest("#content-wrap").addClass("blurred");
        this.config.pokemonDetailsElement.find("#pokemon-info-name").text(pokemonName);
        this.config.pokemonDetailsElement.find("#pokemon-info-image").attr("src", `images/pokemon/${pokemon.PokemonId}.png`);
        this.config.pokemonDetailsElement.find(".attack").text(pokemon.IndividualAttack);
        this.config.pokemonDetailsElement.find(".defense").text(pokemon.IndividualDefense);
        this.config.pokemonDetailsElement.find(".stamina").text(pokemon.IndividualStamina);
        this.config.pokemonDetailsElement.find(".total-iv").text(`${roundedIv}%`);
        this.config.pokemonDetailsElement.find(".poke-cp").text(`${pokemon.Cp}`);
    }
}