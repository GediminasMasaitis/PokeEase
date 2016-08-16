class LocalStorageSettingsService implements ISettingsService {

    public settings: ISettings;
    private settingsKey = "settings";

    constructor() {
        
    }
    
    public load = (): void => {
        const settingsJson = localStorage.getItem(this.settingsKey);
        if (!settingsJson) {
            this.reset();
            this.save();
            return;
        }
        const loadedSettings = JSON.parse(settingsJson);
        const defaultSettings = DefaultSettings.settings;
        const mergedSettings = this.mergeSettings([loadedSettings, defaultSettings]);
        this.settings = mergedSettings;
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

    public save = (): void => {
        const settingsJson = JSON.stringify(this.settings);
        localStorage.setItem(this.settingsKey, settingsJson);
    }

    public reset(): void {
        this.settings = DefaultSettings.settings;
    }
}