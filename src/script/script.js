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
                if (_this.config.onLocationUpdate) {
                    _this.config.onLocationUpdate(positionEvent);
                }
            }
        };
        this.url = url;
    }
    return NecroWSClient;
})();
var Runner = (function () {
    function Runner(client) {
        var _this = this;
        this.start = function () {
            var config = {
                onLocationUpdate: function (location) {
                    console.log("location get");
                }
            };
            _this.client.start(config);
        };
        this.client = client;
    }
    return Runner;
})();
/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
$(function () {
    var necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    var runner = new Runner(necroClient);
    runner.start();
});
//# sourceMappingURL=script.js.map