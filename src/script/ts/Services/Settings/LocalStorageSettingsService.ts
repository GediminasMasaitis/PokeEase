class LocalStorageSettingsService implements ISettingsService {

    public get settings(): ISettings {
        return this.cloneSettings(this.currentSettings);
    }
    private currentSettings: ISettings;
    private settingsKey = "settings";
    private subscribers: ((settings: ISettings, previousSettings: ISettings) => void)[];

    constructor() {
        this.subscribers = [];
    }
    
    public load = (): void => {
        const settingsJson = localStorage.getItem(this.settingsKey);
        if (!settingsJson) {
            this.apply(DefaultSettings.settings);
            return;
        } 
        let loadedSettings: ISettings;

        try {
            loadedSettings = JSON.parse(settingsJson);
        } catch (ex) {
            this.apply(DefaultSettings.settings);
            return;
        } 
        
        this.apply(loadedSettings);
    }

    private cloneSettings = (settings: ISettings): ISettings => {
        return this.mergeSettings([settings]);
    }

    private mergeSettings = (allSettings: ISettings[]):ISettings => {
        return {
            mapProvider: this.coalesceMap(allSettings, s => s.mapProvider),
            mapFolllowPlayer: this.coalesceMap(allSettings, s => s.mapFolllowPlayer),
            mapClearing: this.coalesceMap(allSettings, s => s.mapClearing),
            clientPort: this.coalesceMap(allSettings, s => s.clientPort)
        }
    }

    private coalesceMap<TModel, TResult>(inputs: TModel[], map: (orig: TModel) => TResult): TResult {
        const mapped = _.map(inputs, map);
        return this.coalesce(mapped);
    }

    private coalesce = <T>(inputs: T[]): T => {
        for (let i = 0; i < inputs.length; i++) {
            if (typeof inputs[i] !== "undefined") {
                return inputs[i];
            }
        }
        throw "No value found";
    }

    public apply = (settings: ISettings) => {
        const previousSettings = this.currentSettings;
        const defaultSettings = DefaultSettings.settings;
        const mergedSettings = this.mergeSettings([settings, defaultSettings]);
        this.currentSettings = mergedSettings;
        for (let i = 0; i < this.subscribers.length; i++) {
            const settingsClone = this.cloneSettings(mergedSettings);
            const previousClone = this.cloneSettings(previousSettings);
            this.subscribers[i](settingsClone, previousClone);
        }
        this.save();
    }

    private save = (): void => {
        const settingsJson = JSON.stringify(this.currentSettings);
        localStorage.setItem(this.settingsKey, settingsJson);
    }

    public subscribe(action: (settings: ISettings, previousSettings: ISettings) => void): void {
        this.subscribers.push(action);
    }
}