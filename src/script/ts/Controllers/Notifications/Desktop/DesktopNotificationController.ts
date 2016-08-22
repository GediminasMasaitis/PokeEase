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
            body: "This is an example of a desktop notification"
        });
    }

    public addNotificationPokeStopUsed(fortUsed: IFortUsedEvent) {}

    public addNotificationPokemonCapture(pokemonCatch: IPokemonCaptureEvent[], itemsUsedForCapture: number[]) {}

    public addNotificationPokemonEvolved(pokemonEvolve: IPokemonEvolveEvent) {}

    public addNotificationPokemonTransfer(pokemonTransfer: IPokemonTransferEvent) {}

    public addNotificationItemRecycle(itemRecycle: IItemRecycleEvent) {}

    public addNotificationEggHatched(eggHatched: IEggHatchedEvent) {}

    public addNotificationIncubatorStatus(incubatorStatus: IIncubatorStatusEvent) { }

    private addNotification = (title: string, options: NotificationOptions) => {
        const notification = new Notification(title, options);
    }
}