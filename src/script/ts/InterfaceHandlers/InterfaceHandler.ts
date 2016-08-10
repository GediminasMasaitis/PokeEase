class InterfaceHandler implements IEventHandler {
    private map: IMap;

    constructor(map: IMap) {
        this.map = map;
    }

    public onLocationUpdate = (location: UpdatePositionEvent): void => {
        this.map.movePlayer(location);
    }
}