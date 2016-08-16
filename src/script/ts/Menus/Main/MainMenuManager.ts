class MainMenuManager implements IMainMenuManager {
    private config: IMainMenuManagerConfig;

    constructor(config: IMainMenuManagerConfig) {
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

    public updateProfileData(profile: IProfileEvent) {
        
    }
}