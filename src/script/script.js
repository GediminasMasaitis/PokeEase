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
})();
var InterfaceHandler = (function () {
    function InterfaceHandler(map) {
        var _this = this;
        this.onLocationUpdate = function (location) {
            _this.map.movePlayer(location);
        };
        this.map = map;
    }
    return InterfaceHandler;
})();
var OpenLayersMap = (function () {
    function OpenLayersMap(divId) {
        this.map = new ol.Map({
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: divId
        });
    }
    OpenLayersMap.prototype.movePlayer = function (position) {
        this.map.getView().setCenter([position.Latitude, position.Longitude]);
    };
    return OpenLayersMap;
})();
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
})();
/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/openlayers.d.ts" />
$(function () {
    //var gmap = new GoogleMap($());
    var ol = new OpenLayersMap("map");
    var interfaceHandler = new InterfaceHandler(ol);
    var necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    var runner = new Runner(necroClient, interfaceHandler);
    runner.start();
});
//# sourceMappingURL=script.js.map