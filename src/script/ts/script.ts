/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/leaflet/leaflet.d.ts" />

$(() => {
    const client = new BotWSClient("ws://127.0.0.1:14252");
    const translationManager = new TranslationManager();
    const notificationManager = new NotificationManager({
        container: $(".items"),
        clearAllButton: $(".clear-all"),
        translationManager: translationManager
    });
    const menuManager = new MenuManager({
        requestSender: client,
        mainMenuElement: $("#menu")
});
    const lMap = new LeafletMap({
        followPlayer: true,
        translationManager: translationManager
    });
    const interfaceHandler = new InterfaceHandler({
        map: lMap,
        translationManager: translationManager,
        notificationManager: notificationManager,
        menuManager: menuManager
    });
    client.start({
        eventHandlers: [interfaceHandler]
    });
});

