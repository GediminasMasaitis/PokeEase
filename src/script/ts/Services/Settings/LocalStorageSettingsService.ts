class LocalStorageSettingsService implements ISettingsService {

    private settings: ISettings;
    private settingsKey = "settings";
    private subscribers: ISettingsSubscriber[];

    constructor() {
        
    }
    
    public load = (): void => {
        const settingsJson = localStorage.getItem(this.settingsKey);
        if (!settingsJson) {
            this.apply(DefaultSettings.settings);
            this.save();
            return;
        }
        const loadedSettings = JSON.parse(settingsJson);
        this.apply(loadedSettings);
    }

    private mergeSettings(allSettings: ISettings[]):ISettings {
        return {
            testNum: this.coalesceMap(allSettings, s => s.testNum)
        }
    }

    private coalesceMap<TModel, TResult>(inputs: TModel[], map: (orig: TModel) => TResult): TResult {
        const mapped = _.map(inputs, map);
        return this.coalesce(mapped);
    }

    private coalesce<T>(inputs: T[]): T {
        for (let i = 0; i < inputs.length; i++) {
            if (typeof inputs[i] !== "undefined") {
                return inputs[i];
            }
        }
        throw "No value found";
    }

    private apply(settings: ISettings) {
        const previousSettings = this.settings;
        const defaultSettings = DefaultSettings.settings;
        const mergedSettings = this.mergeSettings([settings, defaultSettings]);
        this.settings = mergedSettings;
        for (let i = 0; i < this.subscribers.length; i++) {
            // TODO: clone the merged settings to allow subscribers to change it how they please
            this.subscribers[i].onSettingsChanged(mergedSettings, previousSettings);
        }
    }

    public save = (): void => {
        const settingsJson = JSON.stringify(this.settings);
        localStorage.setItem(this.settingsKey, settingsJson);
    }

    public subscribe(subscriber: ISettingsSubscriber): void {
        this.subscribers.push(subscriber);
    }
}