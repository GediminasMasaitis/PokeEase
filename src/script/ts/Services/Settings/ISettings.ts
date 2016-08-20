interface ISettings {
    mapProvider: MapProvider;
    mapFolllowPlayer: boolean;
    mapClearing: number;
    clientAddress: string;
    clientPort: number;
    clientUseSSL: boolean;
}

enum MapProvider {
    GMaps = 0,
    OSM = 1
}