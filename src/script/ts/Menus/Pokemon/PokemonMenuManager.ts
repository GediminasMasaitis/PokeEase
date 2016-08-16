class PokemonMenuManager implements IPokemonMenuManager {
    private config: IPokemonMenuManagerConfig;

    private pokemonList: IPokemonListEvent;
    private currentPokemon: IPokemonListEntry;

    constructor(config: IPokemonMenuManagerConfig) {
        this.config = config;
        this.config.pokemonDetailsElement.find("#confirm-transfer").click(this.transferPokemon);
        this.config.pokemonDetailsElement.find("#confirm-evolve").click(this.evolvePokemon);
    }

    public pokemonListRequested = (request: IRequest): void => {
        this.config.pokemonMenuElement.find(".spinner-overlay").show();
    }

    public updatePokemonList = (pokemonList: IPokemonListEvent): void => {
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

    private pokemonClick = (ev: JQueryEventObject) => {
        const pokemonBox = $(ev.target).closest(".pokemon");
        const pokemonIndex = pokemonBox.prop("pokemon-index") as number;
        const pokemon = this.pokemonList.Pokemons[pokemonIndex];
        this.currentPokemon = pokemon;
        const pokemonName = this.config.translationManager.translation.pokemonNames[pokemon.PokemonId];
        const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
        const evolveButton = this.config.pokemonDetailsElement.find("#evolve-pokemon-button");
        if (StaticInfo.pokemonInfo[pokemon.PokemonId].evolvesInto.length === 0) {
            evolveButton.hide();
        } else {
            evolveButton.show();
        }
        this.config.pokemonDetailsElement.find("#pokemon-info-name").text(pokemonName);
        this.config.pokemonDetailsElement.find("#pokemon-info-image").attr("src", `images/pokemon/${pokemon.PokemonId}.png`);
        this.config.pokemonDetailsElement.find(".attack").text(pokemon.IndividualAttack);
        this.config.pokemonDetailsElement.find(".defense").text(pokemon.IndividualDefense);
        this.config.pokemonDetailsElement.find(".stamina").text(pokemon.IndividualStamina);
        this.config.pokemonDetailsElement.find(".total-iv").text(`${roundedIv}%`);
        this.config.pokemonDetailsElement.find(".poke-cp").text(`${pokemon.Cp}`);

        this.config.pokemonMenuElement.closest("#content-wrap").addClass("blurred");
        this.config.pokemonDetailsElement.fadeIn();
    }

    private transferPokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendTransferPokemonRequest(pokemonUniqueId);
    }

    private evolvePokemon = (ev: JQueryEventObject) => {
        const pokemonUniqueId = this.currentPokemon.Id;
        this.config.requestSender.sendEvolvePokemonRequest(pokemonUniqueId);
    }
}