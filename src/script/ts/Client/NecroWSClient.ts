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
            _.each(this.config.eventHandlers, eh => eh.onLocationUpdate(mapLocation));
        }

        else if (_.includes(type, "PokeStopListEvent")) {
            const forts = message.Forts.$values as IFort[];
            _.each(this.config.eventHandlers, eh => eh.onPokeStopList(forts));
        }

        else if (_.includes(type, "FortTargetEvent")) {
            const fortTarget = message as IFortTarget;
            _.each(this.config.eventHandlers, eh => eh.onFortTarget(fortTarget));
        }

        else if (_.includes(type, "FortUsedEvent")) {
            const fortUsed = message as IFortUsed;
            _.each(this.config.eventHandlers, eh => eh.onFortUsed(fortUsed));
        }

        else if (_.includes(type, "ProfileEvent")) {
            const profile = message.Profile as IProfile;
            profile.PlayerData.PokeCoin = this.getCurrency(message, "POKECOIN");
            profile.PlayerData.StarDust = this.getCurrency(message, "STARDUST");
            _.each(this.config.eventHandlers, eh => eh.onProfile(profile));
        }



        else if (_.includes(type, "EggHatchedEvent")) {
            const eggHatched = message as IEggHatched;
            _.each(this.config.eventHandlers, eh => eh.onEggHatched(eggHatched));
        }

        else if (_.includes(type, "EggIncubatorStatusEvent")) {
            const incubatorStatus = message as IIncubatorStatus;
            _.each(this.config.eventHandlers, eh => eh.onIncubatorStatus(incubatorStatus));
        }

        else {
            _.each(this.config.eventHandlers, eh => {
                if (eh.onUnknownEvent) {
                    eh.onUnknownEvent(message);
                }
            });
        }
    }

    private getCurrency = (message: any, currencyName: string): number => {
        const currencies = message.Profile.PlayerData.Currencies.$values as any[];
        const currency = _.find(currencies, x => x.Name === currencyName);
        return currency.Amount;
    }
}