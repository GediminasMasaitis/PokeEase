class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    private settingsElements: ISettingsElements;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
        this.config.settingsButtonsElement.find("#save-changes").click(this.saveClicked);
        this.config.settingsButtonsElement.find("#cancel-changes").click(this.cancelClicked);
        this.config.settingsMenuElement.find(":input, .option-toggle").change(this.inputChanged);
        this.settingsElements = {
            mapProvider: this.config.settingsMenuElement.find("[name='settings-map-provider']"),
            mapFolllowPlayer: this.config.settingsMenuElement.find("[name='settings-map-follow-player']"),
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']")
        }
    }

    private inputChanged = (ev: JQueryEventObject): void => {
        this.enableDisableButtons();
    }

    private enableDisableButtons = (): void => {
        const currentSettings = this.config.settingsService.settings;
        const changedSettings = this.getSettings();
        const areEqual = this.config.settingsService.settingsEqual(currentSettings, changedSettings);
        if (areEqual) {
            this.config.settingsButtonsElement.addClass("disabled");
        } else {
            this.config.settingsButtonsElement.removeClass("disabled");
        }
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
        this.enableDisableButtons();
    };

    private cancelClicked = (event: JQueryEventObject): void => {
        const currentSettings = this.config.settingsService.settings;
        this.setSettings(currentSettings);
        this.enableDisableButtons();
    };
}