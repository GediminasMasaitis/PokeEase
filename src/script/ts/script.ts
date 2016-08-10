/// <reference path="../../external/typings/jquery/jquery.d.ts" />
/// <reference path="../../external/typings/lodash/lodash.d.ts" />
/// <reference path="../../external/typings/openlayers.d.ts" />

$(() => {
    //var gmap = new GoogleMap($());
    var ol = new OpenLayersMap("map");
    var interfaceHandler = new InterfaceHandler(ol);
    var necroClient = new NecroWSClient("ws://127.0.0.1:14252");
    var runner = new Runner(necroClient, interfaceHandler);
    runner.start();
});

