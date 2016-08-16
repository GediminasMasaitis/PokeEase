interface ISettingsService {
    load(): void;
    save(): void;
    subscribe(subscriber: ISettingsSubscriber):void;
}