class PokemonMenuController implements IPokemonMenuController {
    private config: IPokemonMenuControllerConfig;

    private pokemonList: IPokemonListEvent;
    private currentPokemon: IPokemonListEntry;
    private currentOrdering: PokemonOrdering;
    private currentReverse: boolean;

    constructor(config: IPokemonMenuControllerConfig) {
        this.config = config;
        this.config.pokemonDetailsElement.find("#confirm-transfer").click(this.transferPokemon);
        this.config.pokemonDetailsElement.find("#confirm-evolve").click(this.evolvePokemon);
        this.currentOrdering = PokemonOrdering.Date;
        this.currentReverse = true;
        this.config.pokemonOrderButtons.click(this.onOrderButtonClicked);
    }

    private onOrderButtonClicked = (event: JQueryEventObject) => {
        const button = $(event.target).closest(".pokemon-order-button");
        const orderingStr = button.attr("data-order-by");
        if (!orderingStr) {
            return;
        }
        const ordering = PokemonOrdering[orderingStr];
        const previousOrdering = this.currentOrdering;
        this.currentOrdering = ordering;
        if (previousOrdering === ordering) {
            this.currentReverse = !this.currentReverse;
        } else {
            this.currentReverse = true;
        }
        const chevron = button.find(".pokemon-order-chevron");
        if (this.currentReverse) {
            chevron.addClass("descending");
        } else {
            chevron.removeClass("descending");
        }
        this.updatePokemonListInner();
    }

    public pokemonListRequested = (request: IRequest): void => {
        this.config.pokemonLoadingSpinner.show();
    }

    public updatePokemonList = (pokemonList: IPokemonListEvent): void => {
        this.pokemonList = pokemonList;
        this.updatePokemonListInner();
    }

    private getOrderedPokemons = (): IPokemonListEntry[] => {
        let pokemons: IPokemonListEntry[];
        switch (this.currentOrdering) {
            case PokemonOrdering.Date:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.CreationTimeMs);
                break;
            case PokemonOrdering.Cp:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Cp);
                break;
            case PokemonOrdering.Iv:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Perfection);
                break;
            case PokemonOrdering.Number:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.PokemonId);
                break;
            case PokemonOrdering.Name:
                pokemons = _.orderBy(this.pokemonList.Pokemons, p => {
                    const pokemonName = this.config.translationController.translation.pokemonNames[p.PokemonId];
                    return pokemonName;
                });
                break;
            default:
                pokemons = this.pokemonList.Pokemons;
        }
        if (this.currentReverse) {
            pokemons = pokemons.reverse();
        }
        return pokemons;
    }

    private updatePokemonListInner = (): void => {
        if (!this.pokemonList) {
            return;
        }
        this.config.pokemonMenuElement.find(".pokemon").remove();
        const pokemons = this.getOrderedPokemons();
        for (let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i];
            const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
            const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
            const html =
                `<div class="pokemon" data-pokemon-unique-id="${pokemon.Id}">
    <h1 class="name">${pokemonName}</h1>
    <div class="image-container">
        <img src="images/pokemon/${pokemon.PokemonId}.png"/>
    </div>
    <h3 class="cp">${pokemon.Cp}</h3>
    <h3 class="iv">${roundedIv}</h3>
</div>`;
            const pokemonElement = $(html);
            pokemonElement.click(this.pokemonClick);
            this.config.pokemonMenuElement.append(pokemonElement);
        }
        this.config.pokemonLoadingSpinner.fadeOut(150);
    }

    private pokemonClick = (ev: JQueryEventObject) => {
        const pokemonBox = $(ev.target).closest(".pokemon");
        const pokemonUniqueIdStr = pokemonBox.attr("data-pokemon-unique-id");
        const pokemon = _.find(this.pokemonList.Pokemons, p => p.Id == pokemonUniqueIdStr);
        this.currentPokemon = pokemon;
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
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
        this.config.pokemonDetailsElement.find(".pkm-candies").text(`${pokemon.FamilyCandies}`);

        const move1Name = StaticInfo.moveInfo[pokemon.Move1] ? StaticInfo.moveInfo[pokemon.Move1].name : "Unknown move";
        const move2Name = StaticInfo.moveInfo[pokemon.Move2] ? StaticInfo.moveInfo[pokemon.Move2].name : "Unknown move";
        const pokemonInfo = StaticInfo.pokemonInfo[pokemon.PokemonId];
        const elementElement = this.config.pokemonDetailsElement.find("#pokemon-type");
        elementElement.html("");
        for (let i = 0; i < pokemonInfo.elements.length; i++) {
            const elementStr = PokeElement[pokemonInfo.elements[i]].toLowerCase();
            const elementHtml = `<span class="${elementStr}">${elementStr}</span>`;
            const el = $(elementHtml);
            elementElement.append(el);
        }
        this.config.pokemonDetailsElement.find(".move1").text(move1Name);
        this.config.pokemonDetailsElement.find(".move2").text(move2Name);

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
