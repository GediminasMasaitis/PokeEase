interface IEventHandler {
    onPlayerLevelUp: (levelUp: IPlayerLevelUpEvent) => void;
    onUpdatePosition: (location: IUpdatePositionEvent) => void;
    onPokeStopList: (forts: IFortEvent[]) => void;
    onFortTarget: (fortTarget: IFortTargetEvent) => void;
    onFortUsed: (fortUsed: IFortUsedEvent) => void;
    onProfile: (profile: IProfileEvent) => void;
    onUseBerry: (useBerry: IUseBerryEvent) => void;
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

    onPokemonList: (pokemonList: IPokemonListEvent) => void;
    onEggList: (eggList: IEggListEvent) => void;
    onInventoryList: (inventoryList: IInventoryListEvent) => void;
    onPlayerStats: (playerStats: IPlayerStatsEvent) => void;
    onHumanSnipeList: (pokemonList: IHumanWalkSnipeListEvent) => void;
    onSendPokemonListRequest: (request: IRequest) => void;
    onSendEggsListRequest: (request: IRequest) => void;
    onSendInventoryListRequest: (request: IRequest) => void;
    onSendPlayerStatsRequest: (request: IRequest) => void;
    onSendGetPokemonSettingsRequest: (request: IRequest) => void;
    onSendTransferPokemonRequest: (request: IRequest) => void;
    onSendEvolvePokemonRequest: (request: IRequest) => void;
    onSendHumanSnipePokemonRequest: (request: IRequest) => void;
    onSendHumanSnipPokemonListUpdateRequest: (request:IRequest) => void;
    onSendHumanSnipePokemonRemoveRequest : (request:IRequest) => void;
    onUnknownEvent?: (message: any) => void;
}