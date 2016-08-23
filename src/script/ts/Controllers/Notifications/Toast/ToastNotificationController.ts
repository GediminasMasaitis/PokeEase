class ToastNotificationController implements INotificationController {
    public config: IToastNotificationControllerConfig;

    constructor(config: IToastNotificationControllerConfig) {
        this.config = config;
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }

    private exampleClicked = (ev: JQueryEventObject): void => {
        this.addNotificationExample();
    }

    public addNotificationExample = (): void => {
        this.addNotification("Example", "This is a toast notification");
    }

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        if (!this.config.notificationSettings.pokestopUsed) {
            return;
        }
        this.addNotification("Pokestop", fortUsed.Name);
    }

    public addNotificationPokemonCapture = (pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void=> {
        const pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
        if (!pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonCapture) {
            return;
        }
        if (pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonSnipe) {
            return;
        }
        const eventType = pokemonCatch.IsSnipe ? "Snipe" : "Catch";
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
        const roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
        this.addNotification(eventType, pokemonName);
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        if (!this.config.notificationSettings.pokemonEvolved) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
        this.addNotification("Evolve", pokemonName);
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        if (!this.config.notificationSettings.pokemonTransfer) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
        this.addNotification("Transfer", pokemonName);
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        if (!this.config.notificationSettings.itemRecycle) {
            return;
        }
        this.addNotification("Recycle", `${itemRecycle.Count} items`);
    }

    public addNotificationEggHatched = (eggHatched: IEggHatchedEvent): void => {
        if (!this.config.notificationSettings.eggHatched) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
        this.addNotification("Hatch", pokemonName);
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        if (!this.config.notificationSettings.incubatorStatus) {
            return;
        }
        const km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
        this.addNotification("Incubator", `${km} of ${incubatorStatus.KmToWalk}km`);
    }

    private addNotification = (title: string, body: string = "", bgColor: string = "#2196f3", textColor: string = "#ffffff", delay: number = 2500) => {
        this.config.toastControler.addToast(title, body, bgColor, textColor, delay);
    }

    private onSettingsChanged = (settings: ISettings, previousSettings: ISettings): void => {
        this.config.notificationSettings = settings.notificationsToast;
    }
}