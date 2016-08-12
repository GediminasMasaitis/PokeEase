interface IEventHandler {
    onLocationUpdate: (location: IMapLocationEvent) => void;
    onPokeStopList: (forts: IFortEvent[]) => void;
    onFortTarget: (fortTarget: IFortTargetEvent) => void;
    onFortUsed: (fortUsed: IFortUsedEvent) => void;
    onProfile: (profile: IProfileEvent) => void;
    onPokemonCapture: (pokemonCapture: IPokemonCaptureEvent) => void;
    onEvolveCount: (pokemonCapture: IEvolveCountEvent) => void;
    onPokemonEvolve: (pokemonCapture: IPokemonEvolveEvent) => void;
    onSnipeScan: (snipeScan: ISnipeScanEvent) => void;
    onSnipeMode: (snipeMode: ISnipeModeEvent) => void;
    onSnipeMessage: (snipeMessage: ISnipeMessageEvent) => void;
    onUpdate: (update: IUpdateEvent) => void;
    onWarn: (warn: IWarnEvent) => void;
    onEggHatched: (eggHatched: IEggHatchedEvent) => void;
    onIncubatorStatus: (incubatorStatus: IIncubatorStatusEvent) => void;
    onItemRecycle: (itemRecycle: IItemRecycleEvent) => void;
    onPokemonTransfer: (pokemonTransfer: IPokemonTransferEvent) => void;
    onUnknownEvent?: (message: any) => void;
}