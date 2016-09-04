class BotConfigMenuController implements IBotConfigMenuController {
    private config: IBotConfigMenuControllerConfig;

    constructor(config: IBotConfigMenuControllerConfig) {
        this.config = config;
    }

    public setBotConfig = (botConfigs: IConfigEvent): void => {
        this.config.botSettingsMenuElement.text("");
        const html = `<div id="bot-config-content"></div>`;
        const element = $(html);
        this.config.botSettingsMenuElement.append(element);
        const htmlElement = element.get(0);
        const schema = JSON.parse(botConfigs.ConfigSchemaJson);
        const editor = new JSONEditor(htmlElement, {
            schema: schema,
        });
        const value = JSON.parse(botConfigs.ConfigJson);
        editor.setMode("form");
        editor.set(value);
    }
}