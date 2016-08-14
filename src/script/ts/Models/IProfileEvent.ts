interface IProfileEvent extends IEvent {
    PlayerData: IPlayerData;
    Success: boolean;
}

interface IPlayerData {
    CreationTimestampMs: string;
    PokeCoin: number;
    StarDust: number;
    MaxItemStorage: number;
    MaxPokemonStorage: number;
    Team: PlayerTeam;
    Username: string;
}