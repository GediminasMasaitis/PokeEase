class EggMenuManager implements IEggMenuManager {
    private config: IEggMenuManagerConfig;

    constructor(config: IEggMenuManagerConfig) {
        this.config = config;
    }

    public eggListRequested = (request: IRequest): void => {
        this.config.eggLoadingSpinner.show();
    }

    public updateEggList = (eggList: IEggListEvent): void => {
        
    }
}