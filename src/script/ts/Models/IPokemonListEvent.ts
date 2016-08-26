interface IPokemonListEvent extends IEvent {
    Pokemons: IPokemonListEntry[];
}

interface IPokemonListEntry {
    PokemonId: number;
    Id: string;
    AdditionalCpMultiplier: number;
    BattlesAttacked: number;
    BattlesDefended: number;
    CapturedCellId: number;
    Cp: number;
    CpMultiplier: number;
    CreationTimeMs: number;
    DeployedFortId: string;
    EggIncubatorId: string;
    EggKmWalkedStart: number;
    EggKmWalkedTarget: number;
    Favorite: number;
    FromFort: number;
    HeightM: number;
    IndividualAttack: number;
    IndividualDefense: number;
    IndividualStamina: number;
    IsEgg: boolean;
    Move1: number;
    Move2: number;
    Nickname: string;
    NumUpgrades: number;
    Origin: number;
    OwnerName: string;
    Pokeball: number;
    Stamina: number;
    StaminaMax: number;
    WeightKg: number;

    Perfection: number;
    FamilyCandies?: number;
}