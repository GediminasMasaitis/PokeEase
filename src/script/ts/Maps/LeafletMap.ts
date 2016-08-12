class LeafletMap implements IMap {

    public config: IMapConfig;

    private map: L.Map;

    private pokeStops: IPokeStopEvent[];
    private gyms: IGymEvent[];
    private pokemons: IPokemonCaptureEvent[];
    private pokeStopIcons: L.Icon[];

    private playerMarker: L.Marker;
    private playerPath: L.Polyline;

    constructor(config: IMapConfig) {
        this.config = config;
        this.map = L.map("map",
        {
            zoomControl: false
        }).setView([0,0], 16);
        const mainLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
        //const mainLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        //{
        //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        //});
        mainLayer.addTo(this.map);
        this.pokeStops = [];
        this.gyms = [];
        this.pokemons = [];
        this.playerPath = L.polyline([], {
            color: "cyan",
            opacity: 1
        });
        this.playerPath.addTo(this.map);
        this.playerMarker = L.marker([0, 0], {
            icon: new L.Icon({
                iconUrl: "images/markers/location.png",
                iconSize: [50, 55],
                iconAnchor: [25, 45]
            })
        });
        this.playerMarker.addTo(this.map);

        this.pokeStopIcons = [];
        this.pokeStopIcons[PokeStopStatus.Normal] = new L.Icon({
            iconUrl: "images/markers/Normal.png",
            iconSize: [48,48]
        });
        this.pokeStopIcons[PokeStopStatus.Visited] = new L.Icon({
            iconUrl: "images/markers/Visited.png",
            iconSize: [48, 48]
        });
        this.pokeStopIcons[PokeStopStatus.Lure] = new L.Icon({
            iconUrl: "images/markers/Lured.png",
            iconSize: [48, 48]
        });
        this.pokeStopIcons[PokeStopStatus.VisitedLure] = new L.Icon({
            iconUrl: "images/markers/VisitedLure.png",
            iconSize: [48, 48]
        });
    }

    public movePlayer = (position: IMapLocationEvent): void => {
        const posArr = [position.Latitude, position.Longitude];
        this.playerMarker.setLatLng(posArr);
        this.playerPath.addLatLng(posArr);
        if (this.config.followPlayer) {
            this.map.setView(posArr);
        }
    }

    public setPokeStops = (pokeStops: IPokeStopEvent[]): void => {
        _.each(this.pokeStops, m => this.map.removeLayer(m.LMarker));
        this.pokeStops = [];
        _.each(pokeStops, pokeStop => {
           const posArr = [pokeStop.Latitude, pokeStop.Longitude];
           const marker = new L.Marker(posArr,
           {
               icon: this.pokeStopIcons[pokeStop.Status]
           });
           this.map.addLayer(marker);
           pokeStop.LMarker = marker;
           this.pokeStops.push(pokeStop);
        });
    }

    public setGyms = (gyms: IGymEvent[]) => {
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

    public usePokeStop(pokeStopUsed: IFortUsedEvent): void {
        const pokeStop = _.find(this.pokeStops, ps => ps.Id === pokeStopUsed.Id);
        const icon = pokeStop.LureInfo === null
            ? this.pokeStopIcons[PokeStopStatus.Visited]
            : this.pokeStopIcons[PokeStopStatus.VisitedLure];
        pokeStop.LMarker.setIcon(icon);
    }

    public onPokemonCapture(pokemonCapture: IPokemonCaptureEvent): void {
        const posArr = [pokemonCapture.Latitude, pokemonCapture.Longitude];
        const img = new Image();
        const imgUrl = `images/pokemon/${pokemonCapture.Id}.png`;
        const maxWidth = 42;
        const maxHeight = 38;
        img.onload = () => {

            const widthScaleFactor = maxWidth / img.width;
            const heightScaleFactor = maxHeight / img.height;
            let scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
            if (scaleFactor > 1) {
                scaleFactor = 1;
            }
            const width = img.width * scaleFactor;
            const height = img.height * scaleFactor;
            const marker = new L.Marker(posArr,
                {
                    icon: new L.Icon({
                        iconUrl: imgUrl,
                        iconSize: [width, height]
                    })
                });
            this.map.addLayer(marker);
            pokemonCapture.LMarker = marker;
            this.pokemons.push(pokemonCapture);
        };
        img.src = imgUrl;
    }
}