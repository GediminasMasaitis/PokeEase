class SettingsService implements ISettingsService {
    public dataStorage: IDataStorage;

    public get settings(): ISettings {
        return this.cloneSettings(this.currentSettings);
    }
    private currentSettings: ISettings;
    private settingsKey = "settings";
    private subscribers: ((settings: ISettings, previousSettings: ISettings) => void)[];

    constructor(dataStorage: IDataStorage) {
        this.dataStorage = dataStorage;
        this.subscribers = [];
    }

    public load = (): void => {
        const loadedSettings = this.dataStorage.getData<ISettings>(this.settingsKey);
        if (loadedSettings === null) {
            this.apply(DefaultSettings.settings);
            return
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
            clientAddress: this.coalesceMap(allSettings, s => s.clientAddress),
            clientPort: this.coalesceMap(allSettings, s => s.clientPort),
            clientUseSSL: this.coalesceMap(allSettings, s => s.clientUseSSL)
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
        this.dataStorage.setData(this.settingsKey, this.currentSettings);
    }

    public subscribe(action: (settings: ISettings, previousSettings: ISettings) => void): void {
        this.subscribers.push(action);
    }

    public settingsEqual(settings: ISettings, to: ISettings):boolean {
        let equal = true;
        equal = equal && settings.mapProvider === to.mapProvider;
        equal = equal && settings.mapFolllowPlayer === to.mapFolllowPlayer;
        equal = equal && settings.mapClearing === to.mapClearing;
        equal = equal && settings.clientAddress === to.clientAddress;
        equal = equal && settings.clientPort === to.clientPort;
        equal = equal && settings.clientUseSSL === to.clientUseSSL;
        return equal;
    }
}