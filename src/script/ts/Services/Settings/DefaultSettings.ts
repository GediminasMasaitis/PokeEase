class DefaultSettings {
    public static get settings(): ISettings {
        return {
            mapProvider: MapProvider.GMaps,
            mapFolllowPlayer: true,
            mapClearing: 0,

            clientAddress: "127.0.0.1",
            clientPort: 14252,
            clientUseSSL: false
        }
    }
}