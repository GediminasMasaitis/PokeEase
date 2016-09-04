/// <reference path="../../externaltypings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../externalTypings/jquery/jquery.d.ts" />
/// <reference path="../../externalTypings/lodash/lodash.d.ts" />
/// <reference path="../../externalTypings/leaflet/leaflet.d.ts" />
/// <reference path="../../externalTypings/moment/moment.d.ts" />
/// <reference path="../../externalTypings/googlemaps/google.maps.d.ts" />


$(() => {
    StaticData.init(rawData);
    const dataStorage = new LocalStorageDataStorage();
    const settingsService = new SettingsService(dataStorage);
    const fortCacheService = new FortCacheService(dataStorage);
    settingsService.load();
    const settings = settingsService.settings;
    const client = new BotWSClient();
    const translationController = new TranslationService();
    const toastController = new ToastController({
        toastElement: $("#notification")
    });
    const journalNotificationController = new JournalNotificationController({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        notificationCounter: $("#journal-counter"),
        exampleButton: $("#show-notification-journal-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsJournal,
        settingsService: settingsService
    });

    const desktopNotificationController = new DesktopNotificationController({
        permissionElement: $("#notification-desktop-status"),
        exampleButton: $("#show-notification-desktop-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsDesktop,
        settingsService: settingsService
    });

    const toastNotificationController = new ToastNotificationController({
        toastControler: toastController,
        exampleButton: $("#show-notification-toast-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsToast,
        settingsService: settingsService
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
        pokemonLoadingSpinner: $(".spinner-overlay"),
        pokemonOrderButtons: $(".pokemon-order-button")
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
    const snipesMenuController = new HumanSnipeMenuController({
        translationController: translationController,
        requestSender: client,
        snipeMenuElement: $('body .content[data-category="snipes"]') 
        //eggLoadingSpinner: $(".spinner-overlay")
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

    const consoleController = new ConsoleController({
        consoleElement: $("#console")
    });

    const interfaceHandler = new InterfaceHandler({
        translationController: translationController,
        notificationControllers: [
            journalNotificationController,
            desktopNotificationController,
            toastNotificationController
        ],
        mainMenuController: mainMenuController,
        pokemonMenuController: pokemonMenuController,
        inventoryMenuController: inventoryMenuController,
        eggMenuController: eggMenuController,
        snipesMenuController: snipesMenuController,
        profileInfoController: profileInfoController,
        requestSender: client,
        map: lMap,
        settingsService: settingsService,
        fortCacheService: fortCacheService,
        consoleController: consoleController
    });

    client.start({
        eventHandlers: [interfaceHandler],
        settingsService: settingsService
    });
});

