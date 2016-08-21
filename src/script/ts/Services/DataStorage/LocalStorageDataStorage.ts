class LocalStorageDataStorage {
    public setData = <T>(key: string, data: T): void => {
        const dataJson = JSON.stringify(data);
        localStorage.setItem(key, dataJson);
    }

    public getData = <T>(key: string): T => {
        const dataJson = localStorage.getItem(key);
        if (!dataJson) {
            return null;
        }
        try {
            const data = JSON.parse(dataJson);
            return data as T;
        } catch (ex) {
            return null;
        }
    }
}