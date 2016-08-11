/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/leaflet/leaflet.d.ts" />

$(() => {
    //var gmap = new GoogleMap($());
    var lMap = new LeafletMap();
    var interfaceHandler = new InterfaceHandler(lMap);
    var necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    var runner = new Runner(necroClient, interfaceHandler);
    runner.start();
});

