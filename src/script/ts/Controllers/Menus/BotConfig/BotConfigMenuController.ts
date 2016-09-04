class BotConfigMenuController implements IBotConfigMenuController {
    private config: IBotConfigMenuControllerConfig;

    constructor(config: IBotConfigMenuControllerConfig) {
        this.config = config;
    }

    public setBotConfig = (botConfigs: IConfigEvent): void => {
        
    }
}