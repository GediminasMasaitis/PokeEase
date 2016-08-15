interface IMapLocation {
    Latitude: number;
    Longitude: number;
}

interface IUpdatePositionEvent extends IEvent, IMapLocation {

}