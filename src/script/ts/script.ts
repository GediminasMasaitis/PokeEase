/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/leaflet/leaflet.d.ts" />
/// <reference path="../../external/typings/moment/moment.d.ts" />
/// <reference path="../../external/typings/googlemaps/google.maps.d.ts" />

$(() => {
    StaticInfo.init();
    const settingsService = new LocalStorageSettingsService();
    settingsService.load();
    const client = new BotWSClient();
    const translationController = new TranslationService();
    const notificationController = new NotificationController({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        translationController: translationController
    });

    const mainMenuController = new MainMenuController({
        requestSender: client,
        mainMenuElement: $("#menu")
    });

    const pokemonMenuController = new PokemonMenuController({
        translationController: translationController,
        requestSender: client,
        pokemonMenuElement: $('body.live-version .content[data-category="pokemons"]'),
        pokemonDetailsElement: $("#pokemon-info"),
        pokemonLoadingSpinner: $(".spinner-overlay")
    });

    const inventoryMenuController = new InventoryMenuController({
        translationController: translationController,
        requestSender: client,
        inventoryMenuElement: $('body .content[data-category="items"]'),
        inventoryLoadingSpinner: $(".spinner-overlay")
    });

    const profileInfoController = new ProfileInfoController({
        hideUsername: false,
        profileInfoElement: $("#profile")
    });

    const mapConfig: IMapConfig = {
        followPlayer: true,
        translationController: translationController
    };

    const useGoogleMap = true;
    const lMap = useGoogleMap ? new GoogleMap(mapConfig) : new LeafletMap(mapConfig);

    const interfaceHandler = new InterfaceHandler({
        translationController: translationController,
        notificationController: notificationController,
        mainMenuController: mainMenuController,
        pokemonMenuController: pokemonMenuController,
        inventoryMenuController: inventoryMenuController,
        profileInfoController: profileInfoController,
        requestSender: client,
        map: lMap,
        settingsService: settingsService
    });

    client.start({
        eventHandlers: [interfaceHandler],
        settingsService: settingsService
    });
});

