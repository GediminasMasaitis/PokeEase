var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BotWSClient = (function () {
    function BotWSClient(url) {
        var _this = this;
        this.start = function (config) {
            _this.config = config;
            _this.webSocket = new WebSocket(_this.url);
            _this.webSocket.onopen = _this.clientOnOpen;
            _this.webSocket.onmessage = _this.clientOnMessage;
            _this.webSocket.onclose = _this.clientOnClose;
            _this.webSocket.onerror = _this.clientOnError;
            _this.running = true;
        };
        this.stop = function () {
            _this.running = false;
            _this.webSocket.close();
        };
        this.clientOnOpen = function (event) {
            console.log("WebSocket connected to " + _this.webSocket.url);
            _this.sendPlayerStatsRequest();
        };
        this.clientOnClose = function (event) {
            console.log("WebSocket closed", event);
            if (_this.running) {
                setTimeout(function () {
                    _this.start(_this.config);
                }, 2000);
            }
        };
        this.clientOnError = function (event) {
        };
        this.clientOnMessage = function (event) {
            var message = JSON.parse(event.data);
            var timestamp = Date.now();
            message.Timestamp = timestamp;
            console.log("%c<<< INCOMING", "color: green", message);
            var type = message.$type;
            if (_.includes(type, "UpdatePositionEvent")) {
                var mapLocation_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onLocationUpdate(mapLocation_1); });
            }
            else if (_.includes(type, "PokeStopListEvent")) {
                var forts_1 = message.Forts.$values;
                _.each(forts_1, function (fort) { return fort.Timestamp = timestamp; });
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokeStopList(forts_1); });
            }
            else if (_.includes(type, "FortTargetEvent")) {
                var fortTarget_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onFortTarget(fortTarget_1); });
            }
            else if (_.includes(type, "FortUsedEvent")) {
                var fortUsed_1 = message;
                fortUsed_1.ItemsList = _this.parseItemString(fortUsed_1.Items);
                _.each(_this.config.eventHandlers, function (eh) { return eh.onFortUsed(fortUsed_1); });
            }
            else if (_.includes(type, "ProfileEvent")) {
                var profile_1 = message.Profile;
                profile_1.Timestamp = timestamp;
                profile_1.PlayerData.PokeCoin = _this.getCurrency(message, "POKECOIN");
                profile_1.PlayerData.StarDust = _this.getCurrency(message, "STARDUST");
                _.each(_this.config.eventHandlers, function (eh) { return eh.onProfile(profile_1); });
            }
            else if (_.includes(type, "UseBerry")) {
                var useBerry_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onUseBerry(useBerry_1); });
            }
            else if (_.includes(type, "PokemonCaptureEvent")) {
                var pokemonCapture_1 = message;
                pokemonCapture_1.IsSnipe = _this.currentlySniping;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonCapture(pokemonCapture_1); });
            }
            else if (_.includes(type, "EvolveCountEvent")) {
                var evolveCount_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onEvolveCount(evolveCount_1); });
            }
            else if (_.includes(type, "PokemonEvolveEvent")) {
                var pokemonEvolve_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonEvolve(pokemonEvolve_1); });
            }
            else if (_.includes(type, "SnipeScanEvent")) {
                var snipeScan_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeScan(snipeScan_1); });
            }
            else if (_.includes(type, "SnipeModeEvent")) {
                var snipeMode_1 = message;
                _this.currentlySniping = snipeMode_1.Active;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeMode(snipeMode_1); });
            }
            else if (_.includes(type, "SnipeEvent")) {
                var snipeMessage_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeMessage(snipeMessage_1); });
            }
            else if (_.includes(type, "UpdateEvent")) {
                var updateEvent_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onUpdate(updateEvent_1); });
            }
            else if (_.includes(type, "WarnEvent")) {
                var warnEvent_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onWarn(warnEvent_1); });
            }
            else if (_.includes(type, "EggHatchedEvent")) {
                var eggHatched_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onEggHatched(eggHatched_1); });
            }
            else if (_.includes(type, "EggIncubatorStatusEvent")) {
                var incubatorStatus_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onIncubatorStatus(incubatorStatus_1); });
            }
            else if (_.includes(type, "ItemRecycledEvent")) {
                var itemRecycle_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onItemRecycle(itemRecycle_1); });
            }
            else if (_.includes(type, "TransferPokemonEvent")) {
                var pokemonTransfer_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonTransfer(pokemonTransfer_1); });
            }
            else if (_.includes(type, "PokemonListEvent")) {
                var pokemonList_1 = {
                    Pokemons: [],
                    Timestamp: timestamp
                };
                _.each(message.PokemonList.$values, function (val) {
                    var pokemon = val.Item1;
                    pokemon.Perfection = val.Item2;
                    pokemon.FamilyCandies = val.Item3;
                    pokemonList_1.Pokemons.push(pokemon);
                });
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonList(pokemonList_1); });
            }
            else if (_.includes(type, "PlayerStatsEvent")) {
                var originalStats = message.PlayerStats.$values[0];
                var playerStats_1 = originalStats;
                playerStats_1.Experience = parseInt(originalStats.Experience);
                playerStats_1.NextLevelXp = parseInt(originalStats.NextLevelXp);
                playerStats_1.PrevLevelXp = parseInt(originalStats.PrevLevelXp);
                playerStats_1.PokemonCaughtByType = originalStats.PokemonCaughtByType.$values;
                playerStats_1.Timestamp = timestamp;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPlayerStats(playerStats_1); });
            }
            else {
                _.each(_this.config.eventHandlers, function (eh) {
                    if (eh.onUnknownEvent) {
                        eh.onUnknownEvent(message);
                    }
                });
            }
        };
        this.sendPokemonListRequest = function () {
            var request = {
                Command: "PokemonList"
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendPokemonListRequest(request); });
            _this.sendRequest(request);
        };
        this.sendEggsListRequest = function () {
            var request = {
                Command: "EggsList"
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendEggsListRequest(request); });
            _this.sendRequest(request);
        };
        this.sendInventoryListRequest = function () {
            var request = {
                Command: "InventoryList"
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendInventoryListRequest(request); });
            _this.sendRequest(request);
        };
        this.sendPlayerStatsRequest = function () {
            var request = {
                Command: "PlayerStats"
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendPlayerStatsRequest(request); });
            _this.sendRequest(request);
        };
        this.sendGetPokemonSettingsRequest = function () {
            var request = {
                Command: "GetPokemonSettings"
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendGetPokemonSettingsRequest(request); });
            _this.sendRequest(request);
        };
        this.sendTransferPokemonRequest = function (pokemonId) {
            var request = {
                Command: "TransferPokemon",
                Data: pokemonId.toString()
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendTransferPokemonRequest(request); });
            _this.sendRequest(request);
        };
        this.sendEvolvePokemonRequest = function (pokemonId) {
            var request = {
                Command: "EvolvePokemon",
                Data: pokemonId.toString()
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendEvolvePokemonRequest(request); });
            _this.sendRequest(request);
        };
        this.sendRequest = function (request) {
            console.log("%c>>> OUTGOING:", "color: red", request);
            var requestStr = JSON.stringify(request);
            _this.webSocket.send(requestStr);
        };
        this.parseItemString = function (itemStr) {
            var itemParseRegex = /(\d+) x (.+?)(?:,|$)/g;
            var itemsList = [];
            while (true) {
                var regexResults = itemParseRegex.exec(itemStr);
                if (regexResults === null) {
                    break;
                }
                itemsList.push({
                    Count: parseInt(regexResults[1]),
                    Name: regexResults[2]
                });
            }
            return itemsList;
        };
        this.getCurrency = function (message, currencyName) {
            var currencies = message.Profile.PlayerData.Currencies.$values;
            var currency = _.find(currencies, function (x) { return x.Name === currencyName; });
            return currency.Amount;
        };
        this.url = url;
        this.currentlySniping = false;
        this.running = false;
    }
    return BotWSClient;
}());
var InterfaceHandler = (function () {
    function InterfaceHandler(config) {
        var _this = this;
        this.onLocationUpdate = function (location) {
            if (!_this.currentlySniping) {
                _this.config.map.movePlayer(location);
            }
        };
        this.onPokeStopList = function (forts) {
            if (!_this.pokeStops) {
                _this.pokeStops = [];
            }
            if (!_this.gyms) {
                _this.gyms = [];
            }
            for (var i = 0; i < forts.length; i++) {
                if (forts[i].Type === 1) {
                    var pokeStop = forts[i];
                    pokeStop.Status = PokeStopStatus.Normal;
                    if (pokeStop.CooldownCompleteTimestampMs) {
                        var currentMs = TimeUtils.getCurrentTimestampMs();
                        if (pokeStop.CooldownCompleteTimestampMs > currentMs) {
                            pokeStop.Status |= PokeStopStatus.Visited;
                        }
                    }
                    if (pokeStop.LureInfo !== null) {
                        pokeStop.Status |= PokeStopStatus.Lure;
                    }
                    _this.addFortToList(pokeStop, _this.pokeStops);
                }
                else {
                    _this.addFortToList(forts[i], _this.gyms);
                }
            }
            _this.config.map.setPokeStops(_this.pokeStops);
            _this.config.map.setGyms(_this.gyms);
        };
        this.addFortToList = function (fort, fortList) {
            var index = _.findIndex(fortList, function (f) { return f.Id === fort.Id; });
            if (index === -1) {
                fortList.push(fort);
            }
            else {
                fort.Name = fortList[index].Name;
                fortList[index] = fort;
            }
        };
        this.onPokemonCapture = function (pokemonCapture) {
            if (_this.previousCaptureAttempts.length > 0 && _this.previousCaptureAttempts[0].Id !== pokemonCapture.Id) {
                _this.previousCaptureAttempts = [];
                if (_this.itemsUsedForCapture.length > 0) {
                    var lastUsed = _.last(_this.itemsUsedForCapture);
                    if (StaticInfo.berryIds.indexOf(lastUsed) === -1) {
                        _this.itemsUsedForCapture = [];
                    }
                }
            }
            _this.previousCaptureAttempts.push(pokemonCapture);
            _this.itemsUsedForCapture.push(pokemonCapture.Pokeball);
            if (pokemonCapture.Status === PokemonCatchStatus.Success) {
                _this.config.map.onPokemonCapture(pokemonCapture);
                _this.config.notificationManager.addNotificationPokemonCapture(_this.previousCaptureAttempts, _this.itemsUsedForCapture);
                _this.exp += pokemonCapture.Exp;
                _this.config.profileInfoManager.addExp(_this.exp, pokemonCapture.Exp);
            }
        };
        this.config = config;
        this.currentlySniping = false;
        this.previousCaptureAttempts = [];
        this.itemsUsedForCapture = [];
        this.exp = 0;
    }
    InterfaceHandler.prototype.onFortTarget = function (fortTarget) {
    };
    InterfaceHandler.prototype.onFortUsed = function (fortUsed) {
        var pokeStop = _.find(this.pokeStops, function (ps) { return ps.Id === fortUsed.Id; });
        pokeStop.Name = fortUsed.Name;
        this.config.map.usePokeStop(fortUsed);
        this.exp += fortUsed.Exp;
        this.config.notificationManager.addNotificationPokeStopUsed(fortUsed);
        this.config.profileInfoManager.addExp(this.exp, fortUsed.Exp);
    };
    InterfaceHandler.prototype.onProfile = function (profile) {
        this.config.mainMenuManager.updateProfileData(profile);
        this.config.profileInfoManager.setProfileData(profile);
    };
    InterfaceHandler.prototype.onUseBerry = function (berry) {
        var berryId = berry.BerryType || StaticInfo.berryIds[0];
        this.itemsUsedForCapture.push(berryId);
    };
    InterfaceHandler.prototype.onEvolveCount = function (evolveCount) {
    };
    InterfaceHandler.prototype.onPokemonEvolve = function (pokemonEvolve) {
        this.config.notificationManager.addNotificationPokemonEvolved(pokemonEvolve);
        this.exp += pokemonEvolve.Exp;
        this.config.profileInfoManager.addExp(this.exp, pokemonEvolve.Exp);
    };
    InterfaceHandler.prototype.onSnipeScan = function (snipeScan) {
    };
    InterfaceHandler.prototype.onSnipeMode = function (snipeMode) {
        this.currentlySniping = snipeMode.Active;
    };
    InterfaceHandler.prototype.onSnipeMessage = function (snipeMessage) {
    };
    InterfaceHandler.prototype.onUpdate = function (update) {
    };
    InterfaceHandler.prototype.onWarn = function (warn) {
    };
    InterfaceHandler.prototype.onEggHatched = function (eggHatched) {
        this.config.notificationManager.addNotificationEggHatched(eggHatched);
    };
    InterfaceHandler.prototype.onIncubatorStatus = function (incubatorStatus) {
        this.config.notificationManager.addNotificationIncubatorStatus(incubatorStatus);
    };
    InterfaceHandler.prototype.onItemRecycle = function (itemRecycle) {
        this.config.notificationManager.addNotificationItemRecycle(itemRecycle);
    };
    InterfaceHandler.prototype.onPokemonTransfer = function (pokemonTransfer) {
        this.config.notificationManager.addNotificationPokemonTransfer(pokemonTransfer);
    };
    InterfaceHandler.prototype.onPokemonList = function (pokemonList) {
        this.config.pokemonMenuManager.updatePokemonList(pokemonList);
    };
    InterfaceHandler.prototype.onPlayerStats = function (playerStats) {
        this.exp = playerStats.Experience;
        this.config.profileInfoManager.setPlayerStats(playerStats);
    };
    InterfaceHandler.prototype.onSendPokemonListRequest = function (request) {
        this.config.pokemonMenuManager.pokemonListRequested(request);
    };
    InterfaceHandler.prototype.onSendEggsListRequest = function (request) {
    };
    InterfaceHandler.prototype.onSendInventoryListRequest = function (request) {
    };
    InterfaceHandler.prototype.onSendPlayerStatsRequest = function (request) {
    };
    InterfaceHandler.prototype.onSendGetPokemonSettingsRequest = function (request) {
    };
    InterfaceHandler.prototype.onSendTransferPokemonRequest = function (request) {
    };
    InterfaceHandler.prototype.onSendEvolvePokemonRequest = function (request) {
    };
    return InterfaceHandler;
}());
var StaticInfo = (function () {
    function StaticInfo() {
    }
    StaticInfo.__ctor = (function () {
        var itemCodes = [];
        itemCodes[1] = "ItemPokeBall";
        itemCodes[2] = "ItemGreatBall";
        itemCodes[3] = "ItemUltraBall";
        itemCodes[4] = "ItemMasterBall";
        itemCodes[101] = "ItemPotion";
        itemCodes[102] = "ItemSuperPotion";
        itemCodes[103] = "ItemHyperPotion";
        itemCodes[104] = "ItemMaxPotion";
        itemCodes[201] = "ItemRevive";
        itemCodes[202] = "ItemMaxRevive";
        itemCodes[701] = "ItemRazzBerry";
        StaticInfo.itemCodes = itemCodes;
        var itemIds = [];
        itemIds["ItemPokeBall"] = 1;
        itemIds["ItemGreatBall"] = 2;
        itemIds["ItemUltraBall"] = 3;
        itemIds["ItemMasterBall"] = 4;
        itemIds["ItemPotion"] = 101;
        itemIds["ItemSuperPotion"] = 102;
        itemIds["ItemHyperPotion"] = 103;
        itemIds["ItemMaxPotion"] = 104;
        itemIds["ItemRevive"] = 201;
        itemIds["ItemMaxRevive"] = 202;
        itemIds["ItemRazzBerry"] = 701;
        StaticInfo.itemIds = itemIds;
        StaticInfo.berryIds = [701];
        var totalExpForLevel = [];
        totalExpForLevel[0] = -Infinity;
        totalExpForLevel[1] = 0;
        totalExpForLevel[2] = 1000;
        totalExpForLevel[3] = 3000;
        totalExpForLevel[4] = 6000;
        totalExpForLevel[5] = 10000;
        totalExpForLevel[6] = 15000;
        totalExpForLevel[7] = 21000;
        totalExpForLevel[8] = 28000;
        totalExpForLevel[9] = 36000;
        totalExpForLevel[10] = 45000;
        totalExpForLevel[11] = 55000;
        totalExpForLevel[12] = 65000;
        totalExpForLevel[13] = 75000;
        totalExpForLevel[14] = 85000;
        totalExpForLevel[15] = 100000;
        totalExpForLevel[16] = 120000;
        totalExpForLevel[17] = 140000;
        totalExpForLevel[18] = 160000;
        totalExpForLevel[19] = 185000;
        totalExpForLevel[20] = 210000;
        totalExpForLevel[21] = 260000;
        totalExpForLevel[22] = 335000;
        totalExpForLevel[23] = 435000;
        totalExpForLevel[24] = 560000;
        totalExpForLevel[25] = 710000;
        totalExpForLevel[26] = 900000;
        totalExpForLevel[27] = 1100000;
        totalExpForLevel[28] = 1350000;
        totalExpForLevel[29] = 1650000;
        totalExpForLevel[30] = 2000000;
        totalExpForLevel[31] = 2500000;
        totalExpForLevel[32] = 3000000;
        totalExpForLevel[33] = 3750000;
        totalExpForLevel[34] = 4750000;
        totalExpForLevel[35] = 6000000;
        totalExpForLevel[36] = 7500000;
        totalExpForLevel[37] = 9500000;
        totalExpForLevel[38] = 12000000;
        totalExpForLevel[39] = 15000000;
        totalExpForLevel[40] = 20000000;
        totalExpForLevel[41] = Infinity;
        StaticInfo.totalExpForLevel = totalExpForLevel;
        StaticInfo.expForLevel = [];
        for (var i = 1; i < totalExpForLevel.length; i++) {
            StaticInfo.expForLevel[i] = StaticInfo.totalExpForLevel[i] - StaticInfo.totalExpForLevel[i - 1];
        }
    })();
    return StaticInfo;
}());
var CaptureMarker = (function (_super) {
    __extends(CaptureMarker, _super);
    function CaptureMarker(latlng, map, args) {
        _super.call(this);
        this.latlng = latlng;
        this.args = args;
        this.setMap(map);
    }
    CaptureMarker.prototype.draw = function () {
        var div = this.div;
        if (!div) {
            div = this.div = document.createElement('div');
            var innerdiv = document.createElement('div');
            var d = $(div);
            var i = $(innerdiv);
            d.addClass('marker');
            d.css({
                'position': "absolute",
                'width': "60px",
                'height': "60px",
                'z-index': "99999"
            });
            if (this.args.PokemonId !== 'undefined')
                i.css({ 'background-image': "url(images/pokemon/" + this.args.PokemonId + ".png)" });
            i.css({
                'background-size': "contain",
                'background-position': "center center",
                'background-repeat': 'no-repeat',
                'width': "40px",
                'height': "40px",
                'border-radius': '20px',
                'margin': "5px"
            });
            d.append(i);
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        }
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
        if (point) {
            div.style.left = (point.x - 10) + 'px';
            div.style.top = (point.y - 20) + 'px';
        }
    };
    CaptureMarker.prototype.getPosition = function () {
        return this.latlng;
    };
    return CaptureMarker;
}(google.maps.OverlayView));
var GoogleMap = (function () {
    function GoogleMap(config) {
        var _this = this;
        this.locationHistory = [];
        this.pokestopMarkers = {};
        this.pokestopEvents = {};
        this.gymMarkers = {};
        this.gymEvents = {};
        this.capMarkers = [];
        this.movePlayer = function (position) {
            var posArr = [position.Latitude, position.Longitude];
            var pos = new google.maps.LatLng(posArr[0], posArr[1]);
            _this.playerMarker.setPosition(pos);
            if (_this.config.followPlayer)
                _this.map.setCenter(pos);
            _this.locationHistory.push({ lat: posArr[0], lng: posArr[1] });
            _this.locationLine = new google.maps.Polyline({
                path: _this.locationHistory,
                geodesic: true,
                strokeColor: '#00FFFF',
                strokeOpacity: 0.7,
                strokeWeight: 4
            });
            _this.locationLine.setMap(_this.map);
        };
        this.setPokeStops = function (pokeStops) {
            var incomingPokestops = {};
            _.each(pokeStops, function (stop) { incomingPokestops[stop.Id] = stop; });
            _.each(_this.pokestopEvents, function (stop) {
                if (!(stop.Id in incomingPokestops)) {
                    _this.pokestopMarkers[stop.Id].setMap(null);
                    delete _this.pokestopMarkers[stop.Id];
                    delete _this.pokestopEvents[stop.Id];
                }
            });
            _.each(incomingPokestops, function (stop) {
                if (!(stop.Id in _this.pokestopEvents)) {
                    _this.pokestopEvents[stop.Id] = stop;
                    _this.pokestopMarkers[stop.Id] = _this.createStopMarker(stop);
                }
            });
            _.each(pokeStops, function (pstop) {
                if (pstop.LastModifiedTimestampMs > _this.pokestopEvents[pstop.Id].LastModifiedTimestampMs) {
                    _this.pokestopMarkers[pstop.Id].setIcon(_this.getStopIconData(pstop.Status));
                    _this.pokestopEvents[pstop.Id] = pstop;
                }
            });
        };
        this.setGyms = function (gyms) {
            var incomingGyms = {};
            _.each(gyms, function (g) { incomingGyms[g.Id] = g; });
            _.each(_this.gymEvents, function (g) {
                if (!(g.Id in incomingGyms)) {
                    _this.pokestopMarkers[g.Id].setMap(null);
                    delete _this.gymMarkers[g.Id];
                    delete _this.gymEvents[g.Id];
                }
            });
            _.each(incomingGyms, function (g) {
                if (!(g.Id in _this.gymEvents)) {
                    _this.gymEvents[g.Id] = g;
                    _this.gymMarkers[g.Id] = _this.createGymMarker(g);
                }
            });
        };
        this.config = config;
        var mapStyle = [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#262c33" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }, { "color": "#949aa6" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": "0.00" }, { "visibility": "off" }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.country", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "administrative.locality", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": 30 }, { "color": "#323e4b" }, { "visibility": "on" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": "0" }, { "lightness": "0" }, { "gamma": "0.30" }, { "weight": "0.01" }, { "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": "100" }, { "saturation": -20 }, { "visibility": "simplified" }, { "color": "#293139" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }, { "color": "#282e36" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": "-100" }, { "lightness": "-100" }, { "gamma": "0.00" }, { "color": "#2a3037" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "labels.text", "stylers": [{ "visibility": "on" }, { "color": "#575e6b" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#424f61" }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "visibility": "simplified" }, { "color": "#2c3440" }] }, { "featureType": "transit.station.airport", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }, { "color": "#252a31" }] }];
        var mapOptions = {
            zoom: 18,
            center: new google.maps.LatLng(51.5073509, -0.12775829999998223),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyle,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        this.playerMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
            icon: {
                url: "images/markers/location.png",
                scaledSize: new google.maps.Size(50, 55)
            },
            zIndex: 300
        });
    }
    GoogleMap.prototype.usePokeStop = function (pokeStopUsed) {
        var setStatus = PokeStopStatus.Visited;
        if (this.pokestopEvents[pokeStopUsed.Id].Status === PokeStopStatus.Lure)
            setStatus = PokeStopStatus.VisitedLure;
        this.pokestopMarkers[pokeStopUsed.Id].setIcon(this.getStopIconData(setStatus));
        this.pokestopEvents[pokeStopUsed.Id].Status = setStatus;
    };
    GoogleMap.prototype.onPokemonCapture = function (pokemonCapture) {
        console.log(pokemonCapture);
        var captureMarker = new CaptureMarker(new google.maps.LatLng(pokemonCapture.Latitude, pokemonCapture.Longitude), this.map, {
            PokemonId: pokemonCapture.Id
        });
        this.capMarkers.push(captureMarker);
    };
    GoogleMap.prototype.createStopMarker = function (pstop) {
        var psMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(pstop.Latitude, pstop.Longitude),
            icon: this.getStopIconData(pstop.Status),
            zIndex: 100
        });
        return psMarker;
    };
    GoogleMap.prototype.getStopIconData = function (status) {
        var stopImage = "images/markers/";
        switch (status) {
            case PokeStopStatus.Normal:
                stopImage += "Normal.png";
                break;
            case PokeStopStatus.Lure:
                stopImage += "Lured.png";
                break;
            case PokeStopStatus.Visited:
                stopImage += "Visited.png";
                break;
            case PokeStopStatus.VisitedLure:
                stopImage += "VisitedLure.png";
                break;
            default:
                stopImage += "Normal.png";
                break;
        }
        return {
            url: stopImage,
            scaledSize: new google.maps.Size(50, 50)
        };
    };
    GoogleMap.prototype.createGymMarker = function (gym) {
        var gMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(gym.Latitude, gym.Longitude),
            icon: this.getGymIconData(gym),
            zIndex: 100
        });
        return gMarker;
    };
    GoogleMap.prototype.getGymIconData = function (gym) {
        var stopImage = "images/markers/";
        switch (gym.OwnedByTeam) {
            case PlayerTeam.Instinct:
                stopImage += "instinct.png";
                break;
            case PlayerTeam.Mystic:
                stopImage += "mystic.png";
                break;
            case PlayerTeam.Valor:
                stopImage += "valor.png";
                break;
            case PlayerTeam.Neutral:
                stopImage += "unoccupied.png";
                break;
            default:
                stopImage += "unoccupied.png";
                break;
        }
        return {
            url: stopImage,
            scaledSize: new google.maps.Size(50, 50)
        };
    };
    return GoogleMap;
}());
var LeafletMap = (function () {
    function LeafletMap(config) {
        var _this = this;
        this.movePlayer = function (position) {
            var posArr = [position.Latitude, position.Longitude];
            _this.playerMarker.setLatLng(posArr);
            _this.playerPath.addLatLng(posArr);
            if (_this.config.followPlayer) {
                _this.map.setView(posArr);
            }
        };
        this.setPokeStops = function (pokeStops) {
            _.each(_this.pokeStops, function (m) { return _this.map.removeLayer(m.LMarker); });
            _this.pokeStops = [];
            _.each(pokeStops, function (pokeStop) {
                var posArr = [pokeStop.Latitude, pokeStop.Longitude];
                var marker = new L.Marker(posArr, {
                    icon: _this.pokeStopIcons[pokeStop.Status]
                });
                _this.map.addLayer(marker);
                pokeStop.LMarker = marker;
                _this.pokeStops.push(pokeStop);
            });
        };
        this.setGyms = function (gyms) {
            _.each(_this.gyms, function (gym) { return _this.map.removeLayer(gym.LMarker); });
            _this.gyms = [];
            _.each(gyms, function (gym) {
                var posArr = [gym.Latitude, gym.Longitude];
                var marker = new L.Marker(posArr, {
                    icon: _this.gymIcons[gym.OwnedByTeam]
                });
                _this.map.addLayer(marker);
                gym.LMarker = marker;
                _this.gyms.push(gym);
            });
        };
        this.config = config;
        this.map = L.map("map", {
            zoomControl: false
        }).setView([0, 0], 16);
        var mainLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
        mainLayer.addTo(this.map);
        this.pokeStops = [];
        this.gyms = [];
        this.pokemons = [];
        this.playerPath = L.polyline([], {
            color: "cyan",
            opacity: 1
        });
        this.playerPath.addTo(this.map);
        this.playerMarker = L.marker([0, 0], {
            icon: new L.Icon({
                iconUrl: "images/markers/location.png",
                iconSize: [50, 55],
                iconAnchor: [25, 45]
            })
        });
        this.playerMarker.addTo(this.map);
        this.pokeStopIcons = [];
        this.pokeStopIcons[PokeStopStatus.Normal] = new L.Icon({
            iconUrl: "images/markers/Normal.png",
            iconSize: [48, 48]
        });
        this.pokeStopIcons[PokeStopStatus.Visited] = new L.Icon({
            iconUrl: "images/markers/Visited.png",
            iconSize: [48, 48]
        });
        this.pokeStopIcons[PokeStopStatus.Lure] = new L.Icon({
            iconUrl: "images/markers/Lured.png",
            iconSize: [48, 48]
        });
        this.pokeStopIcons[PokeStopStatus.VisitedLure] = new L.Icon({
            iconUrl: "images/markers/VisitedLure.png",
            iconSize: [48, 48]
        });
        this.gymIcons = [];
        this.gymIcons[PlayerTeam.Neutral] = new L.Icon({
            iconUrl: "images/markers/unoccupied.png",
            iconSize: [48, 48]
        });
        this.gymIcons[PlayerTeam.Mystic] = new L.Icon({
            iconUrl: "images/markers/mystic.png",
            iconSize: [48, 48]
        });
        this.gymIcons[PlayerTeam.Valor] = new L.Icon({
            iconUrl: "images/markers/valor.png",
            iconSize: [48, 48]
        });
        this.gymIcons[PlayerTeam.Instinct] = new L.Icon({
            iconUrl: "images/markers/instinct.png",
            iconSize: [48, 48]
        });
    }
    LeafletMap.prototype.usePokeStop = function (pokeStopUsed) {
        var pokeStop = _.find(this.pokeStops, function (ps) { return ps.Id === pokeStopUsed.Id; });
        var icon = pokeStop.LureInfo === null
            ? this.pokeStopIcons[PokeStopStatus.Visited]
            : this.pokeStopIcons[PokeStopStatus.VisitedLure];
        pokeStop.LMarker.setIcon(icon);
    };
    LeafletMap.prototype.onPokemonCapture = function (pokemonCapture) {
        var _this = this;
        var posArr = [pokemonCapture.Latitude, pokemonCapture.Longitude];
        var img = new Image();
        var imgUrl = "images/pokemon/" + pokemonCapture.Id + ".png";
        var maxWidth = 42;
        var maxHeight = 38;
        img.onload = function () {
            var widthScaleFactor = maxWidth / img.width;
            var heightScaleFactor = maxHeight / img.height;
            var scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
            if (scaleFactor > 1) {
                scaleFactor = 1;
            }
            var width = img.width * scaleFactor;
            var height = img.height * scaleFactor;
            var marker = new L.Marker(posArr, {
                icon: new L.Icon({
                    iconUrl: imgUrl,
                    iconSize: [width, height]
                })
            });
            _this.map.addLayer(marker);
            pokemonCapture.LMarker = marker;
            _this.pokemons.push(pokemonCapture);
        };
        img.src = imgUrl;
    };
    return LeafletMap;
}());
var MainMenuManager = (function () {
    function MainMenuManager(config) {
        var _this = this;
        this.onPokemonMenuClick = function (ev) {
            _this.config.requestSender.sendPokemonListRequest();
        };
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
    }
    MainMenuManager.prototype.updateProfileData = function (profile) {
    };
    return MainMenuManager;
}());
var PokemonMenuManager = (function () {
    function PokemonMenuManager(config) {
        var _this = this;
        this.pokemonListRequested = function (request) {
            _this.config.pokemonMenuElement.find(".spinner-overlay").show();
        };
        this.updatePokemonList = function (pokemonList) {
            _this.config.pokemonMenuElement.find(".pokemon").remove();
            _.each(pokemonList.Pokemons, function (pokemon) {
                var pokemonName = _this.config.translationManager.translation.pokemonNames[pokemon.PokemonId];
                var roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
                var html = "<div class=\"pokemon\">\n    <h1 class=\"name\">" + pokemonName + "</h1>\n    <div class=\"image-container\">\n        <img src=\"images/pokemon/" + pokemon.PokemonId + ".png\"/>\n    </div>\n    <h3 class=\"cp\">" + pokemon.Cp + "</h3>\n    <h3 class=\"iv\">" + roundedIv + "</h3>\n</div>";
                var pokemonElement = $(html);
                _this.config.pokemonMenuElement.append(pokemonElement);
            });
            _this.config.pokemonMenuElement.find(".spinner-overlay").hide();
        };
        this.config = config;
    }
    return PokemonMenuManager;
}());
var PokeStopStatus;
(function (PokeStopStatus) {
    PokeStopStatus[PokeStopStatus["Normal"] = 0] = "Normal";
    PokeStopStatus[PokeStopStatus["Visited"] = 1] = "Visited";
    PokeStopStatus[PokeStopStatus["Lure"] = 2] = "Lure";
    PokeStopStatus[PokeStopStatus["VisitedLure"] = 3] = "VisitedLure";
})(PokeStopStatus || (PokeStopStatus = {}));
var PokemonCatchStatus;
(function (PokemonCatchStatus) {
    PokemonCatchStatus[PokemonCatchStatus["Success"] = 1] = "Success";
    PokemonCatchStatus[PokemonCatchStatus["Escape"] = 2] = "Escape";
    PokemonCatchStatus[PokemonCatchStatus["Flee"] = 3] = "Flee";
})(PokemonCatchStatus || (PokemonCatchStatus = {}));
var PokemonEvolveResult;
(function (PokemonEvolveResult) {
    PokemonEvolveResult[PokemonEvolveResult["Unset"] = 0] = "Unset";
    PokemonEvolveResult[PokemonEvolveResult["Success"] = 1] = "Success";
    PokemonEvolveResult[PokemonEvolveResult["FailedPokemonMissing"] = 2] = "FailedPokemonMissing";
    PokemonEvolveResult[PokemonEvolveResult["FailedInsufficientResources"] = 3] = "FailedInsufficientResources";
    PokemonEvolveResult[PokemonEvolveResult["FailedPokemonCannotEvolve"] = 4] = "FailedPokemonCannotEvolve";
    PokemonEvolveResult[PokemonEvolveResult["FailedPokemonIsDeployed"] = 5] = "FailedPokemonIsDeployed";
})(PokemonEvolveResult || (PokemonEvolveResult = {}));
var PlayerTeam;
(function (PlayerTeam) {
    PlayerTeam[PlayerTeam["Neutral"] = 0] = "Neutral";
    PlayerTeam[PlayerTeam["Mystic"] = 1] = "Mystic";
    PlayerTeam[PlayerTeam["Valor"] = 2] = "Valor";
    PlayerTeam[PlayerTeam["Instinct"] = 3] = "Instinct";
})(PlayerTeam || (PlayerTeam = {}));
var NotificationManager = (function () {
    function NotificationManager(config) {
        var _this = this;
        this.clearAll = function (ev) {
            var allNotificationElements = _this.config.container.children(".event").get().reverse();
            var delay = 0;
            allNotificationElements.forEach(function (notification) {
                var notificationElement = $(notification);
                notificationElement.delay(delay).slideUp(300, function () {
                    notificationElement.remove();
                });
                delay += 50;
            });
            _this.notifications = [];
        };
        this.onUpdateTimerElapsed = function () {
            var currentTime = Date.now();
            _.each(_this.notifications, function (notification) {
                var diff = currentTime - notification.event.Timestamp;
                var diffStr = TimeUtils.timestampToDateStr(diff);
                var timestampElement = notification.element.find(".timestamp");
                timestampElement.text(diffStr + " ago");
            });
        };
        this.addNotificationPokeStopUsed = function (fortUsed) {
            var itemsHtml = "";
            _.each(fortUsed.ItemsList, function (item) {
                var itemId = StaticInfo.itemIds[item.Name];
                var itemName = _this.config.translationManager.translation.itemNames[itemId];
                itemsHtml += "<div class=\"item\" title=\"" + itemName + "\"><img src=\"images/items/" + itemId + ".png\"/>x" + item.Count + "</div>";
            });
            var html = "<div class=\"info\">\n                          " + itemsHtml + "\n                          <div class=\"stats\">+" + fortUsed.Exp + "XP</div>\n                      </div>";
            var inventoryFullStr = fortUsed.InventoryFull ? "<span class=inv-full>inventory full</span>" : "";
            var extendedInfoHtml = "\n" + inventoryFullStr + "\nName            <span class=\"name\"> " + fortUsed.Name + " </span><br/>\nGems            <span class=\"xp\"> " + fortUsed.Gems + " </span><br/>\n";
            _this.addNotification(fortUsed, html, "pokestop", extendedInfoHtml);
        };
        this.addNotificationPokemonCapture = function (pokemonCatches, itemsUsedForCapture) {
            var pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
            var pokemonName = _this.config.translationManager.translation.pokemonNames[pokemonCatch.Id];
            var roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
            var eventType = pokemonCatch.IsSnipe ? "snipe" : "catch";
            var html = "<div class=\"image\">\n                            <img src=\"images/pokemon/" + pokemonCatch.Id + ".png\"/>\n                        </div>\n                        <div class=\"info\">\n                            " + pokemonName + "\n                            <div class=\"stats\">CP " + pokemonCatch.Cp + " | IV " + roundedPerfection + "%</div>\n                        </div>";
            var itemsHtml = "";
            _.each(itemsUsedForCapture, function (i) { return itemsHtml += "<img src=\"images/items/" + i + ".png\">"; });
            var extendedInfoHtml = "\nUsed            <span class=\"attempts\">" + itemsHtml + "</span><br/>\nAttempts        <span class=\"attempts\">" + pokemonCatches.length + "</span><br/>\nProbability     <span class=\"probability\"> " + pokemonCatch.Probability + "% </span><br/>\nXP              <span class=\"xp\"> " + pokemonCatch.Exp + " </span><br/>\nCandies         <span class=\"candies\"> " + pokemonCatch.FamilyCandies + " </span><br/>\nCatch Type      <span class=\"catch-type\"> " + pokemonCatch.CatchType + " </span><br/>\nLevel           <span class=\"level\"> " + pokemonCatch.Level + " </span><br/>\nIV              <span class=\"level\"> " + roundedPerfection + " </span><br/>\nCP              <span class=\"cp\"> " + pokemonCatch.Cp + " </span>/<span class=\"max-cp\"> " + pokemonCatch.MaxCp + " </span><br/>\n";
            _this.addNotification(pokemonCatch, html, eventType, extendedInfoHtml);
        };
        this.addNotificationPokemonEvolved = function (pokemonEvolve) {
            var pokemonName = _this.config.translationManager.translation.pokemonNames[pokemonEvolve.Id];
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + pokemonEvolve.Id + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">+" + pokemonEvolve.Exp + "XP</div>\n                      </div>";
            _this.addNotification(pokemonEvolve, html, "evolve");
        };
        this.addNotificationEggHatched = function (eggHatched) {
            var pokemonName = _this.config.translationManager.translation.pokemonNames[eggHatched.PokemonId];
            var roundedPerfection = Math.round(eggHatched.Perfection * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + eggHatched.PokemonId + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">CP " + eggHatched.Cp + " | IV " + roundedPerfection + "%</div>\n                      </div>";
            _this.addNotification(eggHatched, html, "egg-hatched");
        };
        this.addNotificationIncubatorStatus = function (incubatorStatus) {
            var km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/items/ItemEgg.png\"/>\n                      </div>\n                      <div class=\"info\">Egg\n                          <div class=\"stats\">" + km + " of " + incubatorStatus.KmToWalk + "km</div>\n                      </div>";
            _this.addNotification(incubatorStatus, html, "incubator-status");
        };
        this.addNotificationItemRecycle = function (itemRecycle) {
            var itemName = _this.config.translationManager.translation.itemNames[itemRecycle.Id];
            var html = "<div class=\"info\" title=\"" + itemName + "\">\n                          <div class=\"item\"><img src=\"images/items/" + itemRecycle.Id + ".png\"/>x" + itemRecycle.Count + "</div>\n                          <div class=\"stats\">+" + itemRecycle.Count + " free space</div>\n                      </div>";
            _this.addNotification(itemRecycle, html, "recycle");
        };
        this.addNotificationPokemonTransfer = function (pokemonTransfer) {
            var pokemonName = _this.config.translationManager.translation.pokemonNames[pokemonTransfer.Id];
            var roundedPerfection = Math.round(pokemonTransfer.Perfection * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + pokemonTransfer.Id + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">CP " + pokemonTransfer.Cp + " | IV " + roundedPerfection + "%</div>\n                      </div>";
            _this.addNotification(pokemonTransfer, html, "transfer");
        };
        this.addNotification = function (event, innerHtml, eventType, extendedInfoHtml) {
            extendedInfoHtml = extendedInfoHtml || "";
            var eventTypeName = _this.config.translationManager.translation.eventTypes[eventType];
            var dateStr = moment().format("MMMM Do YYYY, HH:mm:ss");
            var html = "<div class=\"event " + eventType + "\">\n    <div class=\"item-container\">\n        <i class=\"fa fa-times dismiss\"></i>\n        " + innerHtml + "\n        <span class=\"event-type\">" + eventTypeName + "</span>\n        <span class=\"timestamp\">0 seconds ago</span>\n        <div class=\"category\"></div>\n    </div>\n    <div class=\"extended-info\">\n        Date <span class=\"extended-date\">" + dateStr + "</span><br/>\n        " + extendedInfoHtml + "\n    </div>\n</div>";
            var element = $(html);
            element.click(_this.toggleExtendedInfo);
            element.find(".dismiss").click(_this.closeNotification);
            var scroll = _this.isAtBottom();
            _this.config.container.append(element);
            _this.notifications.push({
                event: event,
                element: element
            });
            if (scroll) {
                _this.scrollToBottom();
            }
        };
        this.isAtBottom = function () {
            var scrollTop = _this.config.container.scrollTop();
            var innerHeight = _this.config.container.innerHeight();
            var scrollHeight = _this.config.container[0].scrollHeight;
            var atBottom = scrollTop + innerHeight === scrollHeight;
            return atBottom;
        };
        this.scrollToBottom = function () {
            var animation = {
                scrollTop: _this.config.container.prop("scrollHeight") - _this.config.container.height()
            };
            _this.config.container.animate(animation, 100);
        };
        this.toggleExtendedInfo = function (ev) {
            var notificationElement = $(ev.target).closest(".event");
            notificationElement.find(".extended-info").slideToggle(300);
        };
        this.closeNotification = function (ev) {
            var closeButton = $(ev.target);
            var element = closeButton.closest(".event");
            element.slideUp(300, function () {
                element.remove();
                _.remove(_this.notifications, function (n) { return n.element.is(element); });
            });
        };
        this.config = config;
        this.notifications = [];
        this.timeUpdaterInterval = setInterval(this.onUpdateTimerElapsed, 1000);
        this.config.clearAllButton.click(this.clearAll);
    }
    return NotificationManager;
}());
var ProfileInfoManager = (function () {
    function ProfileInfoManager(config) {
        var _this = this;
        this.setProfileData = function (profile) {
            _this.config.profileInfoElement.find(".profile-username").text(" " + profile.PlayerData.Username + " ");
            _this.config.profileInfoElement.find(".profile-pokecoin").text(profile.PlayerData.PokeCoin);
            _this.config.profileInfoElement.find(".profile-stardust").text(profile.PlayerData.StarDust);
        };
        this.setPlayerStats = function (playerStats) {
            _this.addExp(playerStats.Experience);
        };
        this.addExp = function (totalExp, expAdded) {
            var currentLevel = _this.calculateCurrentLevel(totalExp);
            var exp = totalExp - StaticInfo.totalExpForLevel[currentLevel];
            var expForNextLvl = StaticInfo.expForLevel[currentLevel + 1];
            var expPercent = 100 * exp / expForNextLvl;
            _this.config.profileInfoElement.find(".profile-lvl").text(" lvl " + currentLevel + " ");
            _this.animateTo(_this.config.profileInfoElement.find(".profile-exp-current"), exp);
            _this.animateTo(_this.config.profileInfoElement.find(".profile-exp-next"), expForNextLvl);
            _this.config.profileInfoElement.find(".current-xp").css("width", expPercent + "%");
            _this.config.profileInfoElement.find(".profile-exp-loading").remove();
            _this.config.profileInfoElement.find(".profile-exp-loaded").show();
            _this.config.profileInfoElement.find(".xp-progress").show();
            if (expAdded) {
                _this.expBubble(expAdded);
            }
        };
        this.expBubble = function (expAdded) {
            var bubbleHtml = "<div class=\"xp-bubble\">+" + expAdded + " XP</div>";
            var bubble = $(bubbleHtml);
            _this.config.profileInfoElement.find(".profile-exp").append(bubble);
            setTimeout(function () { bubble.remove(); }, 1000);
        };
        this.calculateCurrentLevel = function (totalExp) {
            for (var i = 0; i < StaticInfo.totalExpForLevel.length; i++) {
                if (StaticInfo.totalExpForLevel[i + 1] >= totalExp) {
                    return i;
                }
            }
            throw "Unable to determine level";
        };
        this.config = config;
    }
    ProfileInfoManager.prototype.animateTo = function (element, to) {
        element.prop("number", parseInt(element.text()));
        element.animateNumber({
            number: to
        });
    };
    return ProfileInfoManager;
}());
var EnglishTranslation = (function () {
    function EnglishTranslation() {
        this.pokemonNames = ["MissingNo", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew", "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia", "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth", "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur", "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass", "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle", "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt", "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish", "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet", "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol", "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky", "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke", "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup", "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna", "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola", "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad", "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny", "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka", "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty", "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen", "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino", "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe", "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus", "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo", "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent", "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao", "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom", "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling", "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo", "Pyroar", "Flabébé", "Floette", "Florges", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge", "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink", "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion"];
        this.itemNames = {
            1: "Pokeball",
            2: "Greatball",
            3: "Ultraball",
            4: "Masterball",
            101: "Potion",
            102: "Super Potion",
            103: "Hyper Potion",
            104: "Max Potion",
            201: "Revive",
            202: "Max Revive",
            701: "Razzberry"
        };
        this.eventTypes = {
            "pokestop": "pokéstop",
            "catch": "catch",
            "snipe": "snipe",
            "evolve": "evolve",
            "recycle": "recycle",
            "transfer": "transfer",
            "incubator-status": "incubator",
            "egg-hatched": "hatched"
        };
    }
    return EnglishTranslation;
}());
var GermanTranslation = (function () {
    function GermanTranslation() {
        this.pokemonNames = ["MissingNo", "Bisasam", "Bisaknosp", "Bisaflor", "Glumanda", "Glutexo", "Glurak", "Schiggy", "Schillok", "Turtok", "Raupy", "Safcon", "Smettbo", "Hornliu", "Kokuna", "Bibor", "Taubsi", "Tauboga", "Tauboss", "Rattfratz", "Rattikarl", "Habitak", "Ibitak", "Rettan", "Arbok", "Pikachu", "Raichu", "Sandan", "Sandamer", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Piepi", "Pixi", "Vulpix", "Vulnona", "Pummeluff", "Knuddeluff", "Zubat", "Golbat", "Myrapla", "Duflor", "Giflor", "Paras", "Parasek", "Bluzuk", "Omot", "Digda", "Digdri", "Mauzi", "Snobilikat", "Enton", "Entoron", "Menki", "Rasaff", "Fukano", "Arkani", "Quapsel", "Quaputzi", "Quappo", "Abra", "Kadabra", "Simsala", "Machollo", "Maschock", "Machomei", "Knofensa", "Ultrigaria", "Sarzenia", "Tentacha", "Tentoxa", "Kleinstein", "Georok", "Geowaz", "Ponita", "Gallopa", "Flegmon", "Lahmus", "Magnetilo", "Magneton", "Porenta", "Dodu", "Dodri", "Jurob", "Jugong", "Sleima", "Sleimok", "Muschas", "Austos", "Nebulak", "Alpollo", "Gengar", "Onix", "Traumato", "Hypno", "Krabby", "Kingler", "Voltobal", "Lektrobal", "Owei", "Kokowei", "Tragosso", "Knogga", "Kicklee", "Nockchan", "Schlurp", "Smogon", "Smogmog", "Rihorn", "Rizeros", "Chaneira", "Tangela", "Kangama", "Seeper", "Seemon", "Goldini", "Golking", "Sterndu", "Starmie", "Pantimos", "Sichlor", "Rossana", "Elektek", "Magmar", "Pinsir", "Tauros", "Karpador", "Garados", "Lapras", "Ditto", "Evoli", "Aquana", "Blitza", "Flamara", "Porygon", "Amonitas", "Amoroso", "Kabuto", "Kabutops", "Aerodactyl", "Relaxo", "Arktos", "Zapdos", "Lavados", "Dratini", "Dragonir", "Dragoran", "Mewtu", "Mew",
            "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia", "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth", "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur", "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass", "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle", "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt", "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish", "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet", "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol", "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky", "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke", "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup", "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna", "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola", "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad", "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny", "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka", "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty", "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen", "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino", "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe", "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus", "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo", "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent", "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao", "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom", "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling", "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo", "Pyroar", "Flabébé", "Floette", "Florges", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge", "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink", "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion"];
        this.itemNames = {
            1: "Pokéball",
            2: "Superball",
            3: "Hyperball",
            4: "Meisterball",
            101: "Tränk",
            102: "Supertränk",
            103: "Hypertränk",
            104: "Top-Tränk",
            201: "Beleber",
            202: "Top Beleber",
            701: "Himmihbeere"
        };
        this.eventTypes = {
            "pokestop": "pokéstop",
            "catch": "gefangen",
            "snipe": "snipe",
            "evolve": "Entwickelt",
            "recycle": "weggeworfen",
            "transfer": "verschickt",
            "incubator-status": "Inkubator",
            "egg-hatched": "Geschlüpft"
        };
    }
    return GermanTranslation;
}());
var Language;
(function (Language) {
    Language[Language["English"] = 0] = "English";
    Language[Language["German"] = 1] = "German";
})(Language || (Language = {}));
var TranslationManager = (function () {
    function TranslationManager(language) {
        var _this = this;
        if (language === void 0) { language = Language.English; }
        this.getCurrentLanguage = function () { return _this.currentLanguage; };
        this.setCurrentLanguage = function (language) {
            _this.currentLanguage = language;
            switch (language) {
                case Language.English:
                    _this.translation = new EnglishTranslation();
                    break;
                case Language.German:
                    _this.translation = new GermanTranslation();
                    break;
                default:
                    throw "Unknown language";
            }
        };
        this.setCurrentLanguage(language);
    }
    return TranslationManager;
}());
var TimeUtils = (function () {
    function TimeUtils() {
    }
    TimeUtils.getCurrentTimestampMs = function () {
        var timeStamp = Date.now();
        return timeStamp.toString();
    };
    TimeUtils.timestampToDateStr = function (timestamp) {
        var totalSeconds = Math.floor(timestamp / 1000);
        var totalMinutes = Math.floor(totalSeconds / 60);
        var totalHours = Math.floor(totalMinutes / 60);
        var totalDays = Math.floor(totalHours / 24);
        var dateStr;
        if (totalDays > 0) {
            dateStr = totalDays + " day";
            if (totalDays > 1) {
                dateStr += "s";
            }
        }
        else if (totalHours > 0) {
            dateStr = totalHours + " hour";
            if (totalHours > 1) {
                dateStr += "s";
            }
        }
        else if (totalMinutes > 0) {
            dateStr = totalMinutes + " minute";
            if (totalMinutes > 1) {
                dateStr += "s";
            }
        }
        else {
            dateStr = totalSeconds + " second";
            if (totalSeconds > 1) {
                dateStr += "s";
            }
        }
        return dateStr;
    };
    return TimeUtils;
}());
$(function () {
    var client = new BotWSClient("ws://127.0.0.1:14252");
    var translationManager = new TranslationManager();
    var notificationManager = new NotificationManager({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        translationManager: translationManager
    });
    var mainMenuManager = new MainMenuManager({
        requestSender: client,
        mainMenuElement: $("#menu")
    });
    var pokemonMenuManager = new PokemonMenuManager({
        translationManager: translationManager,
        pokemonMenuElement: $('body.live-version .content[data-category="pokemons"]')
    });
    var profileInfoManager = new ProfileInfoManager({
        profileInfoElement: $("#profile")
    });
    var lMap = new LeafletMap({
        followPlayer: true,
        translationManager: translationManager
    });
    var interfaceHandler = new InterfaceHandler({
        translationManager: translationManager,
        notificationManager: notificationManager,
        mainMenuManager: mainMenuManager,
        pokemonMenuManager: pokemonMenuManager,
        profileInfoManager: profileInfoManager,
        map: lMap
    });
    client.start({
        eventHandlers: [interfaceHandler]
    });
});
//# sourceMappingURL=script.js.map