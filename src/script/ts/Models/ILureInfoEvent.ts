interface ILureInfoEvent extends IEvent {
    ActivePokemonId: number;
    EncounterId: string;
    FortId: string;
    LureExpiresTimestampMs: string;
}