class BotWSClient implements IBotClient, IRequestSender {
    private config: IBotClientConfig;
    private webSocket: WebSocket;
    private currentlySniping: boolean;
    private running: boolean;
    private restarting: boolean;
    private profileSent: boolean;
    private verifyProfileTimeout: number;
    public currentBotFamily: BotFamily;

    constructor() {
        this.currentlySniping = false;
        this.running = false;
        this.profileSent = false;
        this.currentBotFamily = BotFamily.Undetermined;
    }

    public start = (config: IBotClientConfig): void => {
        this.config = config;
        const url = `ws://127.0.0.1:${config.settingsService.settings.clientPort}`;
        this.webSocket = new WebSocket(url);
        this.webSocket.onopen = this.clientOnOpen;
        this.webSocket.onmessage = this.clientOnMessage;
        this.webSocket.onclose = this.clientOnClose;
        this.webSocket.onerror = this.clientOnError;
        this.running = true;
    }

    public restart = (): void => {
        this.restarting = true;
        this.stop();
    }

    public stop = (): void => {
        this.running = false;
        this.webSocket.close();
    }

    private clientOnOpen = (event: Event): void => {
        console.log(`WebSocket connected to ${this.webSocket.url}`);
        this.verifyProfileTimeout = setTimeout(this.verifyProfileSent, 5000);
    }

    private verifyProfileSent = (): void => {
        if (!this.profileSent) {
            console.log("Profile event not received. Reconnecting...");
            this.restart();
        }
    }

    private clientOnClose = (event: CloseEvent): void => {
        console.log("WebSocket closed", event);
        clearTimeout(this.verifyProfileTimeout);
        this.profileSent = false;
        if (this.running) {
            setTimeout(() => {
                this.start(this.config);
            }, 1000);
        }
        if (this.restarting) {
            this.restarting = false;
            this.start(this.config);
        }
    }

    private clientOnError = (event: Event): void => {

    }

