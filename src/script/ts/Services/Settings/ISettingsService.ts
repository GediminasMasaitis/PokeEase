interface ISettingsService {
    settings: ISettings;
    load(): void;
    apply(settings:ISettings): void;
    subscribe(action: (settings: ISettings, previousSettings: ISettings) => void):void;
}