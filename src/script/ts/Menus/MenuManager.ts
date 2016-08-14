class MenuManager implements IMenuManager {
    private config: IMenuManagerConfig;

    constructor(config: IMenuManagerConfig) {
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
    }

    onPokemonMenuClick = (ev: JQueryEventObject) => {
        this.config.requestSender.sendPokemonListRequest();
    }
}