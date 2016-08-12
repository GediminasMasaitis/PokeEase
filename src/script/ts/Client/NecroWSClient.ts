class NecroWSClient implements INecroClient {
    private url: string;
    private config: INecroClientConfig;
    private webSocket: WebSocket;
    private currentlySniping: boolean;

    constructor(url: string) {
        this.url = url;
        this.currentlySniping = false;
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
        const timestamp = Date.now();
        message.Timestamp = timestamp;

        const type = message.$type as string;

        if (_.includes(type, "UpdatePositionEvent")) {
            const mapLocation = message as IMapLocationEvent;
            _.each(this.config.eventHandlers, eh => eh.onLocationUpdate(mapLocation));
        }

        else if (_.includes(type, "PokeStopListEvent")) {
            const forts = message.Forts.$values as IFortEvent[];
            _.each(forts, fort => fort.Timestamp = timestamp);
            _.each(this.config.eventHandlers, eh => eh.onPokeStopList(forts));
        }

        else if (_.includes(type, "FortTargetEvent")) {
            const fortTarget = message as IFortTargetEvent;
            _.each(this.config.eventHandlers, eh => eh.onFortTarget(fortTarget));
        }

        else if (_.includes(type, "FortUsedEvent")) {
            const fortUsed = message as IFortUsedEvent;
            fortUsed.ItemsList = this.parseItemString(fortUsed.Items);
            _.each(this.config.eventHandlers, eh => eh.onFortUsed(fortUsed));
        }

        else if (_.includes(type, "ProfileEvent")) {
            const profile = message.Profile as IProfileEvent;
            profile.Timestamp = timestamp;
            profile.PlayerData.PokeCoin = this.getCurrency(message, "POKECOIN");
            profile.PlayerData.StarDust = this.getCurrency(message, "STARDUST");
            _.each(this.config.eventHandlers, eh => eh.onProfile(profile));
        }

        else if (_.includes(type, "PokemonCaptureEvent")) {
            const pokemonCapture = message as IPokemonCaptureEvent;
            pokemonCapture.IsSnipe = this.currentlySniping;
            _.each(this.config.eventHandlers, eh => eh.onPokemonCapture(pokemonCapture));
        }

        else if (_.includes(type, "EvolveCountEvent")) {
            const evolveCount = message as IEvolveCountEvent;
            _.each(this.config.eventHandlers, eh => eh.onEvolveCount(evolveCount));
        }

        else if (_.includes(type, "PokemonEvolveEvent")) {
            const pokemonEvolve = message as IPokemonEvolveEvent;
            _.each(this.config.eventHandlers, eh => eh.onPokemonEvolve(pokemonEvolve));
        }

        else if (_.includes(type, "SnipeScanEvent")) {
            const snipeScan = message as ISnipeScanEvent;
            _.each(this.config.eventHandlers, eh => eh.onSnipeScan(snipeScan));
        }

        else if (_.includes(type, "SnipeModeEvent")) {
            const snipeMode = message as ISnipeModeEvent;
            this.currentlySniping = snipeMode.Active;
            _.each(this.config.eventHandlers, eh => eh.onSnipeMode(snipeMode));
        }

        else if (_.includes(type, "SnipeEvent")) {
            const snipeMessage = message as ISnipeMessageEvent;
            _.each(this.config.eventHandlers, eh => eh.onSnipeMessage(snipeMessage));
        }

        else if (_.includes(type, "UpdateEvent")) {
            const updateEvent = message as IUpdateEvent;
            _.each(this.config.eventHandlers, eh => eh.onUpdate(updateEvent));
        }

        else if (_.includes(type, "WarnEvent")) {
            const warnEvent = message as IWarnEvent;
            _.each(this.config.eventHandlers, eh => eh.onWarn(warnEvent));
        }

        else if (_.includes(type, "EggHatchedEvent")) {
            const eggHatched = message as IEggHatchedEvent;
            _.each(this.config.eventHandlers, eh => eh.onEggHatched(eggHatched));
        }

        else if (_.includes(type, "EggIncubatorStatusEvent")) {
            const incubatorStatus = message as IIncubatorStatusEvent;
            _.each(this.config.eventHandlers, eh => eh.onIncubatorStatus(incubatorStatus));
        }

        else if (_.includes(type, "ItemRecycledEvent")) {
            const itemRecycle = message as IItemRecycleEvent;
            _.each(this.config.eventHandlers, eh => eh.onItemRecycle(itemRecycle));
        }

        else if (_.includes(type, "TransferPokemonEvent")) {
            const pokemonTransfer = message as IPokemonTransferEvent;
            _.each(this.config.eventHandlers, eh => eh.onPokemonTransfer(pokemonTransfer));
        }

        else {
            _.each(this.config.eventHandlers, eh => {
                if (eh.onUnknownEvent) {
                    eh.onUnknownEvent(message);
                }
            });
        }
        console.log(message);
    }

    private parseItemString = (itemStr: string): IFortItem[] => {
        const itemParseRegex = /(\d+) x (.+?)(?:,|$)/g;
        const itemsList: IFortItem[] = [];
        while (true) {
            const regexResults = itemParseRegex.exec(itemStr);
            if (regexResults === null) {
                break;
            }
            itemsList.push({
                Count: parseInt(regexResults[1]),
                Name: regexResults[2]
            });
        }
        return itemsList;
    }

    private getCurrency = (message: any, currencyName: string): number => {
        const currencies = message.Profile.PlayerData.Currencies.$values as any[];
        const currency = _.find(currencies, x => x.Name === currencyName);
        return currency.Amount;
    }
}