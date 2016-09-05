class BotConfigMenuController implements IBotConfigMenuController {
    private config: IBotConfigMenuControllerConfig;

    constructor(config: IBotConfigMenuControllerConfig) {
        this.config = config;
    }

    public setBotConfig = (botConfigs: IConfigEvent): void => {

        const commonSchema = {
            id: "BotSettings",
            title: "BotSettings",
            description: "Bot settings",
            type: "object",
            properties: {
                AuthSettings: JSON.parse(botConfigs.AuthSchemaJson),
                GlobalSettings: JSON.parse(botConfigs.ConfigSchemaJson)
            }
        }

        const commonSettings = {
            AuthSettings: JSON.parse(botConfigs.AuthJson),
            GlobalSettings: JSON.parse(botConfigs.ConfigJson)
        }
        console.log(commonSchema);
        console.log(commonSettings);
        this.setEditor(commonSchema, commonSettings, "Bot settings", this.config.botSettingsMenuElement);
    }

    private setEditor = (schema: Object, value: Object, name: string, element: JQuery): void => {
        element.text("");
        const html = `<div class="bot-config-editor"></div>`;
        const innerElement = $(html);
        element.append(innerElement);
        const htmlElement = innerElement.get(0);
        const editor = new JSONEditor(htmlElement, {
            schema: schema,
            modes: ["tree", "form", "code"],
            name: name
        });
        editor.setMode("form");
        editor.set(value);
        editor.setName(name);
    }
}