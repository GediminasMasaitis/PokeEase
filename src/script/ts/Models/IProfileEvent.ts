interface IProfileEvent extends IEvent {
    PlayerData: IPlayerData;
    Success: boolean;
}

enum PlayerTeam {
    Instinct = 0,
    Mystic = 1,
    Valor = 2
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