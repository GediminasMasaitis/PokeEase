class DesktopNotificationController implements INotificationController {
    config: INotificationControllerConfig;

    public addNotificationPokeStopUsed(fortUsed: IFortUsedEvent) {}

    public addNotificationPokemonCapture(pokemonCatch: IPokemonCaptureEvent[], itemsUsedForCapture: number[]) {}

    public addNotificationPokemonEvolved(pokemonEvolve: IPokemonEvolveEvent) {}

    public addNotificationPokemonTransfer(pokemonTransfer: IPokemonTransferEvent) {}

    public addNotificationItemRecycle(itemRecycle: IItemRecycleEvent) {}

    public addNotificationEggHatched(eggHatched: IEggHatchedEvent) {}

    public addNotificationIncubatorStatus(incubatorStatus: IIncubatorStatusEvent) {}
}