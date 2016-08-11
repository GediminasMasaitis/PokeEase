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
                this.addFortToList(forts[i], this.pokeStops);
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

    public onFortUsed(pokeStopUsed: IPokeStopUsed): void {
        const pokeStop = _.find(this.pokeStops, ps => ps.Id === pokeStopUsed.Id);
        pokeStop.Name = pokeStopUsed.Name;
        this.map.usePokeStop(pokeStopUsed);
    }

    public onProfile(profile: IProfile): void {
        
    }
}