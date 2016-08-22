interface IInterfaceHandlerConfig {
    notificationControllers: INotificationController[];
    translationController: ITranslationService;
    mainMenuController: IMainMenuController;
    pokemonMenuController: IPokemonMenuController;
    inventoryMenuController: IInventoryMenuController;
    eggMenuController: IEggMenuController;
    profileInfoController: IProfileInfoController;
    requestSender: IRequestSender,
    map: IMap;
    settingsService: ISettingsService;
    fortCacheService: IFortCacheService;
}