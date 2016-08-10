/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
var NecroWSClient = (function () {
    function NecroWSClient(config) {
        var _this = this;
        this.connect = function () {
            _this.client = new WebSocket(_this.config.serverURL);
            _this.client.onopen = _this.clientOnOpen;
            _this.client.onmessage = _this.clientOnMessage;
        };
        this.clientOnOpen = function () {
            console.log("Connected to " + _this.client.url);
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
        this.config = config;
    }
    return NecroWSClient;
})();
$(function () {
    var necroClient = new NecroWSClient({
        serverURL: "ws://127.0.0.1:14252",
        onLocationUpdate: function (location) {
            console.log("Updated location: " + location);
        }
    });
    necroClient.connect();
});
//# sourceMappingURL=script.js.map