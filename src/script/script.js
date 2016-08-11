var NecroWSClient = (function () {
    function NecroWSClient(url) {
        var _this = this;
        this.start = function (config) {
            _this.config = config;
            _this.webSocket = new WebSocket(_this.url);
            _this.webSocket.onopen = _this.clientOnOpen;
            _this.webSocket.onmessage = _this.clientOnMessage;
        };
        this.clientOnOpen = function () {
            console.log("Connected to " + _this.webSocket.url);
        };
        this.clientOnMessage = function (event) {
            var message = JSON.parse(event.data);
            console.log(message);
            var type = message.$type;
            if (_.includes(type, "UpdatePositionEvent")) {
                var positionEvent = message;
                _this.config.eventHandler.onLocationUpdate(positionEvent);
            }
        };
        this.url = url;
    }
    return NecroWSClient;
}());
var InterfaceHandler = (function () {
    function InterfaceHandler(map) {
        var _this = this;
        this.onLocationUpdate = function (location) {
            _this.map.movePlayer(location);
        };
        this.map = map;
    }
    return InterfaceHandler;
}());
var LeafletMap = (function () {
    function LeafletMap() {
        this.map = L.map("map").setView([0, 0], 13);
        var osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
        this.playerMarker = L.marker([0, 0], {});
        this.playerMarker.addTo(this.map);
        this.playerPath = L.polyline([], {
            color: "cyan"
        });
        this.playerPath.addTo(this.map);
    }
    LeafletMap.prototype.movePlayer = function (position) {
        var posArr = [position.Latitude, position.Longitude];
        this.playerMarker.setLatLng(posArr);
        this.playerPath.addLatLng(posArr);
        if (this.followPlayer) {
            this.map.setView(posArr);
        }
    };
    return LeafletMap;
}());
var Runner = (function () {
    function Runner(client, interfaceHandler) {
        var _this = this;
        this.start = function () {
            _this.client.start({
                eventHandler: _this.interface
            });
        };
        this.interface = interfaceHandler;
        this.client = client;
    }
    return Runner;
}());
$(function () {
    var lMap = new LeafletMap();
    var interfaceHandler = new InterfaceHandler(lMap);
    var necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    var runner = new Runner(necroClient, interfaceHandler);
    runner.start();
});
//# sourceMappingURL=script.js.map