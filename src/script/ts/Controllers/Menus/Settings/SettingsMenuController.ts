class SettingsMenuController implements ISettingsMenuController {
    private config: ISettingsMenuControllerConfig;

    constructor(config: ISettingsMenuControllerConfig) {
        this.config = config;
    }
}