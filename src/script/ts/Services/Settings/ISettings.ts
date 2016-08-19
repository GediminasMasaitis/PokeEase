interface ISettings {
    mapProvider: MapProvider;
    mapFolllowPlayer: boolean;
    mapClearing: number;
    clientPort: number;
}

enum MapProvider {
    GMaps = 0,
    OSM = 1
}