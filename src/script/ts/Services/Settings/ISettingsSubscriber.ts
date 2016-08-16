interface ISettingsSubscriber {
    onSettingsChanged(settings: ISettings, previousSettings: ISettings);
}