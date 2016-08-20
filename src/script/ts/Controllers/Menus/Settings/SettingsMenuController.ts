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
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']"),
            clientAddress: this.config.settingsMenuElement.find("[name='settings-client-address']"),
            clientPort: this.config.settingsMenuElement.find("[name='settings-client-port']"),
            clientUseSSL: this.config.settingsMenuElement.find("[name='settings-client-use-ssl']"),
        }
    }

    private inputChanged = (ev: JQueryEventObject): void => {
        const currentSettings = this.config.settingsService.settings;
        const changedSettings = this.getSettings();
        this.enableDisableButtons(currentSettings, changedSettings);
        this.updateConnectionStr(changedSettings);
    }

    private updateConnectionStr = (settings: ISettings): void => {
        const connStr = this.buildConnectionString(settings.clientAddress, settings.clientPort, settings.clientUseSSL);
        this.config.settingsMenuElement.find(".settings-client-connection-string").text(connStr);
    }

    private buildConnectionString = (address: string, port: number, useSSL: boolean): string => {
        const protocol = useSSL ? "wss" : "ws";
        return `${protocol}://${address}:${port}`;
    }

    private enableDisableButtons = (currentSettings: ISettings, changedSettings: ISettings): void => {
        const areEqual = this.config.settingsService.settingsEqual(currentSettings, changedSettings);
        if (areEqual) {
            this.config.settingsButtonsElement.addClass("disabled");
        } else {
            this.config.settingsButtonsElement.removeClass("disabled");
        }
    }

    public setSettings = (settings: ISettings): void => {
        this.updateConnectionStr(settings);
        this.settingsElements.mapProvider.filter(`[value='${settings.mapProvider}']`).prop("checked", true);
        this.setToggleSetting(this.settingsElements.mapFolllowPlayer, settings.mapFolllowPlayer);
        this.settingsElements.mapClearing.val(settings.mapClearing);

        this.settingsElements.clientAddress.val(settings.clientAddress);
        this.settingsElements.clientPort.val(settings.clientPort);
        this.setToggleSetting(this.settingsElements.clientUseSSL, settings.clientUseSSL);
    }

    private setToggleSetting = (settingElement: JQuery, value: boolean): void =>{
        if (value) {
            settingElement.addClass("active");
        } else {
            settingElement.removeClass("active");
        }
    }

    public getSettings = (): ISettings => {
        const settings: ISettings = {
            mapProvider: parseInt(this.settingsElements.mapProvider.filter(":checked").val()),
            mapFolllowPlayer: this.settingsElements.mapFolllowPlayer.hasClass("active"),
            mapClearing: parseInt(this.settingsElements.mapClearing.val()),
            clientAddress: this.settingsElements.clientAddress.val(),
            clientPort: parseInt(this.settingsElements.clientPort.val()),
            clientUseSSL: this.settingsElements.clientUseSSL.hasClass("active")
        };
        return settings;
    }

    private saveClicked = (event: JQueryEventObject): void => {
        if (this.config.settingsButtonsElement.hasClass("disabled")) {
            return;
        }
        const changedSettings = this.getSettings();
        this.config.settingsService.apply(changedSettings);
        this.updateConnectionStr(changedSettings);
        this.enableDisableButtons(changedSettings, changedSettings);
    };

    private cancelClicked = (event: JQueryEventObject): void => {
        const currentSettings = this.config.settingsService.settings;
        this.setSettings(currentSettings);
        this.enableDisableButtons(currentSettings, currentSettings);
    };
}