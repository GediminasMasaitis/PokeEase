interface IInterfaceHandlerConfig {
    notificationControllers: INotificationController[];
    translationController: ITranslationService;
    mainMenuController: IMainMenuController;
    pokemonMenuController: IPokemonMenuController;
    inventoryMenuController: IInventoryMenuController;
    snipesMenuController: IHumanSnipeMenuController;
    botConfigMenuController: IBotConfigMenuController;
    eggMenuController: IEggMenuController;
    profileInfoController: IProfileInfoController;
    requestSender: IRequestSender,
    map: IMap;
    settingsService: ISettingsService;
    fortCacheService: IFortCacheService;
    consoleController: IConsoleController;
}