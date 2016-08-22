class DesktopNotificationController implements INotificationController {
    public config: IDesktopNotificationControllerConfig;

    constructor(config: IDesktopNotificationControllerConfig) {
        this.config = config;
        this.checkPermissions();
        this.config.exampleButton.click(this.exampleClicked);
    }

    private exampleClicked = (ev: JQueryEventObject): void => {
        this.addNotificationExample();
    }

    private checkPermissions = (): boolean => {
        if (typeof Notification === "undefined") {
            this.updateCurrentPermission("unsupported");
            return false;
        }
        this.updateCurrentPermission(Notification.permission);
        if (Notification.permission === "granted") {
            return true;
        }
        const promise = Notification.requestPermission();
        this.updateCurrentPermission(Notification.permission);
        promise.then(perm => {
            this.updateCurrentPermission(perm);
        }, reason => {
            console.log(reason);
        });
        return false;
    }

    private updateCurrentPermission = (status: string) => {
        this.config.permissionElement.text(status);
    }

    public addNotificationExample = (): void => {
        if (!this.checkPermissions()) {
            return;
        }
        this.addNotification("Example", {
            body: "This is an example of a desktop notification",
            icon: ""
        });
    }

    public addNotificationPokeStopUsed = (fortUsed: IFortUsedEvent): void => {
        if (!this.config.notificationSettings.pokestopUsed) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        this.addNotification("Pokestop", {
            body: `${fortUsed.Name}`,
            icon: `images/markers/Normal.png`
        });
    }

    public addNotificationPokemonCapture = (pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void=> {
        const pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
        if (!pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonCapture) {
            return;
        }
        if (pokemonCatch.IsSnipe && !this.config.notificationSettings.pokemonSnipe) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        const eventType = pokemonCatch.IsSnipe ? "Snipe" : "Catch";
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
        const roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
        this.addNotification(eventType, {
            body: `${pokemonName}
IV: ${roundedPerfection}
CP: ${pokemonCatch.Cp}`,
            icon: `images/pokemon/${pokemonCatch.Id}.png`
        });
    }

    public addNotificationPokemonEvolved = (pokemonEvolve: IPokemonEvolveEvent): void => {
        if (!this.config.notificationSettings.pokemonEvolved) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
        this.addNotification("Evolve", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${pokemonEvolve.Id}.png`
        });
    }

    public addNotificationPokemonTransfer = (pokemonTransfer: IPokemonTransferEvent): void => {
        if (!this.config.notificationSettings.pokemonTransfer) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
        this.addNotification("Transfer", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${pokemonTransfer.Id}.png`
        });
    }

    public addNotificationItemRecycle = (itemRecycle: IItemRecycleEvent): void => {
        if (!this.config.notificationSettings.itemRecycle) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        this.addNotification("Recycle", {
            body: `${itemRecycle.Count} items`,
            icon: `images/items/${itemRecycle.Id}.png`
        });
    }

    public addNotificationEggHatched = (eggHatched: IEggHatchedEvent): void => {
        if (!this.config.notificationSettings.eggHatched) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        const pokemonName = this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
        this.addNotification("Hatch", {
            body: `${pokemonName}`,
            icon: `images/pokemon/${eggHatched.PokemonId}.png`
        });
    }

    public addNotificationIncubatorStatus = (incubatorStatus: IIncubatorStatusEvent): void => {
        if (!this.config.notificationSettings.incubatorStatus) {
            return;
        }
        if (!this.checkPermissions()) {
            return;
        }
        const km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
        this.addNotification("Incubator", {
            body: `${km} of ${incubatorStatus.KmToWalk}km`,
            icon: `images/items/0.png`
        });
    }

    private addNotification = (title: string, options: NotificationOptions) => {
        const notification = new Notification(title, options);
    }
}