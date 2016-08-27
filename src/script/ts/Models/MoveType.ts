enum MoveType {
    None = 0,
    QuickMove = 1 << 0,
    CinematicMove = 1 << 1,
    Both = QuickMove | CinematicMove
}