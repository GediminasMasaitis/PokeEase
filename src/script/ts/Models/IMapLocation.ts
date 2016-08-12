interface IMapLocation {
    Latitude: number;
    Longitude: number;
}

interface IMapLocationEvent extends IEvent, IMapLocation {

}