    private clientOnMessage = (event: MessageEvent): void => {
        const message = JSON.parse(event.data);
        const timestamp = Date.now();
        message.Timestamp = timestamp;

        console.log("%c<<< INCOMING", "color: green", message);

        const type = message.$type as string;

        if (_.includes(type, ".ProfileEvent,")) {
            if (this.currentBotFamily === BotFamily.Undetermined) {
                if (_.startsWith(type, "PoGo.NecroBot.")) {
                    this.currentBotFamily = BotFamily.Necro;
                } else if (_.startsWith(type, "PoGo.PokeMobBot.")) {
                    this.currentBotFamily = BotFamily.PMB;
                }
            }

            const profile = message.Profile as IProfileEvent;
            profile.Timestamp = timestamp;
            profile.PlayerData.PokeCoin = this.getCurrency(message, "POKECOIN");
            profile.PlayerData.StarDust = this.getCurrency(message, "STARDUST");
            this.profileSent = true;
            _.each(this.config.eventHandlers, eh => eh.onProfile(profile));
        }


        else if (_.includes(type, ".UpdatePositionEvent,")) {
            const mapLocation = message as IUpdatePositionEvent;
            _.each(this.config.eventHandlers, eh => eh.onUpdatePosition(mapLocation));
        }

        else if (_.includes(type, ".PokeStopListEvent,")) {
            const forts = message.Forts.$values as IFortEvent[];
            _.each(forts, fort => fort.Timestamp = timestamp);
            _.each(this.config.eventHandlers, eh => eh.onPokeStopList(forts));
        }


        else if (_.includes(type, ".FortTargetEvent,")) {
            const fortTarget = message as IFortTargetEvent;
            _.each(this.config.eventHandlers, eh => eh.onFortTarget(fortTarget));
        }

        else if (_.includes(type, ".FortUsedEvent,")) {
            const fortUsed = message as IFortUsedEvent;
            fortUsed.ItemsList = this.parseItemString(fortUsed.Items);
            _.each(this.config.eventHandlers, eh => eh.onFortUsed(fortUsed));
        }

        else if (_.includes(type, ".UseBerry,")) {
            const useBerry = message as IUseBerryEvent;
            _.each(this.config.eventHandlers, eh => eh.onUseBerry(useBerry));
        }

        else if (_.includes(type, ".PokemonCaptureEvent,")) {
            const pokemonCapture = message as IPokemonCaptureEvent;
            pokemonCapture.IsSnipe = this.currentlySniping;
            _.each(this.config.eventHandlers, eh => eh.onPokemonCapture(pokemonCapture));
        }

        else if (_.includes(type, ".EvolveCountEvent,")) {
            const evolveCount = message as IEvolveCountEvent;
            _.each(this.config.eventHandlers, eh => eh.onEvolveCount(evolveCount));
        }

        else if (_.includes(type, ".PokemonEvolveEvent,")) {
            const pokemonEvolve = message as IPokemonEvolveEvent;
            _.each(this.config.eventHandlers, eh => eh.onPokemonEvolve(pokemonEvolve));
        }

        else if (_.includes(type, ".SnipeScanEvent,")) {
            const snipeScan = message as ISnipeScanEvent;
            _.each(this.config.eventHandlers, eh => eh.onSnipeScan(snipeScan));
        }

        else if (_.includes(type, ".SnipeModeEvent,")) {
            const snipeMode = message as ISnipeModeEvent;
            this.currentlySniping = snipeMode.Active;
            _.each(this.config.eventHandlers, eh => eh.onSnipeMode(snipeMode));
        }

        else if (_.includes(type, ".SnipeEvent,")) {
            const snipeMessage = message as ISnipeMessageEvent;
            _.each(this.config.eventHandlers, eh => eh.onSnipeMessage(snipeMessage));
        }

        else if (_.includes(type, ".UpdateEvent,")) {
            const updateEvent = message as IUpdateEvent;
            _.each(this.config.eventHandlers, eh => eh.onUpdate(updateEvent));
        }

        else if (_.includes(type, ".WarnEvent,")) {
            const warnEvent = message as IWarnEvent;
            _.each(this.config.eventHandlers, eh => eh.onWarn(warnEvent));
        }

        else if (_.includes(type, ".EggHatchedEvent,")) {
            const eggHatched = message as IEggHatchedEvent;
            _.each(this.config.eventHandlers, eh => eh.onEggHatched(eggHatched));
        }

        else if (_.includes(type, ".EggIncubatorStatusEvent,")) {
            const incubatorStatus = message as IIncubatorStatusEvent;
            _.each(this.config.eventHandlers, eh => eh.onIncubatorStatus(incubatorStatus));
        }

        else if (_.includes(type, ".ItemRecycledEvent,")) {
            const itemRecycle = message as IItemRecycleEvent;
            _.each(this.config.eventHandlers, eh => eh.onItemRecycle(itemRecycle));
        }

        else if (_.includes(type, ".TransferPokemonEvent,")) {
            const pokemonTransfer = message as IPokemonTransferEvent;
            _.each(this.config.eventHandlers, eh => eh.onPokemonTransfer(pokemonTransfer));
        }

        //#region Request response events
        else if (_.includes(type, ".PokemonListEvent,") || _.includes(type, ".PokemonListResponce,")) {

            let originalList: any;
            if (this.currentBotFamily === BotFamily.PMB) {
                originalList = message.PokemonList.$values;
            } else {
                originalList = message.Data.$values;
            }

            const pokemonList: IPokemonListEvent = {
                Pokemons: [],
                Timestamp: timestamp
            };
            
            _.each(originalList, val => {
                if (this.currentBotFamily === BotFamily.PMB) {
                    const pokemon = val.Item1 as IPokemonListEntry;
                    pokemon.Perfection = val.Item2;
                    pokemon.FamilyCandies = val.Item3;
                    pokemonList.Pokemons.push(pokemon);
                } else {
                    const pokemon = val.Base as IPokemonListEntry;
                    pokemon.Perfection = val.IvPerfection;
                    pokemonList.Pokemons.push(pokemon);
                }
            });

            _.each(this.config.eventHandlers, eh => eh.onPokemonList(pokemonList));
        }

        else if (_.includes(type, ".EggsListEvent,") || _.includes(type, ".EggListResponce,")) {
            let eggList: IEggListEvent;
            if (this.currentBotFamily === BotFamily.PMB) {
                eggList = message;
                eggList.Incubators = message.Incubators.$values;
                eggList.UnusedEggs = message.UnusedEggs.$values;
            } else {
                eggList = message.Data;
                eggList.Incubators = message.Data.Incubators.$values;
                eggList.UnusedEggs = message.Data.UnusedEggs.$values;
            }
            eggList.Timestamp = timestamp;
            _.each(this.config.eventHandlers, eh => eh.onEggList(eggList));
        }

        else if (_.includes(type, ".InventoryListEvent,") || _.includes(type, ".ItemListResponce,")) {
            let originalList: any;
            if (this.currentBotFamily === BotFamily.PMB) {
                originalList = message.Items.$values;
            } else {
                originalList = message.Data.$values;
            }
            const inventoryList: IInventoryListEvent = {
                Items: originalList,
                Timestamp: timestamp
            };
            _.each(this.config.eventHandlers, eh => eh.onInventoryList(inventoryList));
        }

        else if (_.includes(type, ".PlayerStatsEvent,") || _.includes(type, ".TrainerProfileResponce,")) {
            let originalStats: any;
            if (this.currentBotFamily === BotFamily.PMB) {
                originalStats = message.PlayerStats.$values[0];
            } else {
                originalStats = message.Data.Stats;
            }
            
            const playerStats = originalStats as IPlayerStatsEvent;
            playerStats.Experience = parseInt(originalStats.Experience);
            playerStats.NextLevelXp = parseInt(originalStats.NextLevelXp);
            playerStats.PrevLevelXp = parseInt(originalStats.PrevLevelXp);
            playerStats.PokemonCaughtByType = originalStats.PokemonCaughtByType.$values;
            playerStats.Timestamp = timestamp;
            _.each(this.config.eventHandlers, eh => eh.onPlayerStats(playerStats));
        }
        
        //#endregion

        else {
            _.each(this.config.eventHandlers, eh => {
                if (eh.onUnknownEvent) {
                    eh.onUnknownEvent(message);
                }
            });
        }
        
    }




