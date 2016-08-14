interface IPlayerStatsEvent extends IEvent {
    BattleAttackTotal: number;
    BattleAttackWon: number;
    BattleDefendedWon: number;
    BattleTrainingTotal: number;
    BattleTrainingWon: number;
    BigMagikarpCaught: number;
    EggsHatched: number;
    Evolutions: number;
    Experience: number; // actually string
    KmWalked: number;
    Level: number;
    NextLevelXp: number; // actually string
    PokeStopVisits: number;
    PokeballsThrown: number;
    PokemonCaughtByType: number[]; // we parse it
    PokemonDeployed: number;
    PokemonsCaptured: number;
    PokemonsEncountered: number;
    PrestigeDroppedTotal: number;
    PrestigeRaisedTotal: number;
    PrevLevelXp: number; // actually string
    SmallRattataCaught: number;
    UniquePokedexEntries: number;
}