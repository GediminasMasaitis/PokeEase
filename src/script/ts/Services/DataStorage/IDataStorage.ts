interface IDataStorage {
    setData<T>(key: string, data: T): void;
    getData<T>(key: string): T;
}