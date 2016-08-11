enum PokeStopStatus {
    Normal = 0,
    Visited = 1 << 0,
    Lure = 1 << 1,
    VisitedLure = Visited | Lure
}