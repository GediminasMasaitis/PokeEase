interface IFortCacheService {
    addFort(fort: IFortEvent, setName: boolean): void;
    setName(id: string, name: string): void;
    getCached(): FortCache;
}