interface IPokemonEvolveEvent extends  IEvent {
    Exp: number;
    Id: number;
    UniqueId: number;
    Result: PokemonEvolveResult;
}

enum PokemonEvolveResult {
    Unset = 0,
    Success = 1,
    FailedPokemonMissing = 2,
    FailedInsufficientResources = 3,
    FailedPokemonCannotEvolve = 4,
    FailedPokemonIsDeployed = 5
}