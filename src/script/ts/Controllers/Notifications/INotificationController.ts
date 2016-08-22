interface INotificationController {
    config: INotificationControllerConfig;
    addNotificationExample();
    addNotificationPokeStopUsed(fortUsed: IFortUsedEvent);
    addNotificationPokemonCapture(pokemonCatch: IPokemonCaptureEvent[], itemsUsedForCapture: number[]);
    addNotificationPokemonEvolved(pokemonEvolve: IPokemonEvolveEvent);
    addNotificationPokemonTransfer(pokemonTransfer: IPokemonTransferEvent);
    addNotificationItemRecycle(itemRecycle: IItemRecycleEvent);
	addNotificationEggHatched(eggHatched: IEggHatchedEvent);
	addNotificationIncubatorStatus(incubatorStatus: IIncubatorStatusEvent);
}
