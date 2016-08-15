class InterfaceHandler implements IEventHandler {
    private config: IInterfaceHandlerConfig;
    private currentlySniping: boolean;
    private pokeStops: IPokeStopEvent[];
    private gyms: IGymEvent[];
    private exp: number;
    private stardust: number;
    private previousCaptureAttempts: IPokemonCaptureEvent[];
    private itemsUsedForCapture: number[];

    constructor(config: IInterfaceHandlerConfig) {
        this.config = config;
        this.currentlySniping = false;
        this.previousCaptureAttempts = [];
        this.itemsUsedForCapture = [];
        this.exp = 0;
    }

    public onLocationUpdate = (location: IMapLocationEvent): void => {
        if (!this.currentlySniping) {
            this.config.map.movePlayer(location);
        }
    }

    public onPokeStopList = (forts: IFortEvent[]): void => {
        if (!this.pokeStops) {
            this.pokeStops = [];
        }
        if (!this.gyms) {
            this.gyms = [];
        }
        for (let i = 0; i < forts.length; i++) {
            if (forts[i].Type === 1) {
                const pokeStop = forts[i] as IPokeStopEvent;
                pokeStop.Status = PokeStopStatus.Normal;
                if (pokeStop.CooldownCompleteTimestampMs) {
                    const currentMs = TimeUtils.getCurrentTimestampMs();
                    if (pokeStop.CooldownCompleteTimestampMs > currentMs) {
                        pokeStop.Status |= PokeStopStatus.Visited;
                    }
                }
                if (pokeStop.LureInfo !== null) {
                    pokeStop.Status |= PokeStopStatus.Lure;
                }
                this.addFortToList(pokeStop, this.pokeStops);
            } else {
                this.addFortToList(forts[i], this.gyms);
            }
        }
        this.config.map.setPokeStops(this.pokeStops);
        this.config.map.setGyms(this.gyms);
    }

    private addFortToList = (fort: IFortEvent, fortList: IFortEvent[]): void => {
        const index = _.findIndex(fortList, f => f.Id === fort.Id);
        if (index === -1) {
            fortList.push(fort);
        } else {
            fort.Name = fortList[index].Name;
            fortList[index] = fort;
        }
    }

    public onFortTarget(fortTarget: IFortTargetEvent): void {
        
    }

    public onFortUsed(fortUsed: IFortUsedEvent): void {
        const pokeStop = _.find(this.pokeStops, ps => ps.Id === fortUsed.Id);
        pokeStop.Name = fortUsed.Name;
        this.config.map.usePokeStop(fortUsed);
        this.exp += fortUsed.Exp;
        this.config.notificationManager.addNotificationPokeStopUsed(fortUsed);
        this.config.profileInfoManager.addExp(this.exp, fortUsed.Exp);
    }

    public onProfile(profile: IProfileEvent): void {
        this.config.mainMenuManager.updateProfileData(profile);
        this.config.profileInfoManager.setProfileData(profile);
    }

    public onUseBerry(berry: IUseBerryEvent): void {
        const berryId = berry.BerryType || StaticInfo.berryIds[0];
        this.itemsUsedForCapture.push(berryId);
    }

    public onPokemonCapture = (pokemonCapture: IPokemonCaptureEvent): void => {
        if (this.previousCaptureAttempts.length > 0 && this.previousCaptureAttempts[0].Id !== pokemonCapture.Id) {
            this.previousCaptureAttempts = [];
            if (this.itemsUsedForCapture.length > 0) {
                const lastUsed = _.last(this.itemsUsedForCapture);
                if (StaticInfo.berryIds.indexOf(lastUsed) === -1) {
                    this.itemsUsedForCapture = [];
                }
            }
        }
        this.previousCaptureAttempts.push(pokemonCapture);
        this.itemsUsedForCapture.push(pokemonCapture.Pokeball);
        if (pokemonCapture.Status === PokemonCatchStatus.Success) {
            this.config.map.onPokemonCapture(pokemonCapture);
            this.config.notificationManager.addNotificationPokemonCapture(this.previousCaptureAttempts, this.itemsUsedForCapture);
            this.exp += pokemonCapture.Exp;
            this.config.profileInfoManager.addExp(this.exp, pokemonCapture.Exp);
        }
    }

    public onEvolveCount(evolveCount: IEvolveCountEvent): void {
        
    }

    public onPokemonEvolve(pokemonEvolve: IPokemonEvolveEvent): void {
        this.config.notificationManager.addNotificationPokemonEvolved(pokemonEvolve);
        this.exp += pokemonEvolve.Exp;
        this.config.profileInfoManager.addExp(this.exp, pokemonEvolve.Exp);
    }

    public onSnipeScan(snipeScan: ISnipeScanEvent): void {
        
    }

    public onSnipeMode(snipeMode: ISnipeModeEvent): void {
        this.currentlySniping = snipeMode.Active;
    }

    public onSnipeMessage(snipeMessage: ISnipeMessageEvent): void {
        
    }

    public onUpdate(update: IUpdateEvent): void {

    }

    public onWarn(warn: IWarnEvent): void {

    }

    public onEggHatched(eggHatched: IEggHatchedEvent): void {
        this.config.notificationManager.addNotificationEggHatched(eggHatched);
    }

    public onIncubatorStatus(incubatorStatus: IIncubatorStatusEvent): void {
        this.config.notificationManager.addNotificationIncubatorStatus(incubatorStatus);
    }

    public onItemRecycle(itemRecycle: IItemRecycleEvent): void {
        this.config.notificationManager.addNotificationItemRecycle(itemRecycle);
    }

    public onPokemonTransfer(pokemonTransfer: IPokemonTransferEvent): void {
        this.config.notificationManager.addNotificationPokemonTransfer(pokemonTransfer);
    }



    public onPokemonList(pokemonList: IPokemonListEvent): void {
        this.config.pokemonMenuManager.updatePokemonList(pokemonList);
    }

    public onPlayerStats(playerStats: IPlayerStatsEvent): void {
        this.exp = playerStats.Experience;
        this.config.profileInfoManager.setPlayerStats(playerStats);
    }

    public onSendPokemonListRequest(request: IRequest): void {
        this.config.pokemonMenuManager.pokemonListRequested(request);
    }

    public onSendEggsListRequest(request: IRequest): void {
        
    }

    public onSendInventoryListRequest(request: IRequest): void {
        
    }

    public onSendPlayerStatsRequest(request: IRequest): void {
        
    }

    public onSendGetPokemonSettingsRequest(request: IRequest): void {
        
    }

    public onSendTransferPokemonRequest(request: IRequest): void {
        
    }

    public onSendEvolvePokemonRequest(request: IRequest): void {
        
    }
}