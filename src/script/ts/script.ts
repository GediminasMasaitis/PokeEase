/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/leaflet/leaflet.d.ts" />

$(() => {
    const translationManager = new TranslationManager();
    const notificationManager = new NotificationManager({
        container: $(".items"),
        clearAllButton: $(".clear-all"),
        translationManager: translationManager
    });
    const lMap = new LeafletMap({
        followPlayer: true,
        translationManager: translationManager
    });
    const interfaceHandler = new InterfaceHandler({
        map: lMap,
        translationManager: translationManager,
        notificationManager: notificationManager
    });
    const necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    const runner = new Runner(necroClient, interfaceHandler);
    runner.start();
});

