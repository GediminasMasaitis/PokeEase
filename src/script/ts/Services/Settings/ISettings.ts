interface ISettings {
    mapProvider: MapProvider;
    mapFolllowPlayer: boolean;
    mapClearing: number;
    mapGoogleApiKey: string;
    mapOsmApiKey: string;

    clientAddress: string;
    clientPort: number;
    clientUseSSL: boolean;

    notificationsJournal: INotificationSettings;
    notificationsDesktop: INotificationSettings;

    notificationsJournalClearingAnimation: boolean;
}

interface INotificationSettings {
    pokestopUsed: boolean;
    pokemonCapture: boolean;
    pokemonSnipe: boolean;
    pokemonEvolved: boolean;
    eggHatched: boolean;
    incubatorStatus: boolean;
    itemRecycle: boolean;
    pokemonTransfer: boolean;
}