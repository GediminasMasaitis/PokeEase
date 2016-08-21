interface IFortEvent extends IUpdatePositionEvent {
    Type: FortType;
    Id: string;
    Name?: string;
    LMarker?: L.Marker;
}