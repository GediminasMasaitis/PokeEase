class MainMenuManager implements IMainMenuManager {
    private config: IMainMenuManagerConfig;

    constructor(config: IMainMenuManagerConfig) {
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
    }

    onPokemonMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendPokemonListRequest();
    }

    public updateProfileData(profile: IProfileEvent) {
        
    }
}