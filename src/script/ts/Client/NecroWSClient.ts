class NecroWSClient implements INecroClient {
    private url: string;
    private config: INecroClientConfig;
    private webSocket: WebSocket;

    constructor(url: string) {
        this.url = url;
    }

    public start = (config: INecroClientConfig): void => {
        this.config = config;
        this.webSocket = new WebSocket(this.url);
        this.webSocket.onopen = this.clientOnOpen;
        this.webSocket.onmessage = this.clientOnMessage;
    }

    private clientOnOpen = (): void => {
        console.log(`Connected to ${this.webSocket.url}`);
    }

    private clientOnMessage = (event: MessageEvent): void => {
        const message = JSON.parse(event.data);
        console.log(message);

        const type = message.$type as string;

        if (_.includes(type, "UpdatePositionEvent")) {
            const mapLocation = message as IMapLocation;
            this.config.eventHandler.onLocationUpdate(mapLocation);
        } else if (_.includes(type, "PokeStopListEvent")) {
            const forts = message.Forts.$values as IFort[];
            this.config.eventHandler.onPokeStopList(forts);
        } else if (_.includes(type, "FortUsedEvent")) {
            const fortUsed = message as IPokeStopUsed;
            this.config.eventHandler.onFortUsed(fortUsed);
        }

    }
}