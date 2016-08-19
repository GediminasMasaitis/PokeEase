class DefaultSettings {
    public static get settings(): ISettings {
        return {
            mapProvider: MapProvider.GMaps,
            mapFolllowPlayer: true,
            mapClearing: 0,

            clientPort: 14252
        }
    }
}