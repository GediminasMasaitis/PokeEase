interface IPokemonCaptureEvent extends IMapLocationEvent {
    Id: string;
    Attempt: number;
    BallAmount: number;
    Pokeball: number;
    Probability: number;
    Exp: number;
    FamilyCandies: number;
    Stardust: number;
    CatchType: "Normal" | "Lure" | "Incense";
    Cp: number;
    Level: number;
    MaxCp: number;
    Perfection: number;
    PokemonId: number;
    Status: PokemonCatchStatus;

    IsSnipe?: boolean;
    LMarker?: L.Marker;
}

enum PokemonCatchStatus {
    Success = 1,
    Escape = 2,
    Flee = 3
}