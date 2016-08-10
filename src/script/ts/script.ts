/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />

interface ILocation {
    Latitude: number;
    Longitude: number;
}

interface INecroWSClientParams {
    serverURL: string;

    onLocationUpdate?: (location: ILocation) => void;
}

class NecroWSClient {
    private config: INecroWSClientParams;
    private client : WebSocket;

    constructor(config: INecroWSClientParams) {
        this.config = config;
    }

    public connect = (): void => {
        this.client = new WebSocket(this.config.serverURL);
        this.client.onopen = this.clientOnOpen;
        this.client.onmessage = this.clientOnMessage;
    }

    private clientOnOpen = (): void => {
        console.log(`Connected to ${this.client.url}`);
    }

    private clientOnMessage = (event: MessageEvent): void => {
        const message = JSON.parse(event.data);
        console.log(message);

        const type = message.$type as string;

        if (_.includes(type, "UpdatePositionEvent")) {
            const positionEvent = message as ILocation;
            if (this.config.onLocationUpdate) {
                this.config.onLocationUpdate(positionEvent);
            }
        }
    }
}

$(() => {
    var necroClient = new NecroWSClient({
        serverURL: "ws://127.0.0.1:14252",
        onLocationUpdate: (location) => {
            console.log("Updated location: " + location);
        }
    });

    necroClient.connect();
});

