//// <reference path="../../../node_modules/typescript/lib/lib.core.es6.d.ts" />
/// <reference path="../../externalTypings/jquery/jquery.d.ts" />
/// <reference path="../../externalTypings/lodash/lodash.d.ts" />
/// <reference path="../../externalTypings/leaflet/leaflet.d.ts" />
/// <reference path="../../externalTypings/moment/moment.d.ts" />
/// <reference path="../../externalTypings/googlemaps/google.maps.d.ts" />


$(() => {
    StaticInfo.init();
    const dataStorage = new LocalStorageDataStorage();
    const settingsService = new SettingsService(dataStorage);
    const fortCacheService = new FortCacheService(dataStorage);
    settingsService.load();
    const settings = settingsService.settings;
    const client = new BotWSClient();
    const translationController = new TranslationService();
    const notificationController = new JournalNotificationController({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        notificationCounter: $("#journal-counter"),
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

    const eggMenuController = new EggMenuController({
        translationController: translationController,
        requestSender: client,
        eggMenuElement: $('body .content[data-category="eggs"]'),
        eggLoadingSpinner: $(".spinner-overlay")
    });

    const settingsMenuController = new SettingsMenuController({
        settingsMenuElement: $('body.live-version .content[data-category="settings"]'),
        settingsButtonsElement: $("#settings-buttons"),
        settingsService: settingsService
    });
    settingsMenuController.setSettings(settings);

    const profileInfoController = new ProfileInfoController({
        hideUsername: false,
        profileInfoElement: $("#profile")
    });

    const mapConfig: IMapConfig = {
        followPlayer: settings.mapFolllowPlayer,
        translationController: translationController,
        mapElement: $("#map"),
        infoWindowTemplate: $("#iw-template")
    };

    const useGoogleMap = settings.mapProvider === MapProvider.GMaps;
    const lMap = useGoogleMap ? new GoogleMap(mapConfig) : new LeafletMap(mapConfig);

    const interfaceHandler = new InterfaceHandler({
        translationController: translationController,
        notificationController: notificationController,
        mainMenuController: mainMenuController,
        pokemonMenuController: pokemonMenuController,
        inventoryMenuController: inventoryMenuController,
        eggMenuController: eggMenuController,
        profileInfoController: profileInfoController,
        requestSender: client,
        map: lMap,
        settingsService: settingsService,
        fortCacheService: fortCacheService
    });

    client.start({
        eventHandlers: [interfaceHandler],
        settingsService: settingsService
    });
});

