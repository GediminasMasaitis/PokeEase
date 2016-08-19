interface ISettings {
    mapProvider: MapProvider;
    mapFolllowPlayer: boolean;
    mapClearing: number;
    clientPort: number;
}

enum MapProvider {
    GMaps,
    OSM
}