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

    const mainMenuManager = new MainMenuManager({
        requestSender: client,
        mainMenuElement: $("#menu")
    });

    const pokemonMenuManager = new PokemonMenuManager({
        translationManager: translationManager,
        pokemonMenuElement: $('body.live-version .content[data-category="pokemons"]')
    });

    const profileInfoManager = new ProfileInfoManager({
        profileInfoElement: $("#profile")
    });

    const lMap = new LeafletMap({
        followPlayer: true,
        translationManager: translationManager
    });

    const interfaceHandler = new InterfaceHandler({
        translationManager: translationManager,
        notificationManager: notificationManager,
        mainMenuManager: mainMenuManager,
        pokemonMenuManager: pokemonMenuManager,
        profileInfoManager: profileInfoManager,
        map: lMap
    });

    client.start({
        eventHandlers: [interfaceHandler]
    });
});

