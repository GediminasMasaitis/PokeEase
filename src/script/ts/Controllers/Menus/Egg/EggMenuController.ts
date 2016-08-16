class EggMenuController implements IEggMenuController {
    private config: IEggMenuControllerConfig;

    constructor(config: IEggMenuControllerConfig) {
        this.config = config;
    }

    public eggListRequested = (request: IRequest): void => {
        this.config.eggLoadingSpinner.show();
    }

    public updateEggList = (eggList: IEggListEvent): void => {
        
    }
}