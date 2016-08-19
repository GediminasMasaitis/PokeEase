class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    private settingsElements: ISettingsElements;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
        this.config.settingsButtonsElement.find("#save-changes").click(this.saveClicked);
        this.config.settingsMenuElement.find(":input, .option-toggle").change(this.inputChanged);
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
        if (settings.mapFolllowPlayer) {
            this.settingsElements.mapFolllowPlayer.addClass("active");
        } else {
            this.settingsElements.mapFolllowPlayer.removeClass("active");
        }
        this.settingsElements.mapClearing.val(settings.mapClearing);
    }

    public getSettings = (): ISettings => {
        const settings: ISettings = {
            mapProvider: parseInt(this.settingsElements.mapProvider.filter(":checked").val()),
            mapFolllowPlayer: this.settingsElements.mapFolllowPlayer.hasClass("active"),
            mapClearing: parseInt(this.settingsElements.mapClearing.val()),
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