interface IInterfaceHandlerConfig {
    notificationController: INotificationController;
    translationController: ITranslationService;
    mainMenuController: IMainMenuController;
    pokemonMenuController: IPokemonMenuController;
    inventoryMenuController: IInventoryMenuController;
    profileInfoController: IProfileInfoController;
    requestSender: IRequestSender,
    map: IMap;
}