class OpenLayersMap implements IMap {

    private map: ol.Map;

    constructor(divId: string) {
        this.map = new ol.Map({
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: divId
        });
    }

    public movePlayer(position: UpdatePositionEvent): void {
        this.map.getView().setCenter([position.Latitude, position.Longitude]);
    }
}