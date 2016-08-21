type FortCache = { [id: string]: IFortCacheEntry };

class FortCacheService implements IFortCacheService {
    private dataStorage: IDataStorage;
    private cache: FortCache;
    
    constructor(dataStorage: IDataStorage) {
        this.dataStorage = dataStorage;
        this.loadCache();
    }

    public addFort = (fort: IFortEvent, addName: boolean): void => {
        const cacheEntry: IFortCacheEntry = {
            Id: fort.Id,
            Latitude: fort.Latitude,
            Longitude: fort.Longitude,
            Name: fort.Name,
            Type: fort.Type
        };
        const previous = this.cache[cacheEntry.Id];
        this.cache[cacheEntry.Id] = cacheEntry;
        if (previous && previous.Name) {
            if (addName) {
                fort.Name = previous.Name;
            }
            cacheEntry.Name = previous.Name;
        }
        this.saveCache();
    }

    private saveCache = () => {
        this.dataStorage.setData("fortCache", this.cache);
    }

    private loadCache = () => {
        this.cache = this.dataStorage.getData<FortCache>("fortCache") || {};
    }

    public setName = (id: string, name: string):void => {
        const fort = this.cache[id];
        if (fort) {
            fort.Name = name;
        }
        this.saveCache();
    }

    public getCached = (): FortCache => this.cache;
}