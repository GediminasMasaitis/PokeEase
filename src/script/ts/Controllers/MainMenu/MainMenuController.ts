class MainMenuController implements IMainMenuController {
    private config: IMainMenuControllerConfig;

    constructor(config: IMainMenuControllerConfig) {
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
        this.config.mainMenuElement.find("#items").click(this.onItemsMenuClick);
        this.config.mainMenuElement.find("#eggs").click(this.onEggsMenuClick);
        this.config.mainMenuElement.find("#snipes").click(this.onSnipeMenuClick);
    }

    private onPokemonMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendPokemonListRequest();
    }

    private onItemsMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendInventoryListRequest();
    }

    private onEggsMenuClick = (ev: JQueryEventObject): void => {
        if (this.config.requestSender.currentBotFamily === BotFamily.Necro) {
            this.config.requestSender.sendPlayerStatsRequest();
        }
        this.config.requestSender.sendEggsListRequest();
    }

     private onSnipeMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendHumanSnipPokemonListUpdateRequest();
    }

    public updateProfileData = (profile: IProfileEvent): void => {
        this.config.mainMenuElement.find("#pokemons .total").text(profile.PlayerData.MaxPokemonStorage);
        this.config.mainMenuElement.find("#items .total").text(profile.PlayerData.MaxItemStorage);
    }

    public setPokemonCount = (pokemonCount: number): void => {
        this.config.mainMenuElement.find("#pokemons .current").text(pokemonCount);
    }
    
    public setSnipePokemonCount = (pokemonCount: number): void => {
        this.config.mainMenuElement.find("#snipes .current").text(pokemonCount);
    }

    public setItemCount = (itemCount: number): void => {
        this.config.mainMenuElement.find("#items .current").text(itemCount);
    }

    public setEggCount = (eggCount: number): void => {
        this.config.mainMenuElement.find("#eggs .current").text(eggCount);
    }
}