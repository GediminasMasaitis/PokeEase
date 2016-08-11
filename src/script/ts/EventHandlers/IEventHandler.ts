interface IEventHandler {
    onLocationUpdate: (location: IMapLocation) => void;
    onPokeStopList: (forts: IFort[]) => void;
    onFortUsed: (pokeStopUsed: IPokeStopUsed) => void;
    onProfile: (profile: IProfile) => void;
    onUnknownEvent?: (message: any) => void;
}