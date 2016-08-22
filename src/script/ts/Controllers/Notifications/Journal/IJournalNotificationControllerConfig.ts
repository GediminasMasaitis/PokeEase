interface INotificationControllerConfig {
    translationController: ITranslationService;
    notificationSettings: INotificationSettings;
}

interface IJournalNotificationControllerConfig extends INotificationControllerConfig {
    container: JQuery;
    clearAllButton: JQuery;
    notificationCounter: JQuery;
}