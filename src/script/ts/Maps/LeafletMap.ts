class LeafletMap implements IMap {
    public config: IMapConfig;

    private map: L.Map;
    private playerMarker: L.Marker;
    private playerPath: L.Polyline;

    constructor(config: IMapConfig) {
        this.config = config;
        this.map = L.map("map").setView([0,0], 13);
        const osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
        this.playerMarker = L.marker([0,0], {

        });
        this.playerMarker.addTo(this.map);
        this.playerPath = L.polyline([], {
            color: "cyan"
        });
        this.playerPath.addTo(this.map);
    }

    public movePlayer(position: UpdatePositionEvent): void {
        const posArr = [position.Latitude, position.Longitude];
        this.playerMarker.setLatLng(posArr);
        this.playerPath.addLatLng(posArr);
        if (this.config.followPlayer) {
            this.map.setView(posArr);
        }
    }
}