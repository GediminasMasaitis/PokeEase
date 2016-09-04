class HumanSnipeMenuController implements IHumanSnipeMenuController {
    private config: IHumanSnipeMenuControllerConfig;

    private pokemonList: ISnipePokemonInfo[];
    private currentReverse: boolean;

    constructor(config: IHumanSnipeMenuControllerConfig) {
        this.config = config;
    }
    private updatePokemonListInner = (): void => {
        if (!this.pokemonList) {
            return;
        }
        this.config.snipeMenuElement.find(".pokemon").remove();
        const pokemons = this.pokemonList;
        for (let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i] as ISnipePokemonInfo;
            const pokemonName = this.config.translationController.translation.pokemonNames[pokemon.Id];
            const distance  = Math.round(pokemon.Distance)
            const expired =Math.round( (new Date(pokemon.ExpiredTime).valueOf() - (new Date()).valueOf()) / 1000);
            const estimate = Math.round(pokemon.EstimatedTime);
            const className = pokemon.IsCatching?"walking-to": (pokemon.Setting.Priority == 0?"targeted": "");
            const loading = pokemon.IsCatching ?
`<div id="fountainTextG">
<div id="fountainTextG_1" class="fountainTextG">W</div>
<div id="fountainTextG_2" class="fountainTextG">a</div>
<div id="fountainTextG_3" class="fountainTextG">l</div>
<div id="fountainTextG_4" class="fountainTextG">k</div>
<div id="fountainTextG_5" class="fountainTextG">i</div>
<div id="fountainTextG_6" class="fountainTextG">n</div>
<div id="fountainTextG_7" class="fountainTextG">g</div>
</div> ` : "";

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
            pokemonElement.find(".snipe-him").click(this.onSetAsTarget)
            pokemonElement.find(".delete").click(this.onRemoveSnipe)

            this.config.snipeMenuElement.append(pokemonElement);
        }
    }

    private onSetAsTarget :any = (ev:any) =>{
         const uniqueId = $(ev.target).attr("data-uniqueId");
         this.config.requestSender.sendHumanSnipePokemonSnipeRequest(uniqueId);
    }

    private onRemoveSnipe :any = (ev:any) =>{
        const uniqueId = $(ev.target).attr("data-uniqueId");
        $(ev.target).closest(".pokemon").fadeOut(500);
        this.config.requestSender.sendHumanSnipePokemonRemoveRequest(uniqueId);
    }

    public pokemonListRequested = (request: IRequest): void => {

    }

    public updateSnipePokemonList = (pokemonList: IHumanWalkSnipeListEvent): void => {
        this.pokemonList = pokemonList.Pokemons;
        this.updatePokemonListInner();
    }
}
