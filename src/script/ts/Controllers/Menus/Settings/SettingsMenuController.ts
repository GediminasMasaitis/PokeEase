class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    private settingsElements: ISettingsElements;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
        this.config.settingsButtonsElement.find("#save-changes").click(this.saveClicked);
        this.config.settingsMenuElement.find(":input").change(this.inputChanged);
        this.settingsElements = {
            mapProvider: this.config.settingsMenuElement.find("[name='settings-map-provider']"),
            mapFolllowPlayer: this.config.settingsMenuElement.find("[name='settings-map-follow-player']"),
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']")
        }
    }

    private inputChanged = (ev: JQueryEventObject): void => {
        this.config.settingsButtonsElement.removeClass("disabled");
    }

    public setSettings = (settings: ISettings): void => {
        this.settingsElements.mapProvider.filter(`[value='${settings.mapProvider}']`).prop("checked", true);
    }

    public getSettings = (): ISettings => {
        const settings: ISettings = {
            mapProvider: parseInt(this.settingsElements.mapProvider.filter(":checked").val()),
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