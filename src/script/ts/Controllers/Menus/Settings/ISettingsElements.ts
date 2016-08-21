interface ISettingsElements {
    mapProvider: JQuery;
    mapFolllowPlayer: JQuery;
    mapClearing: JQuery;
    mapGoogleApiKey: JQuery;
    mapOsmApiKey: JQuery;

    clientAddress: JQuery;
    clientPort: JQuery;
    clientUseSSL: JQuery;

    notificationsJournal: INotificationSettingsElements;
    notificationsDesktop: INotificationSettingsElements;

    notificationsJournalClearingAnimation: JQuery;
}

interface INotificationSettingsElements {
    pokestopUsed: JQuery;
    pokemonCapture: JQuery;
    pokemonSnipe: JQuery;
    pokemonEvolved: JQuery;
    eggHatched: JQuery;
    incubatorStatus: JQuery;
    itemRecycle: JQuery;
    pokemonTransfer: JQuery;
}