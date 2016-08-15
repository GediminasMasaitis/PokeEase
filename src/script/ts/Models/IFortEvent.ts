interface IFortEvent extends IUpdatePositionEvent {
    Type: number;
    Id: string;
    Name?: string;
    LMarker?: L.Marker;
}