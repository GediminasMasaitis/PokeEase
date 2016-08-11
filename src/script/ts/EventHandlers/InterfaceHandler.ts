class InterfaceHandler implements IEventHandler {
    private map: IMap;

    private pokeStops: IPokeStop[];
    private gyms: IGym[];

    constructor(map: IMap) {
        this.map = map;
    }

    public onLocationUpdate = (location: IMapLocation): void => {
        this.map.movePlayer(location);
    }

    public onPokeStopList = (forts: IFort[]): void => {
        if (!this.pokeStops) {
            this.pokeStops = [];
        }
        if (this.gyms) {
            this.gyms = [];
        }
        for (let i = 0; i < forts.length; i++) {
            if (forts[i].Type === 1) {
                const pokeStop = forts[i] as IPokeStop;
                pokeStop.Status = PokeStopStatus.Normal;
                if (pokeStop.CooldownCompleteTimestampMs) {
                    const currentMs = TimeUtils.getCurrentTimestampMs();
                    if (pokeStop.CooldownCompleteTimestampMs > currentMs) {
                        pokeStop.Status |= PokeStopStatus.Visited;
                    }
                }
                if (pokeStop.LureInfo !== null) {
                    pokeStop.Status |= PokeStopStatus.Lure;
                }
                this.addFortToList(pokeStop, this.pokeStops);
            } else {
                this.addFortToList(forts[i], this.gyms);
            }
        }
        this.map.setPokeStops(this.pokeStops);
        this.map.setGyms(this.gyms);
    }

    private addFortToList = (fort: IFort, fortList: IFort[]): void => {
        const index = _.findIndex(fortList, f => f.Id === fort.Id);
        if (index === -1) {
            fortList.push(fort);
        } else {
            fort.Name = fortList[index].Name;
            fortList[index] = fort;
        }
    }

    public onFortTarget(fortTarget: IFortTarget): void {
        
    }

    public onFortUsed(fortUsed: IFortUsed): void {
        const pokeStop = _.find(this.pokeStops, ps => ps.Id === fortUsed.Id);
        pokeStop.Name = fortUsed.Name;
        this.map.usePokeStop(fortUsed);
    }

    public onProfile(profile: IProfile): void {
        
    }

    public onPokemonCapture(pokemonCapture: IPokemonCapture): void {
        this.map.onPokemonCapture(pokemonCapture);
    }

    public onUpdate(update: IUpdateEvent): void {

    }

    public onWarn(warn: IWarnEvent): void {

    }

    public onEggHatched(eggHatched: IEggHatched): void {
        
    }

    public onIncubatorStatus(incubatorStatus: IIncubatorStatus): void {
        
    }

    public onItemRecycle(itemRecycle: IItemRecycle): void {
        
    }

    public onPokemonTransfer(pokemonTransfer: IPokemonTransfer): void {
        
    }
}