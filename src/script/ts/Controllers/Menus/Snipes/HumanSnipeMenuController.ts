class HumanSnipeMenuController implements IHumanSnipeMenuController {
    private config: IHumanSnipeMenuControllerConfig;

    private pokemonList: ISnipePokemonInfo[];
    //private currentPokemon: IPokemonListEntry;
    //private currentOrdering: PokemonOrdering;
    private currentReverse: boolean;

    constructor(config: IHumanSnipeMenuControllerConfig) {
        this.config = config;
        //this.config.pokemonDetailsElement.find("#confirm-transfer").click(this.transferPokemon);
        //this.config.pokemonDetailsElement.find("#confirm-evolve").click(this.evolvePokemon);
        //this.currentOrdering = PokemonOrdering.Date;
        //this.currentReverse = true;
        //this.config.pokemonOrderButtons.click(this.onOrderButtonClicked);
    }
    private updatePokemonListInner = (): void => {
        if (!this.pokemonList) {
            return;
        }
        this.config.snipeMenuElement.find(".pokemon").remove();
        const pokemons = this.getOrderedPokemons();
        for (let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i] as ISnipePokemonInfo;
            const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.Id];
            //const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
            const distance  = Math.round(pokemon.Distance)
            const expired =Math.round( (new Date(pokemon.ExpiredTime).valueOf() - (new Date()).valueOf()) / 1000);
            const estimate = Math.round(pokemon.EstimatedTime);
            const className = pokemon.IsCatching?"walking-to": (pokemon.Setting.Priority == 0?"targeted": "");
            const loading = pokemon.IsCatching?`<div id="fountainTextG"><div id="fountainTextG_1" class="fountainTextG">W</div><div id="fountainTextG_2" class="fountainTextG">a</div><div id="fountainTextG_3" class="fountainTextG">l</div><div id="fountainTextG_4" class="fountainTextG">k</div><div id="fountainTextG_5" class="fountainTextG">i</div><div id="fountainTextG_6" class="fountainTextG">n</div><div id="fountainTextG_7" class="fountainTextG">g</div></div> `: "";

            const html =
                `<div class="pokemon ${className}" data-pokemon-unique-id="${pokemon.UniqueId}">
                    <a class="delete " data-uniqueId="${pokemon.UniqueId}" title="Remove this Pokemon"></a>
                    <h1 class="name">${pokemonName}</h1>
                    <div class="image-container">
                        <img src="images/pokemon/${pokemon.Id}.png" alt="${pokemonName}" title="${pokemonName}"/>
                    </div>
                     ${loading}
                    <h3 class="distance">${distance}m</h3>
                    <h3 class="timer">${estimate}/${expired}</h3>
                    <a class="snipe-him" data-uniqueId="${pokemon.UniqueId}" title="Snipe this Pokemon"></a>
                </div>`;
            const pokemonElement = $(html);
            pokemonElement.find('.snipe-him').click(this.onSetAsTarget)
            pokemonElement.find('.delete').click(this.onRemoveSnipe)

            this.config.snipeMenuElement.append(pokemonElement);
        }
        //this.config.pokemonLoadingSpinner.fadeOut(150);
    }
    private onSetAsTarget :any = (ev:any) =>{
         const uniqueId = $(ev.target).attr('data-uniqueId');
         this.config.requestSender.sendHumanSnipPokemonSnipeRequest(uniqueId);
    }
     private onRemoveSnipe :any = (ev:any) =>{
         const uniqueId = $(ev.target).attr('data-uniqueId');
         $(ev.target).closest('.pokemon').fadeOut(500)
         this.config.requestSender.sendHumanSnipPokemonRemoveRequest(uniqueId);
    }
    /*
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
      */
    public pokemonListRequested = (request: IRequest): void => {
        //this.config.pokemonLoadingSpinner.show();
    }

    public updateSnipePokemonList = (pokemonList: IHumanWalkSnipeListEvent): void => {
        this.pokemonList = pokemonList.Pokemons;
        this.updatePokemonListInner();
    }

    private getOrderedPokemons = (): ISnipePokemonInfo[] => {
        let pokemons: ISnipePokemonInfo[];
        return this.pokemonList;
        //switch (this.currentOrdering) {
        //    case PokemonOrdering.Date:
        //        pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.CreationTimeMs);
        //        break;
        //    case PokemonOrdering.Cp:
        //        pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Cp);
        //        break;
        //    case PokemonOrdering.Iv:
        //        pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.Perfection);
        //        break;
        //    case PokemonOrdering.Number:
        //        pokemons = _.orderBy(this.pokemonList.Pokemons, p => p.PokemonId);
        //        break;
        //    case PokemonOrdering.Name:
        //        pokemons = _.orderBy(this.pokemonList.Pokemons, p => {
        //            const pokemonName = this.config.translationController.translation.pokemonNames[p.PokemonId];
        //            return pokemonName;
        //        });
        //        break;
        //    default:
        //        pokemons = this.pokemonList.Pokemons;
        //}
        //if (this.currentReverse) {
        //    pokemons = pokemons.reverse();
        //}
        //return pokemons;
    }
    /*
    private pokemonClick = (ev: JQueryEventObject) => {
        const pokemonBox = $(ev.target).closest(".pokemon");
        const pokemonUniqueIdStr = pokemonBox.attr("data-pokemon-unique-id");
        const pokemon = _.find(this.pokemonList.Pokemons, p => p.Id === pokemonUniqueIdStr);
        this.currentPokemon = pokemon;
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
        const roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
        const evolveButton = this.config.pokemonDetailsElement.find("#evolve-pokemon-button");
        if (StaticData.pokemonData[pokemon.PokemonId].evolvesInto.length === 0) {
            evolveButton.hide();
        } else {
            const candiesRequired = StaticData.pokemonData[pokemon.PokemonId].candyToEvolve;
            evolveButton.find(".button-disabled-reason").text(`${candiesRequired} candies required`);
            if (typeof pokemon.FamilyCandies !== "undefined" && pokemon.FamilyCandies < candiesRequired) {
                evolveButton.addClass("disabled");
            } else {
                evolveButton.removeClass("disabled");
            }
            evolveButton.show();
        }
        this.config.pokemonDetailsElement.find("#pokemon-info-name").text(pokemonName);
        const nicknameElement = this.config.pokemonDetailsElement.find("#pokemon-info-nickname");
        if (pokemon.Nickname) {
            nicknameElement.show();
            nicknameElement.text(`"${pokemon.Nickname}"`);
        } else {
            nicknameElement.hide();
        }
        const favoriteStar = this.config.pokemonDetailsElement.find(".pokemon-info-favorite");
        if (pokemon.Favorite > 0) {
            favoriteStar.show();
        } else {
            favoriteStar.hide();
        }
        this.config.pokemonDetailsElement.find("#pokemon-info-image").attr("src", `images/pokemon/${pokemon.PokemonId}.png`);
        this.config.pokemonDetailsElement.find(".attack").text(pokemon.IndividualAttack);
        this.config.pokemonDetailsElement.find(".defense").text(pokemon.IndividualDefense);
        this.config.pokemonDetailsElement.find(".stamina").text(pokemon.IndividualStamina);
        this.config.pokemonDetailsElement.find(".total-iv").text(`${roundedIv}%`);
        this.config.pokemonDetailsElement.find(".poke-cp").text(`${pokemon.Cp}`);
        this.config.pokemonDetailsElement.find("#pkm-candies-val").text(`${pokemon.FamilyCandies}`);

        const move1Name = this.config.translationController.translation.moveNames[pokemon.Move1];
        const move2Name = this.config.translationController.translation.moveNames[pokemon.Move2];
        const pokemonData = StaticData.pokemonData[pokemon.PokemonId];
        const elementElement = this.config.pokemonDetailsElement.find("#pokemon-type");
        elementElement.html("");
        for (let i = 0; i < pokemonData.elements.length; i++) {
            const elementStr = PokeElement[pokemonData.elements[i]].toLowerCase();
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
    */
}
