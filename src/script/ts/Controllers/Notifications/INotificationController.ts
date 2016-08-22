interface INotificationController {
    config: INotificationControllerConfig;
    addNotificationExample(): void;
    addNotificationPokeStopUsed(fortUsed: IFortUsedEvent): void;
    addNotificationPokemonCapture(pokemonCatches: IPokemonCaptureEvent[], itemsUsedForCapture: number[]): void;
    addNotificationPokemonEvolved(pokemonEvolve: IPokemonEvolveEvent): void;
    addNotificationPokemonTransfer(pokemonTransfer: IPokemonTransferEvent): void;
    addNotificationItemRecycle(itemRecycle: IItemRecycleEvent): void;
    addNotificationEggHatched(eggHatched: IEggHatchedEvent): void;
    addNotificationIncubatorStatus(incubatorStatus: IIncubatorStatusEvent): void;
}
