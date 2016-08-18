class MainMenuController implements IMainMenuController {
    private config: IMainMenuControllerConfig;

    constructor(config: IMainMenuControllerConfig) {
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
        this.config.mainMenuElement.find("#items").click(this.onItemsMenuClick);
        this.config.mainMenuElement.find("#eggs").click(this.onEggsMenuClick);
    }

    private onPokemonMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendPokemonListRequest();
    }

    private onItemsMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendInventoryListRequest();
    }

    private onEggsMenuClick = (ev: JQueryEventObject): void => {
        this.config.requestSender.sendEggsListRequest();
    }

    public updateProfileData = (profile: IProfileEvent): void => {
        this.config.mainMenuElement.find("#pokemons .total").text(profile.PlayerData.MaxPokemonStorage);
        this.config.mainMenuElement.find("#items .total").text(profile.PlayerData.MaxItemStorage);
    }

    public setPokemonCount = (pokemonCount: number): void => {
        this.config.mainMenuElement.find("#pokemons .current").text(pokemonCount);
    }

    public setItemCount = (itemCount: number): void => {
        this.config.mainMenuElement.find("#items .current").text(itemCount);
    }

    public setEggCount = (eggCount: number): void => {
        this.config.mainMenuElement.find("#eggs .current").text(eggCount);
    }
}