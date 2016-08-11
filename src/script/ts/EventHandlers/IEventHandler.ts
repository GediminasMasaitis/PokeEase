interface IEventHandler {
    onLocationUpdate: (location: IMapLocation) => void;
    onPokeStopList: (forts: IFort[]) => void;
    onFortTarget: (fortTarget: IFortTarget) => void;
    onFortUsed: (fortUsed: IFortUsed) => void;
    onProfile: (profile: IProfile) => void;
    onPokemonCapture: (pokemonCapture: IPokemonCapture) => void;
    onUpdate: (update: IUpdateEvent) => void;
    onWarn: (warn: IWarnEvent) => void;
    onEggHatched: (eggHatched: IEggHatched) => void;
    onIncubatorStatus: (incubatorStatus: IIncubatorStatus) => void;
    onItemRecycle: (itemRecycle: IItemRecycle) => void;
    onPokemonTransfer: (pokemonTransfer: IPokemonTransfer) => void;
    onUnknownEvent?: (message: any) => void;
}