    public sendPokemonListRequest = (): void => {
        const pmbRequest: IRequest = { Command: "PokemonList" };
        const necroRequest: IRequest = { Command: "GetPokemonList" };
        _.each(this.config.eventHandlers, eh => eh.onSendPokemonListRequest(pmbRequest));
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.PMB) {
            this.sendRequest(pmbRequest);
        }
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.Necro) {
            this.sendRequest(necroRequest);
        }
    };

    public sendEggsListRequest = (): void => {
        const pmbRequest: IRequest = { Command: "EggsList" };
        const necroRequest: IRequest = { Command: "GetEggList" };
        _.each(this.config.eventHandlers, eh => eh.onSendEggsListRequest(pmbRequest));
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.PMB) {
            this.sendRequest(pmbRequest);
        }
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.Necro) {
            this.sendRequest(necroRequest);
        }
    };

    public sendInventoryListRequest = (): void => {
        const pmbRequest: IRequest = { Command: "InventoryList" };
        const necroRequest: IRequest = { Command: "GetItemsList" };
        _.each(this.config.eventHandlers, eh => eh.onSendInventoryListRequest(pmbRequest));
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.PMB) {
            this.sendRequest(pmbRequest);
        }
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.Necro) {
            this.sendRequest(necroRequest);
        }
    };

    public sendPlayerStatsRequest = (): void => {
        const pmbRequest: IRequest = { Command: "PlayerStats" };
        const necroRequest: IRequest = { Command: "GetTrainerProfile" };
        _.each(this.config.eventHandlers, eh => eh.onSendPlayerStatsRequest(pmbRequest));
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.PMB) {
            this.sendRequest(pmbRequest);
        }
        if (this.currentBotFamily === BotFamily.Undetermined || this.currentBotFamily === BotFamily.Necro) {
            this.sendRequest(necroRequest);
        }
    };

    public sendGetPokemonSettingsRequest = (): void => {
        const request: IRequest = {
             Command: "GetPokemonSettings"
        };
        _.each(this.config.eventHandlers, eh => eh.onSendGetPokemonSettingsRequest(request));
        this.sendRequest(request);
    };

    public sendTransferPokemonRequest = (pokemonId: number): void => {
        const request: IRequest = {
             Command: "TransferPokemon",
             Data: pokemonId.toString(),
             PokemonId: pokemonId
        };
        _.each(this.config.eventHandlers, eh => eh.onSendTransferPokemonRequest(request));
        this.sendRequest(request);
    };

    public sendEvolvePokemonRequest = (pokemonId: number): void => {
        const request: IRequest = {
             Command: "EvolvePokemon",
             Data: pokemonId.toString(),
             PokemonId: pokemonId
        };
        _.each(this.config.eventHandlers, eh => eh.onSendEvolvePokemonRequest(request));
        this.sendRequest(request);
    };
    
    public sendRequest = (request: IRequest): void => {
        console.log("%c>>> OUTGOING:", "color: red", request);
        const requestStr = JSON.stringify(request);
        this.webSocket.send(requestStr);
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