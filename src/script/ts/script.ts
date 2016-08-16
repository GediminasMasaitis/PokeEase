/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/leaflet/leaflet.d.ts" />
/// <reference path="../../external/typings/moment/moment.d.ts" />
/// <reference path="../../external/typings/googlemaps/google.maps.d.ts" />

$(() => {
    const client = new BotWSClient("ws://127.0.0.1:14252");
    const translationManager = new TranslationManager();
    const notificationManager = new NotificationManager({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        translationManager: translationManager
    });

    const mainMenuManager = new MainMenuManager({
        requestSender: client,
        mainMenuElement: $("#menu")
    });

    const pokemonMenuManager = new PokemonMenuManager({
        translationManager: translationManager,
        requestSender: client,
        pokemonMenuElement: $('body.live-version .content[data-category="pokemons"]'),
        pokemonDetailsElement: $("#pokemon-info")
    });

    const profileInfoManager = new ProfileInfoManager({
        hideUsername: false,
        profileInfoElement: $("#profile")
    });

    const mapConfig: IMapConfig = {
        followPlayer: true,
        translationManager: translationManager
    };

    const useGoogleMap = true;
    const lMap = useGoogleMap ? new GoogleMap(mapConfig) : new LeafletMap(mapConfig);

    const interfaceHandler = new InterfaceHandler({
        translationManager: translationManager,
        notificationManager: notificationManager,
        mainMenuManager: mainMenuManager,
        pokemonMenuManager: pokemonMenuManager,
        profileInfoManager: profileInfoManager,
        requestSender: client,
        map: lMap
    });

    client.start({
        eventHandlers: [interfaceHandler]
    });
});

