interface IBotClient {
    start: (config: IBotClientConfig) => void;
    currentBotFamily: BotFamily;
}