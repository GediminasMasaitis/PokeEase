interface ISettingsService {
    settings: ISettings;
    load(): void;
    save(): void;
    reset(): void;
}