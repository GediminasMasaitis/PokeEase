interface IEventHandler {
    onLocationUpdate: (location: IMapLocation) => void;
    onPokeStopList: (forts: IFort[]) => void;
    onFortUsed: (pokeStopUsed: IPokeStopUsed) => void;
    onProfile: (profile: IProfile) => void;
    onEggHatched: (eggHatched: IEggHatched) => void;
    onIncubatorStatus: (incubatorStatus: IIncubatorStatus) => void;
    onUnknownEvent?: (message: any) => void;
}