class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    private settingsElements: ISettingsElements;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
        this.settingsElements = {
            mapProvider: this.config.settingsMenuElement.find("[name='settings-map-provider']"),
            mapFolllowPlayer: this.config.settingsMenuElement.find("[name='settings-map-follow-player']"),
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']")
        }
    }

    public setSettings = (settings: ISettings): void => {
        this.settingsElements.mapProvider.val(MapProvider[settings.mapProvider]);
    }
}

interface ISettingsElements {
    mapProvider: JQuery;
    mapFolllowPlayer: JQuery;
    mapClearing: JQuery;
}