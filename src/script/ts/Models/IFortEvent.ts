interface IFortEvent extends IMapLocationEvent {
    Type: number;
    Id: string;
    Name?: string;
    LMarker?: L.Marker;
}