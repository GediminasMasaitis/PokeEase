class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    private settingsElements: ISettingsElements;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
        this.config.settingsButtonsElement.find("#save-changes").click(this.saveClicked);
        this.settingsElements = {
            mapProvider: this.config.settingsMenuElement.find("[name='settings-map-provider']"),
            mapFolllowPlayer: this.config.settingsMenuElement.find("[name='settings-map-follow-player']"),
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']")
        }
    }

    public setSettings = (settings: ISettings): void => {
        this.settingsElements.mapProvider.val(MapProvider[settings.mapProvider]);
    }

    public getSettings = (): ISettings => {
        const settings: ISettings = {
            mapProvider: MapProvider[this.settingsElements.mapProvider.filter(":checked").val()] as any as MapProvider,
            mapFolllowPlayer: true,
            mapClearing: 0,
            clientPort: DefaultSettings.settings.clientPort
        };
        return settings;
    }

    private saveClicked = (event: JQueryEventObject): void => {
        if (this.config.settingsButtonsElement.hasClass("disabled")) {
            return;
        }
        const settings = this.getSettings();
        this.config.settingsService.apply(settings);
    };
}