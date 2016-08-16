class MainMenuController implements IMainMenuController {
    private config: IMainMenuControllerConfig;

    constructor(config: IMainMenuControllerConfig) {
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
        this.config.mainMenuElement.find("#items").click(this.onItemsMenuClick);
    }

    private onPokemonMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendPokemonListRequest();
    }

    private onItemsMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendInventoryListRequest();
    }

    public updateProfileData = (profile: IProfileEvent): void => {
        
    }
}