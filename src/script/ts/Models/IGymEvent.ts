interface IGymEvent extends IFortEvent {
    OwnedByTeam: PlayerTeam;
    GymPoints: string;
    GuardPokemonId: number;
    GuardPokemonCp: number;
}