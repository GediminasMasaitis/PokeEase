interface IGymEvent extends IFortEvent {
    OwnedByTeam: GymTeam;
    GymPoints: string;
}

enum GymTeam {
    Neutral = 0,
    Mystic = 1,
    Valor = 2,
    Instinct = 3
}