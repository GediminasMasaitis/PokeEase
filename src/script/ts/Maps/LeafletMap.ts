//class MarkerWithID extends L.Marker {
//    public Id: string;
    
//    constructor(id: string, latlng: L.LatLngExpression, options?: L.MarkerOptions) {
//        super(latlng, options);
//        this.Id = id;
//    }
//}

//interface IFortWithMarker extends IFort {
//    marker : L.Marker;
//}

class LeafletMap implements IMap {

    public config: IMapConfig;

    private map: L.Map;

    private pokeStops: IFort[];
    private gyms: IFort[];
    private pokemonMarkers: L.Marker[];

    private playerMarker: L.Marker;
    private playerPath: L.Polyline;

    constructor(config: IMapConfig) {
        this.config = config;
        this.map = L.map("map").setView([0,0], 13);
        const osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
        this.pokeStops = [];
        this.gyms = [];
        this.pokemonMarkers = [];
        this.playerPath = L.polyline([], {
            color: "cyan",
            opacity: 1
        });
        this.playerPath.addTo(this.map);
        this.playerMarker = L.marker([0, 0], {

        });
        this.playerMarker.addTo(this.map);
    }

    public movePlayer = (position: IMapLocation): void => {
        const posArr = [position.Latitude, position.Longitude];
        this.playerMarker.setLatLng(posArr);
        this.playerPath.addLatLng(posArr);
        if (this.config.followPlayer) {
            this.map.setView(posArr);
        }
    }

    public setPokeStops = (pokeStops: IPokeStop[]): void => {
        _.each(this.pokeStops, m => this.map.removeLayer(m.LMarker));
        this.pokeStops = [];
        _.each(pokeStops, pokeStop => {
           const posArr = [pokeStop.Latitude, pokeStop.Longitude];
           const marker = new L.Marker(posArr,
           {
          
           });
           this.map.addLayer(marker);
           pokeStop.LMarker = marker;
           this.pokeStops.push(pokeStop);
        });
    }

    public setGyms = (gyms: IGym[]) => {
        _.each(this.gyms, gym => this.map.removeLayer(gym.LMarker));
        this.gyms = [];
        _.each(gyms, gym => {
            const posArr = [gym.Latitude, gym.Longitude];
            const marker = new L.Marker(posArr,
            {

            });
            this.map.addLayer(marker);
            gym.LMarker = marker;
            this.gyms.push(gym);
        });
    }

    public usePokeStop(pokeStopUsed: IFortUsed): void {
        const pokeStop = _.find(this.pokeStops, ps => ps.Id === pokeStopUsed.Id);
        // TODO: change marker icon
    }
}