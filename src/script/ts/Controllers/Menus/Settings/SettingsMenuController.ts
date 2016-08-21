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
            mapGoogleApiKey: this.config.settingsMenuElement.find("[name='settings-map-google-api-key']"),
            mapOsmApiKey: this.config.settingsMenuElement.find("[name='settings-map-osm-api-key']"),

            clientAddress: this.config.settingsMenuElement.find("[name='settings-client-address']"),
            clientPort: this.config.settingsMenuElement.find("[name='settings-client-port']"),
            clientUseSSL: this.config.settingsMenuElement.find("[name='settings-client-use-ssl']"),

            notificationsJournal: {
                pokestopUsed: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokestop-used']"),
                pokemonCapture: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-capture']"),
                pokemonSnipe: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-snipe']"),
                pokemonEvolved: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-evolved']"),
                eggHatched: this.config.settingsMenuElement.find("[name='settings-notifications-journal-egg-hatched']"),
                incubatorStatus: this.config.settingsMenuElement.find("[name='settings-notifications-journal-incubator-status']"),
                itemRecycle: this.config.settingsMenuElement.find("[name='settings-notifications-journal-item-recycle']"),
                pokemonTransfer: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-transfer']")
            },

            notificationsDesktop: {
                pokestopUsed: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokestop-used']"),
                pokemonCapture: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-capture']"),
                pokemonSnipe: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-snipe']"),
                pokemonEvolved: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-evolved']"),
                eggHatched: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-egg-hatched']"),
                incubatorStatus: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-incubator-status']"),
                itemRecycle: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-item-recycle']"),
                pokemonTransfer: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-transfer']")
            },

            notificationsJournalClearingAnimation: this.config.settingsMenuElement.find("[name='settings-notifications-journal-clearing-animation']")
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
        this.settingsElements.mapGoogleApiKey.val(settings.mapGoogleApiKey);
        this.settingsElements.mapOsmApiKey.val(settings.mapOsmApiKey);

        this.settingsElements.clientAddress.val(settings.clientAddress);
        this.settingsElements.clientPort.val(settings.clientPort);
        this.setToggleSetting(this.settingsElements.clientUseSSL, settings.clientUseSSL);

        this.setNotificationSettings(this.settingsElements.notificationsJournal, settings.notificationsJournal);
        this.setNotificationSettings(this.settingsElements.notificationsDesktop, settings.notificationsDesktop);
        this.setToggleSetting(this.settingsElements.notificationsJournalClearingAnimation, settings.notificationsJournalClearingAnimation);
    }

    private setNotificationSettings = (elements: INotificationSettingsElements, settings: INotificationSettings): void => {
        elements.pokestopUsed.prop("checked", settings.pokestopUsed);
        elements.pokemonCapture.prop("checked", settings.pokemonCapture);
        elements.pokemonSnipe.prop("checked", settings.pokemonSnipe);
        elements.pokemonEvolved.prop("checked", settings.pokemonEvolved);
        elements.eggHatched.prop("checked", settings.eggHatched);
        elements.incubatorStatus.prop("checked", settings.incubatorStatus);
        elements.itemRecycle.prop("checked", settings.itemRecycle);
        elements.pokemonTransfer.prop("checked", settings.pokemonTransfer);
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
            mapGoogleApiKey: this.settingsElements.mapGoogleApiKey.val(),
            mapOsmApiKey: this.settingsElements.mapOsmApiKey.val(),

            clientAddress: this.settingsElements.clientAddress.val(),
            clientPort: parseInt(this.settingsElements.clientPort.val()),
            clientUseSSL: this.settingsElements.clientUseSSL.hasClass("active"),

            notificationsJournal: this.getNotificationSettings(this.settingsElements.notificationsJournal),
            notificationsDesktop: this.getNotificationSettings(this.settingsElements.notificationsDesktop),
            notificationsJournalClearingAnimation: this.settingsElements.notificationsJournalClearingAnimation.hasClass("active")
        };
        return settings;
    }

    private getNotificationSettings = (elements: INotificationSettingsElements): INotificationSettings => {
        const notificationSettings = {
            pokestopUsed: elements.pokestopUsed.is(":checked"),
            pokemonCapture: elements.pokemonCapture.is(":checked"),
            pokemonSnipe: elements.pokemonSnipe.is(":checked"),
            pokemonEvolved: elements.pokemonEvolved.is(":checked"),
            eggHatched: elements.eggHatched.is(":checked"),
            incubatorStatus: elements.incubatorStatus.is(":checked"),
            itemRecycle: elements.itemRecycle.is(":checked"),
            pokemonTransfer: elements.pokemonTransfer.is(":checked")
        };
        return notificationSettings;
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