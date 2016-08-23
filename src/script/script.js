var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MainMenuController = (function () {
    function MainMenuController(config) {
        var _this = this;
        this.onPokemonMenuClick = function (ev) {
            _this.config.requestSender.sendPokemonListRequest();
        };
        this.onItemsMenuClick = function (ev) {
            _this.config.requestSender.sendInventoryListRequest();
        };
        this.onEggsMenuClick = function (ev) {
            if (_this.config.requestSender.currentBotFamily === BotFamily.Necro) {
                _this.config.requestSender.sendPlayerStatsRequest();
            }
            _this.config.requestSender.sendEggsListRequest();
        };
        this.updateProfileData = function (profile) {
            _this.config.mainMenuElement.find("#pokemons .total").text(profile.PlayerData.MaxPokemonStorage);
            _this.config.mainMenuElement.find("#items .total").text(profile.PlayerData.MaxItemStorage);
        };
        this.setPokemonCount = function (pokemonCount) {
            _this.config.mainMenuElement.find("#pokemons .current").text(pokemonCount);
        };
        this.setItemCount = function (itemCount) {
            _this.config.mainMenuElement.find("#items .current").text(itemCount);
        };
        this.setEggCount = function (eggCount) {
            _this.config.mainMenuElement.find("#eggs .current").text(eggCount);
        };
        this.config = config;
        this.config.mainMenuElement.find("#pokemons").click(this.onPokemonMenuClick);
        this.config.mainMenuElement.find("#items").click(this.onItemsMenuClick);
        this.config.mainMenuElement.find("#eggs").click(this.onEggsMenuClick);
    }
    return MainMenuController;
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
                'margin': "5px"
            });
            d.append(i);
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        }
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
        if (point) {
            div.style.left = (point.x - 30) + 'px';
            div.style.top = (point.y - 30) + 'px';
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
        this.pokestops = {};
        this.gyms = {};
        this.capMarkers = [];
        this.movePlayer = function (position) {
            var posArr = [position.Latitude, position.Longitude];
            var pos = new google.maps.LatLng(posArr[0], posArr[1]);
            _this.playerMarker.setPosition(pos);
            if (_this.config.followPlayer) {
                var from = { lat: _this.map.getCenter().lat(), lng: _this.map.getCenter().lng() };
                var to = { lat: posArr[0], lng: posArr[1] };
                var currentMap_1 = _this.map;
                $(from).animate(to, {
                    duration: 200,
                    step: function (cs, t) {
                        var newPos;
                        switch (t.prop) {
                            case "lat":
                                newPos = new google.maps.LatLng(cs, currentMap_1.getCenter().lng());
                                break;
                            case "lng":
                                newPos = new google.maps.LatLng(currentMap_1.getCenter().lat(), cs);
                                break;
                            default:
                                throw "Unknown t.prop";
                        }
                        currentMap_1.setCenter(newPos);
                    }
                });
            }
            _this.locationHistory.push({ lat: posArr[0], lng: posArr[1] });
            if (_this.locationLine != null)
                _this.locationLine.setMap(null);
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
            _.each(_this.pokestops, function (stop) {
                var stopId = stop.event.Id;
                if (!(stopId in incomingPokestops)) {
                    stop.marker.setMap(null);
                    delete stop.event;
                    delete stop.marker;
                    delete stop.infoWindow;
                    delete _this.pokestops[stopId];
                }
            });
            _.each(incomingPokestops, function (stop) {
                var stopId = stop.Id;
                var currentEvents = _.mapValues(_this.pokestops, function (ps) { return ps.event; });
                if (!(stopId in currentEvents)) {
                    var marker = _this.createStopMarker(stop);
                    var infoWindow = _this.createStopInfoWindow(stop, marker);
                    _this.pokestops[stopId] = {
                        event: stop,
                        marker: marker,
                        infoWindow: infoWindow
                    };
                }
            });
            _.each(pokeStops, function (pstop) {
                var isModified = pstop.LastModifiedTimestampMs > _this.pokestops[pstop.Id].event.LastModifiedTimestampMs;
                var isDifferentStatus = pstop.Status != _this.pokestops[pstop.Id].event.Status;
                if (isModified || isDifferentStatus) {
                    _this.pokestops[pstop.Id].marker.setIcon(_this.getStopIconData(pstop.Status));
                    _this.pokestops[pstop.Id].event = pstop;
                }
            });
        };
        this.setGyms = function (gyms) {
            var incomingGyms = {};
            _.each(gyms, function (g) { incomingGyms[g.Id] = g; });
            _.each(_this.gyms, function (g) {
                var gymId = g.event.Id;
                if (!(gymId in incomingGyms)) {
                    g.marker.setMap(null);
                    delete g.marker;
                    delete g.infoWindow;
                    delete g.event;
                    delete _this.gyms[gymId];
                }
            });
            var currentGymEvents = _.mapValues(_this.gyms, function (g) { return g.event; });
            _.each(incomingGyms, function (g) {
                var gymId = g.Id;
                if ((gymId in currentGymEvents) && _this.gyms[gymId].event.OwnedByTeam !== g.OwnedByTeam) {
                    _this.gyms[gymId].marker.setMap(null);
                    delete _this.gyms[gymId].marker;
                    delete _this.gyms[gymId].infoWindow;
                    delete _this.gyms[gymId].event;
                    delete _this.gyms[gymId];
                }
                currentGymEvents = _.mapValues(_this.gyms, function (gym) { return gym.event; });
                if (!(g.Id in currentGymEvents)) {
                    var marker = _this.createGymMarker(g);
                    var infoWindow = _this.createGymInfoWindow(g, marker);
                    _this.gyms[g.Id] = {
                        event: g,
                        marker: marker,
                        infoWindow: infoWindow
                    };
                }
            });
        };
        this.createStopMarker = function (pstop) {
            var psMarker = new google.maps.Marker({
                map: _this.map,
                position: new google.maps.LatLng(pstop.Latitude, pstop.Longitude),
                icon: _this.getStopIconData(pstop.Status),
                zIndex: 100
            });
            return psMarker;
        };
        this.getStopInfoWindowContent = function (pstop) {
            var pstopName = pstop.Name || "Unknown";
            var template = _this.config.infoWindowTemplate.clone();
            var wrap = template.find(".iw-wrap");
            var status = wrap.find(".iw-status");
            var icon = wrap.find(".iw-icon");
            wrap.addClass("iw-pokestop");
            switch (pstop.Status) {
                case PokeStopStatus.Normal:
                    icon.attr("src", "images/gui/pokestop.png");
                    status.text("ready");
                    break;
                case PokeStopStatus.Visited:
                    icon.attr("src", "images/gui/visited-pokestop.png");
                    status.text("visited");
                    wrap.addClass("iw-pokestop-visited");
                    break;
                case PokeStopStatus.Lure:
                    icon.attr("src", "images/gui/lured-pokestop.png");
                    status.text("ready");
                    wrap.addClass("iw-pokestop-lure");
                    break;
                case PokeStopStatus.VisitedLure:
                    icon.attr("src", "images/gui/lured-visited-pokestop.png");
                    status.text("visited");
                    wrap.addClass("iw-pokestop-visited");
                    wrap.addClass("iw-pokestop-lure");
                    break;
            }
            var roundedLat = Math.round(pstop.Latitude * 10000000) / 10000000;
            var roundedLng = Math.round(pstop.Longitude * 10000000) / 10000000;
            wrap.find(".iw-name .iw-detail-header").text("Pokestop");
            wrap.find(".iw-name .iw-detail-value").text(pstopName);
            wrap.find(".iw-latitude .iw-detail-value").text(roundedLat);
            wrap.find(".iw-longitude .iw-detail-value").text(roundedLng);
            return template;
        };
        this.createStopInfoWindow = function (pstop, marker) {
            var content = _this.getStopInfoWindowContent(pstop);
            var html = content.html();
            var infoWindow = new google.maps.InfoWindow({
                content: html
            });
            marker.addListener("click", function () {
                infoWindow.open(_this.map, marker);
                window.setIwStyles();
            });
            return infoWindow;
        };
        this.getGymInfoWindowContent = function (gym) {
            var gymName = gym.Name || "Unknown";
            var template = _this.config.infoWindowTemplate.clone();
            var wrap = template.find(".iw-wrap");
            var status = wrap.find(".iw-status");
            var icon = wrap.find(".iw-icon");
            var emblem = wrap.find(".iw-gym-team-emblem");
            emblem.show();
            wrap.addClass("iw-gym");
            switch (gym.OwnedByTeam) {
                case PlayerTeam.Neutral:
                    status.text("neutral");
                    icon.attr("src", "images/gui/unoccupied-icon.png");
                    emblem.attr("src", "images/gui/unoccupied.png");
                    wrap.addClass("iw-gym-neutral");
                    break;
                case PlayerTeam.Instinct:
                    status.text("instinct");
                    wrap.addClass("iw-gym-instinct");
                    icon.attr("src", "images/gui/instinct-icon.png");
                    emblem.attr("src", "images/gui/instinct.png");
                    break;
                case PlayerTeam.Mystic:
                    status.text("mystic");
                    wrap.addClass("iw-gym-mystic");
                    icon.attr("src", "images/gui/mystic-icon.png");
                    emblem.attr("src", "images/gui/mystic.png");
                    break;
                case PlayerTeam.Valor:
                    status.text("valor");
                    wrap.addClass("iw-gym-valor");
                    icon.attr("src", "images/gui/valor-icon.png");
                    emblem.attr("src", "images/gui/valor.png");
                    break;
            }
            var roundedLat = Math.round(gym.Latitude * 10000000) / 10000000;
            var roundedLng = Math.round(gym.Longitude * 10000000) / 10000000;
            var gymExp = parseInt(gym.GymPoints);
            var gymLevel = StaticInfo.calculateCurrentGymLevel(gymExp);
            var nextGymLevelRequired = StaticInfo.totalExpForGymLevel[gymLevel + 1];
            wrap.find(".iw-name .iw-detail-header").text("Gym");
            wrap.find(".iw-name .iw-detail-value").text(gymName);
            wrap.find(".iw-gym-level").show();
            wrap.find(".iw-gym-xp").show();
            wrap.find(".iw-gym-hr-general").show();
            wrap.find(".iw-gym-level .iw-detail-value").text(gymLevel);
            wrap.find(".iw-gym-xp .iw-detail-value").text(gymExp + " / " + nextGymLevelRequired);
            wrap.find(".iw-latitude .iw-detail-value").text(roundedLat);
            wrap.find(".iw-longitude .iw-detail-value").text(roundedLng);
            if (gym.OwnedByTeam !== PlayerTeam.Neutral) {
                wrap.find(".iw-gym-defender").show();
                wrap.find(".iw-gym-defender-cp").show();
                wrap.find(".iw-gym-hr-defender").show();
                wrap.find(".iw-gym-defender-icon").attr("src", "images/pokemon/" + gym.GuardPokemonId + ".png");
                var pokemonName = _this.config.translationController.translation.pokemonNames[gym.GuardPokemonId];
                wrap.find(".iw-gym-defender-name").text(pokemonName);
                wrap.find(".iw-gym-defender-cp .iw-detail-value").text(gym.GuardPokemonCp);
            }
            return template;
        };
        this.createGymInfoWindow = function (gym, marker) {
            var content = _this.getGymInfoWindowContent(gym);
            var html = content.html();
            var infoWindow = new google.maps.InfoWindow({
                content: html
            });
            marker.addListener("click", function () {
                infoWindow.open(_this.map, marker);
                window.setIwStyles();
            });
            return infoWindow;
        };
        this.config = config;
        var mapStyle = [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#293037"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "gamma": 0.01
                    },
                    {
                        "lightness": 20
                    },
                    {
                        "color": "#949aa6"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "saturation": -31
                    },
                    {
                        "lightness": -33
                    },
                    {
                        "weight": 2
                    },
                    {
                        "gamma": "0.00"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 30
                    },
                    {
                        "saturation": 30
                    },
                    {
                        "color": "#344150"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": "0"
                    },
                    {
                        "lightness": "0"
                    },
                    {
                        "gamma": "0.30"
                    },
                    {
                        "weight": "0.01"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": "100"
                    },
                    {
                        "saturation": -20
                    },
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#344150"
                    },
                    {
                        "gamma": "0.92"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 10
                    },
                    {
                        "saturation": -30
                    },
                    {
                        "color": "#28323f"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": "-100"
                    },
                    {
                        "lightness": "-100"
                    },
                    {
                        "gamma": "0.00"
                    },
                    {
                        "color": "#282f38"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#575e6b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#232c37"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#222935"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": -20
                    },
                    {
                        "color": "#212a35"
                    }
                ]
            }
        ];
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyle,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
        };
        var mapElement = this.config.mapElement.get(0);
        this.map = new google.maps.Map(mapElement, mapOptions);
        this.playerMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
            icon: {
                url: "images/markers/location.png",
                scaledSize: new google.maps.Size(50, 55),
                anchor: new google.maps.Point(25, 45)
            },
            zIndex: 300
        });
    }
    GoogleMap.prototype.targetFort = function (target) {
    };
    GoogleMap.prototype.usePokeStop = function (pokeStopUsed) {
        var setStatus = PokeStopStatus.Visited;
        var stopId = pokeStopUsed.Id;
        var pStop = this.pokestops[stopId];
        pStop.event.Name = pokeStopUsed.Name;
        if (pStop.event.Status === PokeStopStatus.Lure) {
            setStatus = PokeStopStatus.VisitedLure;
        }
        pStop.event.Status = setStatus;
        pStop.marker.setIcon(this.getStopIconData(setStatus));
        var newContent = this.getStopInfoWindowContent(pStop.event);
        var newContentHtml = newContent.html();
        pStop.infoWindow.setContent(newContentHtml);
    };
    GoogleMap.prototype.onPokemonCapture = function (pokemonCapture) {
        console.log(pokemonCapture);
        var captureMarker = new CaptureMarker(new google.maps.LatLng(pokemonCapture.Latitude, pokemonCapture.Longitude), this.map, {
            PokemonId: pokemonCapture.Id
        });
        this.capMarkers.push(captureMarker);
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
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
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
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
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
        this.map = L.map(this.config.mapElement.get(0), {
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
    LeafletMap.prototype.targetFort = function (target) {
    };
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
var MapProvider;
(function (MapProvider) {
    MapProvider[MapProvider["GMaps"] = 0] = "GMaps";
    MapProvider[MapProvider["OSM"] = 1] = "OSM";
})(MapProvider || (MapProvider = {}));
var EggMenuController = (function () {
    function EggMenuController(config) {
        var _this = this;
        this.eggListRequested = function (request) {
            _this.config.eggLoadingSpinner.show();
        };
        this.updateEggList = function (eggList, currentTotalKmWalked) {
            _this.config.eggMenuElement.find(".egg").remove();
            for (var i = 0; i < eggList.Incubators.length; i++) {
                var incubator = eggList.Incubators[i];
                if (!incubator.PokemonId || incubator.PokemonId === "0") {
                    continue;
                }
                var totalKmWalked = eggList.PlayerKmWalked || currentTotalKmWalked;
                var eggKm = Math.round(incubator.TargetKmWalked - incubator.StartKmWalked);
                var eggKmRounded = eggKm.toFixed(1);
                var kmWalked = totalKmWalked - incubator.StartKmWalked;
                var kmWalkedRounded = (Math.round(kmWalked * 10) / 10).toFixed(1);
                var progress = kmWalked / eggKm;
                var html = "\n<div class=\"egg incubated-egg\">\n    <div class=\"incubator\"><img src=\"images/items/" + incubator.ItemId + ".png\"/></div>\n    <p> <b> " + kmWalkedRounded + " </b> / <i> " + eggKmRounded + " </i> km</p>\n    <div class=\"circle\"></div>\n</div>";
                var incubatorElement = $(html);
                _this.config.eggMenuElement.append(incubatorElement);
                var previous = _this.previousProgress[incubator.PokemonId];
                var hasPrevious = typeof previous === "number";
                var options = {
                    value: hasPrevious ? previous : progress,
                    size: 180,
                    thickness: 5,
                    startAngle: -Math.PI / 2,
                    fill: {
                        gradient: ["#b1ffaa", "#64f0d0"]
                    },
                    emptyFill: "rgba(0, 0, 0, 0)"
                };
                if (hasPrevious) {
                    options.animation = { duration: 0 };
                }
                incubatorElement.find(".circle").circleProgress(options);
                if (hasPrevious) {
                    delete options.animation;
                    options.value = progress;
                    incubatorElement.find(".circle").circleProgress(options);
                }
                _this.previousProgress[incubator.PokemonId] = progress;
            }
            for (var i = 0; i < eggList.UnusedEggs.length; i++) {
                var egg = eggList.UnusedEggs[i];
                var eggKmRounded = egg.EggKmWalkedTarget.toFixed(1);
                var html = "\n<div class=\"egg\">\n    <div class=\"incubator\"><img src=\"images/items/0.png\"/></div>\n    <p> <i> " + eggKmRounded + " </i> km</p>\n    <div class=\"circle\"></div>\n</div>";
                var eggElement = $(html);
                _this.config.eggMenuElement.append(eggElement);
            }
            _this.config.eggLoadingSpinner.fadeOut(150);
        };
        this.config = config;
        this.previousProgress = [];
    }
    return EggMenuController;
}());
var InventoryMenuController = (function () {
    function InventoryMenuController(config) {
        var _this = this;
        this.inventoryListRequested = function (request) {
            _this.config.inventoryLoadingSpinner.show();
        };
        this.updateInventoryList = function (inventoryList) {
            var currentItems = _this.config.inventoryMenuElement.find(".product");
            currentItems.removeClass("brighter");
            currentItems.find(".number").text(0);
            for (var i = 0; i < inventoryList.Items.length; i++) {
                var item = inventoryList.Items[i];
                var itemElement = _this.config.inventoryMenuElement.find(".product[data-item-id=\"" + item.ItemId + "\"]");
                itemElement.addClass("brighter");
                itemElement.find(".number").text(item.Count);
            }
            _this.config.inventoryLoadingSpinner.fadeOut(150);
        };
        this.config = config;
    }
    return InventoryMenuController;
}());
var PokemonMenuController = (function () {
    function PokemonMenuController(config) {
        var _this = this;
        this.pokemonListRequested = function (request) {
            _this.config.pokemonLoadingSpinner.show();
        };
        this.updatePokemonList = function (pokemonList) {
            _this.config.pokemonMenuElement.find(".pokemon").remove();
            _this.pokemonList = pokemonList;
            _this.updatePokemonListInner();
        };
        this.updatePokemonListInner = function () {
            var pokemons;
            switch (_this.currentOrdering) {
                case PokemonOrdering.Date:
                    pokemons = _.orderBy(_this.pokemonList.Pokemons, function (p) { return p.CreationTimeMs; }).reverse();
                    break;
                case PokemonOrdering.Cp:
                    pokemons = _.orderBy(_this.pokemonList.Pokemons, function (p) { return p.Cp; }).reverse();
                    break;
                case PokemonOrdering.Iv:
                    pokemons = _.orderBy(_this.pokemonList.Pokemons, function (p) { return p.Perfection; }).reverse();
                    break;
                case PokemonOrdering.Number:
                    pokemons = _.orderBy(_this.pokemonList.Pokemons, function (p) { return p.PokemonId; });
                    break;
                case PokemonOrdering.Name:
                    pokemons = _.orderBy(_this.pokemonList.Pokemons, function (p) {
                        var pokemonName = _this.config.translationController.translation.pokemonNames[p.PokemonId];
                        return pokemonName;
                    });
                    break;
                default:
                    pokemons = _this.pokemonList.Pokemons;
            }
            for (var i = 0; i < pokemons.length; i++) {
                var pokemon = pokemons[i];
                var pokemonName = _this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
                var roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
                var html = "<div class=\"pokemon\">\n    <h1 class=\"name\">" + pokemonName + "</h1>\n    <div class=\"image-container\">\n        <img src=\"images/pokemon/" + pokemon.PokemonId + ".png\"/>\n    </div>\n    <h3 class=\"cp\">" + pokemon.Cp + "</h3>\n    <h3 class=\"iv\">" + roundedIv + "</h3>\n</div>";
                var pokemonElement = $(html);
                pokemonElement.prop("pokemon-index", i);
                pokemonElement.click(_this.pokemonClick);
                _this.config.pokemonMenuElement.append(pokemonElement);
            }
            _this.config.pokemonLoadingSpinner.fadeOut(150);
        };
        this.pokemonClick = function (ev) {
            var pokemonBox = $(ev.target).closest(".pokemon");
            var pokemonIndex = pokemonBox.prop("pokemon-index");
            var pokemon = _this.pokemonList.Pokemons[pokemonIndex];
            _this.currentPokemon = pokemon;
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemon.PokemonId];
            var roundedIv = Math.floor(pokemon.Perfection * 100) / 100;
            var evolveButton = _this.config.pokemonDetailsElement.find("#evolve-pokemon-button");
            if (StaticInfo.pokemonInfo[pokemon.PokemonId].evolvesInto.length === 0) {
                evolveButton.hide();
            }
            else {
                evolveButton.show();
            }
            _this.config.pokemonDetailsElement.find("#pokemon-info-name").text(pokemonName);
            _this.config.pokemonDetailsElement.find("#pokemon-info-image").attr("src", "images/pokemon/" + pokemon.PokemonId + ".png");
            _this.config.pokemonDetailsElement.find(".attack").text(pokemon.IndividualAttack);
            _this.config.pokemonDetailsElement.find(".defense").text(pokemon.IndividualDefense);
            _this.config.pokemonDetailsElement.find(".stamina").text(pokemon.IndividualStamina);
            _this.config.pokemonDetailsElement.find(".total-iv").text(roundedIv + "%");
            _this.config.pokemonDetailsElement.find(".poke-cp").text("" + pokemon.Cp);
            _this.config.pokemonDetailsElement.find(".pkm-candies").text("" + pokemon.FamilyCandies);
            var move1Name = StaticInfo.moveInfo[pokemon.Move1] ? StaticInfo.moveInfo[pokemon.Move1].name : "Unknown move";
            var move2Name = StaticInfo.moveInfo[pokemon.Move2] ? StaticInfo.moveInfo[pokemon.Move2].name : "Unknown move";
            var pokemonInfo = StaticInfo.pokemonInfo[pokemon.PokemonId];
            var elementElement = _this.config.pokemonDetailsElement.find("#pokemon-type");
            elementElement.html("");
            for (var i = 0; i < pokemonInfo.elements.length; i++) {
                var elementStr = PokeElement[pokemonInfo.elements[i]].toLowerCase();
                var elementHtml = "<span class=\"" + elementStr + "\">" + elementStr + "</span>";
                var el = $(elementHtml);
                elementElement.append(el);
            }
            _this.config.pokemonDetailsElement.find(".move1").text(move1Name);
            _this.config.pokemonDetailsElement.find(".move2").text(move2Name);
            _this.config.pokemonMenuElement.closest("#content-wrap").addClass("blurred");
            _this.config.pokemonDetailsElement.fadeIn();
        };
        this.transferPokemon = function (ev) {
            var pokemonUniqueId = _this.currentPokemon.Id;
            _this.config.requestSender.sendTransferPokemonRequest(pokemonUniqueId);
        };
        this.evolvePokemon = function (ev) {
            var pokemonUniqueId = _this.currentPokemon.Id;
            _this.config.requestSender.sendEvolvePokemonRequest(pokemonUniqueId);
        };
        this.config = config;
        this.config.pokemonDetailsElement.find("#confirm-transfer").click(this.transferPokemon);
        this.config.pokemonDetailsElement.find("#confirm-evolve").click(this.evolvePokemon);
        this.currentOrdering = PokemonOrdering.Cp;
    }
    return PokemonMenuController;
}());
var PokemonOrdering;
(function (PokemonOrdering) {
    PokemonOrdering[PokemonOrdering["Date"] = 0] = "Date";
    PokemonOrdering[PokemonOrdering["Cp"] = 1] = "Cp";
    PokemonOrdering[PokemonOrdering["Iv"] = 2] = "Iv";
    PokemonOrdering[PokemonOrdering["Number"] = 3] = "Number";
    PokemonOrdering[PokemonOrdering["Name"] = 4] = "Name";
})(PokemonOrdering || (PokemonOrdering = {}));
var SettingsMenuController = (function () {
    function SettingsMenuController(config) {
        var _this = this;
        this.inputChanged = function (ev) {
            var currentSettings = _this.config.settingsService.settings;
            var changedSettings = _this.getSettings();
            _this.enableDisableButtons(currentSettings, changedSettings);
            _this.updateConnectionStr(changedSettings);
        };
        this.updateConnectionStr = function (settings) {
            var connStr = _this.buildConnectionString(settings.clientAddress, settings.clientPort, settings.clientUseSSL);
            _this.config.settingsMenuElement.find(".settings-client-connection-string").text(connStr);
        };
        this.buildConnectionString = function (address, port, useSSL) {
            var protocol = useSSL ? "wss" : "ws";
            return protocol + "://" + address + ":" + port;
        };
        this.enableDisableButtons = function (currentSettings, changedSettings) {
            var areEqual = _this.config.settingsService.settingsEqual(currentSettings, changedSettings);
            if (areEqual) {
                _this.config.settingsButtonsElement.addClass("disabled");
            }
            else {
                _this.config.settingsButtonsElement.removeClass("disabled");
            }
        };
        this.setSettings = function (settings) {
            _this.updateConnectionStr(settings);
            _this.settingsElements.mapProvider.filter("[value='" + settings.mapProvider + "']").prop("checked", true);
            _this.setToggleSetting(_this.settingsElements.mapFolllowPlayer, settings.mapFolllowPlayer);
            _this.settingsElements.mapClearing.val(settings.mapClearing);
            _this.settingsElements.mapGoogleApiKey.val(settings.mapGoogleApiKey);
            _this.settingsElements.mapOsmApiKey.val(settings.mapOsmApiKey);
            _this.settingsElements.clientAddress.val(settings.clientAddress);
            _this.settingsElements.clientPort.val(settings.clientPort);
            _this.setToggleSetting(_this.settingsElements.clientUseSSL, settings.clientUseSSL);
            _this.setNotificationSettings(_this.settingsElements.notificationsJournal, settings.notificationsJournal);
            _this.setNotificationSettings(_this.settingsElements.notificationsDesktop, settings.notificationsDesktop);
            _this.setNotificationSettings(_this.settingsElements.notificationsToast, settings.notificationsToast);
            _this.setToggleSetting(_this.settingsElements.notificationsJournalClearingAnimation, settings.notificationsJournalClearingAnimation);
        };
        this.setNotificationSettings = function (elements, settings) {
            elements.pokestopUsed.prop("checked", settings.pokestopUsed);
            elements.pokemonCapture.prop("checked", settings.pokemonCapture);
            elements.pokemonSnipe.prop("checked", settings.pokemonSnipe);
            elements.pokemonEvolved.prop("checked", settings.pokemonEvolved);
            elements.eggHatched.prop("checked", settings.eggHatched);
            elements.incubatorStatus.prop("checked", settings.incubatorStatus);
            elements.itemRecycle.prop("checked", settings.itemRecycle);
            elements.pokemonTransfer.prop("checked", settings.pokemonTransfer);
        };
        this.setToggleSetting = function (settingElement, value) {
            if (value) {
                settingElement.addClass("active");
            }
            else {
                settingElement.removeClass("active");
            }
        };
        this.getSettings = function () {
            var settings = {
                mapProvider: parseInt(_this.settingsElements.mapProvider.filter(":checked").val()),
                mapFolllowPlayer: _this.settingsElements.mapFolllowPlayer.hasClass("active"),
                mapClearing: parseInt(_this.settingsElements.mapClearing.val()),
                mapGoogleApiKey: _this.settingsElements.mapGoogleApiKey.val(),
                mapOsmApiKey: _this.settingsElements.mapOsmApiKey.val(),
                clientAddress: _this.settingsElements.clientAddress.val(),
                clientPort: parseInt(_this.settingsElements.clientPort.val()),
                clientUseSSL: _this.settingsElements.clientUseSSL.hasClass("active"),
                notificationsJournal: _this.getNotificationSettings(_this.settingsElements.notificationsJournal),
                notificationsDesktop: _this.getNotificationSettings(_this.settingsElements.notificationsDesktop),
                notificationsToast: _this.getNotificationSettings(_this.settingsElements.notificationsToast),
                notificationsJournalClearingAnimation: _this.settingsElements.notificationsJournalClearingAnimation.hasClass("active")
            };
            return settings;
        };
        this.getNotificationSettings = function (elements) {
            var notificationSettings = {
                pokestopUsed: elements.pokestopUsed.is(":checked"),
                pokemonCapture: elements.pokemonCapture.is(":checked"),
                pokemonSnipe: elements.pokemonSnipe.is(":checked"),
                pokemonEvolved: elements.pokemonEvolved.is(":checked"),
                eggHatched: elements.eggHatched.is(":checked"),
                incubatorStatus: elements.incubatorStatus.is(":checked"),
                itemRecycle: elements.itemRecycle.is(":checked"),
                pokemonTransfer: elements.pokemonTransfer.is(":checked")
            };
            return notificationSettings;
        };
        this.saveClicked = function (event) {
            if (_this.config.settingsButtonsElement.hasClass("disabled")) {
                return;
            }
            var changedSettings = _this.getSettings();
            _this.config.settingsService.apply(changedSettings);
            _this.updateConnectionStr(changedSettings);
            _this.enableDisableButtons(changedSettings, changedSettings);
        };
        this.cancelClicked = function (event) {
            var currentSettings = _this.config.settingsService.settings;
            _this.setSettings(currentSettings);
            _this.enableDisableButtons(currentSettings, currentSettings);
        };
        this.config = config;
        this.config.settingsButtonsElement.find("#save-changes").click(this.saveClicked);
        this.config.settingsButtonsElement.find("#cancel-changes").click(this.cancelClicked);
        this.config.settingsMenuElement.find(":input, .option-toggle").change(this.inputChanged);
        this.settingsElements = {
            mapProvider: this.config.settingsMenuElement.find("[name='settings-map-provider']"),
            mapFolllowPlayer: this.config.settingsMenuElement.find("[name='settings-map-follow-player']"),
            mapClearing: this.config.settingsMenuElement.find("[name='settings-map-clearing']"),
            mapGoogleApiKey: this.config.settingsMenuElement.find("[name='settings-map-google-api-key']"),
            mapOsmApiKey: this.config.settingsMenuElement.find("[name='settings-map-osm-api-key']"),
            clientAddress: this.config.settingsMenuElement.find("[name='settings-client-address']"),
            clientPort: this.config.settingsMenuElement.find("[name='settings-client-port']"),
            clientUseSSL: this.config.settingsMenuElement.find("[name='settings-client-use-ssl']"),
            notificationsJournal: {
                pokestopUsed: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokestop-used']"),
                pokemonCapture: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-capture']"),
                pokemonSnipe: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-snipe']"),
                pokemonEvolved: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-evolved']"),
                eggHatched: this.config.settingsMenuElement.find("[name='settings-notifications-journal-egg-hatched']"),
                incubatorStatus: this.config.settingsMenuElement.find("[name='settings-notifications-journal-incubator-status']"),
                itemRecycle: this.config.settingsMenuElement.find("[name='settings-notifications-journal-item-recycle']"),
                pokemonTransfer: this.config.settingsMenuElement.find("[name='settings-notifications-journal-pokemon-transfer']")
            },
            notificationsDesktop: {
                pokestopUsed: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokestop-used']"),
                pokemonCapture: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-capture']"),
                pokemonSnipe: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-snipe']"),
                pokemonEvolved: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-evolved']"),
                eggHatched: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-egg-hatched']"),
                incubatorStatus: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-incubator-status']"),
                itemRecycle: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-item-recycle']"),
                pokemonTransfer: this.config.settingsMenuElement.find("[name='settings-notifications-desktop-pokemon-transfer']")
            },
            notificationsToast: {
                pokestopUsed: this.config.settingsMenuElement.find("[name='settings-notifications-toast-pokestop-used']"),
                pokemonCapture: this.config.settingsMenuElement.find("[name='settings-notifications-toast-pokemon-capture']"),
                pokemonSnipe: this.config.settingsMenuElement.find("[name='settings-notifications-toast-pokemon-snipe']"),
                pokemonEvolved: this.config.settingsMenuElement.find("[name='settings-notifications-toast-pokemon-evolved']"),
                eggHatched: this.config.settingsMenuElement.find("[name='settings-notifications-toast-egg-hatched']"),
                incubatorStatus: this.config.settingsMenuElement.find("[name='settings-notifications-toast-incubator-status']"),
                itemRecycle: this.config.settingsMenuElement.find("[name='settings-notifications-toast-item-recycle']"),
                pokemonTransfer: this.config.settingsMenuElement.find("[name='settings-notifications-toast-pokemon-transfer']")
            },
            notificationsJournalClearingAnimation: this.config.settingsMenuElement.find("[name='settings-notifications-journal-clearing-animation']")
        };
    }
    return SettingsMenuController;
}());
var DesktopNotificationController = (function () {
    function DesktopNotificationController(config) {
        var _this = this;
        this.exampleClicked = function (ev) {
            _this.addNotificationExample();
        };
        this.checkPermissions = function () {
            if (typeof Notification === "undefined") {
                _this.updateCurrentPermission("unsupported");
                return false;
            }
            _this.updateCurrentPermission(Notification.permission);
            if (Notification.permission === "granted") {
                return true;
            }
            var promise = Notification.requestPermission();
            _this.updateCurrentPermission(Notification.permission);
            promise.then(function (perm) {
                _this.updateCurrentPermission(perm);
            }, function (reason) {
                console.log(reason);
            });
            return false;
        };
        this.updateCurrentPermission = function (status) {
            _this.config.permissionElement.text(status);
        };
        this.addNotificationExample = function () {
            if (!_this.checkPermissions()) {
                return;
            }
            _this.addNotification("Example", {
                body: "This is an example of a desktop notification",
                icon: ""
            });
        };
        this.addNotificationPokeStopUsed = function (fortUsed) {
            if (!_this.config.notificationSettings.pokestopUsed) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            _this.addNotification("Pokestop", {
                body: "" + fortUsed.Name,
                icon: "images/markers/Normal.png"
            });
        };
        this.addNotificationPokemonCapture = function (pokemonCatches, itemsUsedForCapture) {
            var pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
            if (!pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonCapture) {
                return;
            }
            if (pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonSnipe) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            var eventType = pokemonCatch.IsSnipe ? "Snipe" : "Catch";
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
            var roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
            _this.addNotification(eventType, {
                body: pokemonName + "\nCP: " + pokemonCatch.Cp + "\nIV: " + roundedPerfection,
                icon: "images/pokemon/" + pokemonCatch.Id + ".png"
            });
        };
        this.addNotificationPokemonEvolved = function (pokemonEvolve) {
            if (!_this.config.notificationSettings.pokemonEvolved) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
            _this.addNotification("Evolve", {
                body: "" + pokemonName,
                icon: "images/pokemon/" + pokemonEvolve.Id + ".png"
            });
        };
        this.addNotificationPokemonTransfer = function (pokemonTransfer) {
            if (!_this.config.notificationSettings.pokemonTransfer) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
            _this.addNotification("Transfer", {
                body: "" + pokemonName,
                icon: "images/pokemon/" + pokemonTransfer.Id + ".png"
            });
        };
        this.addNotificationItemRecycle = function (itemRecycle) {
            if (!_this.config.notificationSettings.itemRecycle) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            _this.addNotification("Recycle", {
                body: itemRecycle.Count + " items",
                icon: "images/items/" + itemRecycle.Id + ".png"
            });
        };
        this.addNotificationEggHatched = function (eggHatched) {
            if (!_this.config.notificationSettings.eggHatched) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
            _this.addNotification("Hatch", {
                body: "" + pokemonName,
                icon: "images/pokemon/" + eggHatched.PokemonId + ".png"
            });
        };
        this.addNotificationIncubatorStatus = function (incubatorStatus) {
            if (!_this.config.notificationSettings.incubatorStatus) {
                return;
            }
            if (!_this.checkPermissions()) {
                return;
            }
            var km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
            _this.addNotification("Incubator", {
                body: km + " of " + incubatorStatus.KmToWalk + "km",
                icon: "images/items/0.png"
            });
        };
        this.addNotification = function (title, options) {
            var notification = new Notification(title, options);
        };
        this.onSettingsChanged = function (settings, previousSettings) {
            _this.config.notificationSettings = settings.notificationsDesktop;
        };
        this.config = config;
        this.checkPermissions();
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }
    return DesktopNotificationController;
}());
var JournalNotificationController = (function () {
    function JournalNotificationController(config) {
        var _this = this;
        this.clearAll = function (ev) {
            var allNotificationElements = _this.config.container.children(".event").get().reverse();
            var delay = 0;
            allNotificationElements.forEach(function (notification) {
                var notificationElement = $(notification);
                notificationElement.delay(delay).slideUp(300, function () {
                    notificationElement.remove();
                    var currentCount = _this.config.container.children(".event").length;
                    _this.config.notificationCounter.text(currentCount);
                });
                delay += 50;
            });
            _this.notifications = [];
        };
        this.exampleClicked = function (ev) {
            _this.addNotificationExample();
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
            if (!_this.config.notificationSettings.pokestopUsed) {
                return;
            }
            var itemsHtml = "";
            _.each(fortUsed.ItemsList, function (item) {
                var itemId = StaticInfo.itemIds[item.Name];
                var itemName = _this.config.translationController.translation.itemNames[itemId];
                itemsHtml += "<div class=\"item\" title=\"" + itemName + "\"><img src=\"images/items/" + itemId + ".png\"/>x" + item.Count + "</div>";
            });
            var html = "<div class=\"info\">\n                          " + itemsHtml + "\n                          <div class=\"stats\">+" + fortUsed.Exp + "XP</div>\n                      </div>";
            var inventoryFullStr = fortUsed.InventoryFull ? "<span class=inv-full>inventory full</span>" : "";
            var extendedInfoHtml = "\n" + inventoryFullStr + "\nName            <span class=\"name\"> " + fortUsed.Name + " </span><br/>\nGems            <span class=\"xp\"> " + fortUsed.Gems + " </span><br/>\n";
            _this.addNotification(fortUsed, html, "pokestop", extendedInfoHtml);
        };
        this.addNotificationPokemonCapture = function (pokemonCatches, itemsUsedForCapture) {
            var pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
            if (!pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonCapture) {
                return;
            }
            if (pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonSnipe) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
            var roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
            var eventType = pokemonCatch.IsSnipe ? "snipe" : "catch";
            var html = "<div class=\"image\">\n                            <img src=\"images/pokemon/" + pokemonCatch.Id + ".png\"/>\n                        </div>\n                        <div class=\"info\">\n                            " + pokemonName + "\n                            <div class=\"stats\">CP " + pokemonCatch.Cp + " | IV " + roundedPerfection + "%</div>\n                        </div>";
            var itemsHtml = "";
            _.each(itemsUsedForCapture, function (i) { return itemsHtml += "<img src=\"images/items/" + i + ".png\">"; });
            var extendedInfoHtml = "\nUsed            <span class=\"attempts\">" + itemsHtml + "</span><br/>\nAttempts        <span class=\"attempts\">" + pokemonCatches.length + "</span><br/>\nProbability     <span class=\"probability\"> " + pokemonCatch.Probability + "% </span><br/>\nXP              <span class=\"xp\"> " + pokemonCatch.Exp + " </span><br/>\nCandies         <span class=\"candies\"> " + pokemonCatch.FamilyCandies + " </span><br/>\nCatch Type      <span class=\"catch-type\"> " + pokemonCatch.CatchType + " </span><br/>\nLevel           <span class=\"level\"> " + pokemonCatch.Level + " </span><br/>\nIV              <span class=\"level\"> " + roundedPerfection + " </span><br/>\nCP              <span class=\"cp\"> " + pokemonCatch.Cp + " </span>/<span class=\"max-cp\"> " + pokemonCatch.MaxCp + " </span><br/>\n";
            _this.addNotification(pokemonCatch, html, eventType, extendedInfoHtml);
        };
        this.addNotificationPokemonEvolved = function (pokemonEvolve) {
            if (!_this.config.notificationSettings.pokemonEvolved) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + pokemonEvolve.Id + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">+" + pokemonEvolve.Exp + "XP</div>\n                      </div>";
            _this.addNotification(pokemonEvolve, html, "evolve");
        };
        this.addNotificationEggHatched = function (eggHatched) {
            if (!_this.config.notificationSettings.eggHatched) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
            var roundedPerfection = Math.round(eggHatched.Perfection * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + eggHatched.PokemonId + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">CP " + eggHatched.Cp + " | IV " + roundedPerfection + "%</div>\n                      </div>";
            var extendedInfoHtml = "\nLevel           <span class=\"level\"> " + eggHatched.Level + " </span><br/>\nIV              <span class=\"level\"> " + roundedPerfection + " </span><br/>\nCP              <span class=\"cp\"> " + eggHatched.Cp + " </span>/<span class=\"max-cp\"> " + eggHatched.MaxCp + " </span><br/>\n";
            _this.addNotification(eggHatched, html, "egg-hatched", extendedInfoHtml);
        };
        this.addNotificationIncubatorStatus = function (incubatorStatus) {
            if (!_this.config.notificationSettings.incubatorStatus) {
                return;
            }
            var km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/items/0.png\"/>\n                      </div>\n                      <div class=\"info\">Egg\n                          <div class=\"stats\">" + km + " of " + incubatorStatus.KmToWalk + "km</div>\n                      </div>";
            _this.addNotification(incubatorStatus, html, "incubator-status");
        };
        this.addNotificationItemRecycle = function (itemRecycle) {
            if (!_this.config.notificationSettings.itemRecycle) {
                return;
            }
            var itemName = _this.config.translationController.translation.itemNames[itemRecycle.Id];
            var html = "<div class=\"info\" title=\"" + itemName + "\">\n                          <div class=\"item\"><img src=\"images/items/" + itemRecycle.Id + ".png\"/>x" + itemRecycle.Count + "</div>\n                          <div class=\"stats\">+" + itemRecycle.Count + " free space</div>\n                      </div>";
            _this.addNotification(itemRecycle, html, "recycle");
        };
        this.addNotificationPokemonTransfer = function (pokemonTransfer) {
            if (!_this.config.notificationSettings.pokemonTransfer) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
            var roundedPerfection = Math.round(pokemonTransfer.Perfection * 100) / 100;
            var html = "<div class=\"image\">\n                          <img src=\"images/pokemon/" + pokemonTransfer.Id + ".png\"/>\n                      </div>\n                      <div class=\"info\">\n                          " + pokemonName + "\n                          <div class=\"stats\">CP " + pokemonTransfer.Cp + " | IV " + roundedPerfection + "%</div>\n                      </div>";
            _this.addNotification(pokemonTransfer, html, "transfer");
        };
        this.addNotification = function (event, innerHtml, eventType, extendedInfoHtml) {
            extendedInfoHtml = extendedInfoHtml || "";
            var eventTypeName = _this.config.translationController.translation.eventTypes[eventType];
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
            _this.config.notificationCounter.text(_this.notifications.length);
        };
        this.isAtBottom = function () {
            var scrollTop = _this.config.container.scrollTop();
            var innerHeight = _this.config.container.innerHeight();
            var scrollHeight = _this.config.container[0].scrollHeight;
            var atBottom = scrollTop + innerHeight > scrollHeight - 200;
            return atBottom;
        };
        this.scrollToBottom = function () {
            var animation = {
                scrollTop: _this.config.container.prop("scrollHeight") - _this.config.container.height()
            };
            _this.config.container.finish().animate(animation, 100);
        };
        this.toggleExtendedInfo = function (ev) {
            var notificationElement = $(ev.target).closest(".event");
            notificationElement.find(".extended-info").slideToggle(500, "easeOutQuint");
        };
        this.closeNotification = function (ev) {
            var closeButton = $(ev.target);
            var element = closeButton.closest(".event");
            element.slideUp(300, function () {
                element.remove();
                _.remove(_this.notifications, function (n) { return n.element.is(element); });
                _this.config.notificationCounter.text(_this.notifications.length);
            });
        };
        this.onSettingsChanged = function (settings, previousSettings) {
            _this.config.notificationSettings = settings.notificationsJournal;
        };
        this.config = config;
        this.notifications = [];
        this.timeUpdaterInterval = setInterval(this.onUpdateTimerElapsed, 1000);
        this.config.clearAllButton.click(this.clearAll);
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }
    JournalNotificationController.prototype.addNotificationExample = function () {
        var html = "<div class=\"info\">Click for more</div>";
        var extendedInfoHtml = "This is an example notification.<br/>Extended information about the event will be added here.";
        var dummyEvent = {
            Timestamp: Date.now()
        };
        this.addNotification(dummyEvent, html, "example", extendedInfoHtml);
    };
    return JournalNotificationController;
}());
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["PokestopUsed"] = 0] = "PokestopUsed";
    NotificationType[NotificationType["PokemonCapture"] = 1] = "PokemonCapture";
    NotificationType[NotificationType["PokemonSnipe"] = 2] = "PokemonSnipe";
    NotificationType[NotificationType["PokemonEvolved"] = 3] = "PokemonEvolved";
    NotificationType[NotificationType["EggHatched"] = 4] = "EggHatched";
    NotificationType[NotificationType["IncubatorStatus"] = 5] = "IncubatorStatus";
    NotificationType[NotificationType["ItemRecycle"] = 6] = "ItemRecycle";
    NotificationType[NotificationType["PokemonTransfer"] = 7] = "PokemonTransfer";
})(NotificationType || (NotificationType = {}));
var ToastNotificationController = (function () {
    function ToastNotificationController(config) {
        var _this = this;
        this.exampleClicked = function (ev) {
            _this.addNotificationExample();
        };
        this.addNotificationExample = function () {
            _this.addNotification("Example", "This is a toast notification");
        };
        this.addNotificationPokeStopUsed = function (fortUsed) {
            if (!_this.config.notificationSettings.pokestopUsed) {
                return;
            }
            _this.addNotification("Pokestop", fortUsed.Name);
        };
        this.addNotificationPokemonCapture = function (pokemonCatches, itemsUsedForCapture) {
            var pokemonCatch = pokemonCatches[pokemonCatches.length - 1];
            if (!pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonCapture) {
                return;
            }
            if (pokemonCatch.IsSnipe && !_this.config.notificationSettings.pokemonSnipe) {
                return;
            }
            var eventType = pokemonCatch.IsSnipe ? "Snipe" : "Catch";
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonCatch.Id];
            var roundedPerfection = Math.round(pokemonCatch.Perfection * 100) / 100;
            _this.addNotification(eventType, pokemonName);
        };
        this.addNotificationPokemonEvolved = function (pokemonEvolve) {
            if (!_this.config.notificationSettings.pokemonEvolved) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonEvolve.Id];
            _this.addNotification("Evolve", pokemonName);
        };
        this.addNotificationPokemonTransfer = function (pokemonTransfer) {
            if (!_this.config.notificationSettings.pokemonTransfer) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[pokemonTransfer.Id];
            _this.addNotification("Transfer", pokemonName);
        };
        this.addNotificationItemRecycle = function (itemRecycle) {
            if (!_this.config.notificationSettings.itemRecycle) {
                return;
            }
            _this.addNotification("Recycle", itemRecycle.Count + " items");
        };
        this.addNotificationEggHatched = function (eggHatched) {
            if (!_this.config.notificationSettings.eggHatched) {
                return;
            }
            var pokemonName = _this.config.translationController.translation.pokemonNames[eggHatched.PokemonId];
            _this.addNotification("Hatch", pokemonName);
        };
        this.addNotificationIncubatorStatus = function (incubatorStatus) {
            if (!_this.config.notificationSettings.incubatorStatus) {
                return;
            }
            var km = Math.round((incubatorStatus.KmToWalk - incubatorStatus.KmRemaining) * 100) / 100;
            _this.addNotification("Incubator", km + " of " + incubatorStatus.KmToWalk + "km");
        };
        this.addNotification = function (title, body, bgColor, textColor, delay) {
            if (body === void 0) { body = ""; }
            if (bgColor === void 0) { bgColor = "#2196f3"; }
            if (textColor === void 0) { textColor = "#ffffff"; }
            if (delay === void 0) { delay = 2500; }
            _this.config.toastControler.addToast(title, body, bgColor, textColor, delay);
        };
        this.onSettingsChanged = function (settings, previousSettings) {
            _this.config.notificationSettings = settings.notificationsToast;
        };
        this.config = config;
        this.config.exampleButton.click(this.exampleClicked);
        this.config.settingsService.subscribe(this.onSettingsChanged);
    }
    return ToastNotificationController;
}());
var ProfileInfoController = (function () {
    function ProfileInfoController(config) {
        var _this = this;
        this.setProfileData = function (profile) {
            _this.config.profileInfoElement.find(".profile-username").text(" " + profile.PlayerData.Username + " ");
            _this.config.profileInfoElement.find(".profile-pokecoin").text(profile.PlayerData.PokeCoin);
            _this.config.profileInfoElement.find(".profile-stardust-current").text(profile.PlayerData.StarDust);
            _this.config.profileInfoElement.find(".profile-stardust-loading").remove();
            _this.config.profileInfoElement.find(".profile-stardust-loaded").show();
        };
        this.setPlayerStats = function (playerStats) {
            _this.addExp(playerStats.Experience);
        };
        this.addStardust = function (stardust, stardustAdded) {
            var stardustElement = _this.config.profileInfoElement.find(".profile-stardust-current");
            _this.config.profileInfoElement.find(".profile-stardust-loading").remove();
            _this.config.profileInfoElement.find(".profile-stardust-loaded").show();
            _this.animateTo(stardustElement, stardust);
            if (stardustAdded) {
                var stardustBubbleContainer = _this.config.profileInfoElement.find(".profile-stardust");
                _this.bubble(stardustBubbleContainer, "stardust-bubble", stardustAdded);
            }
        };
        this.addExp = function (totalExp, expAdded) {
            var currentLevel = StaticInfo.calculateCurrentLevel(totalExp);
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
                var expBubbleContainer = _this.config.profileInfoElement.find(".profile-exp");
                _this.bubble(expBubbleContainer, "xp-bubble", expAdded);
            }
        };
        this.bubble = function (container, className, expAdded) {
            var bubbleHtml = "<div class=\"" + className + "\">+" + expAdded + "</div>";
            var bubble = $(bubbleHtml);
            container.append(bubble);
            setTimeout(function () { bubble.remove(); }, 1000);
        };
        this.config = config;
        if (this.config.hideUsername) {
            this.config.profileInfoElement.find(".profile-username").hide();
        }
    }
    ProfileInfoController.prototype.animateTo = function (element, to) {
        var current = parseInt(element.text());
        element.prop("number", current);
        element.animateNumber({
            number: to
        });
    };
    return ProfileInfoController;
}());
var ToastController = (function () {
    function ToastController(config) {
        var _this = this;
        this.addToast = function (title, body, bgColor, textColor, delay) {
            _this.config.toastElement.text(title);
            _this.config.toastElement.append("<div class='countdown'></div>");
            _this.config.toastElement.css({
                "background-color": bgColor,
                "color": textColor
            });
            if (body.length > 0) {
                _this.config.toastElement.append("<div class='description'>" + body + "</div>");
            }
            _this.config.toastElement.finish().animate({ "top": "25px" }, 500, "easeOutBack");
            var countdownElement = _this.config.toastElement.find(".countdown");
            countdownElement.finish().animate({ "width": "0" }, delay, "linear");
            var animateTopTo = -(_this.config.toastElement.outerHeight() + 2);
            _this.config.toastElement.delay(delay - 500).animate({ "top": animateTopTo }, 500, "easeInOutQuart");
        };
        this.config = config;
    }
    return ToastController;
}());
var InterfaceHandler = (function () {
    function InterfaceHandler(config) {
        var _this = this;
        this.onUpdatePosition = function (location) {
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
                _this.config.fortCacheService.addFort(forts[i], true);
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
            _this.currentItemCount--;
            _this.config.mainMenuController.setItemCount(_this.currentItemCount);
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
                _.each(_this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationPokemonCapture(_this.previousCaptureAttempts, _this.itemsUsedForCapture); });
                _this.currentExp += pokemonCapture.Exp;
                _this.config.profileInfoController.addExp(_this.currentExp, pokemonCapture.Exp);
                var previousStardust = _this.currentStardust;
                var stardustAdded = pokemonCapture.Stardust - previousStardust;
                _this.currentStardust = pokemonCapture.Stardust;
                _this.config.profileInfoController.addStardust(pokemonCapture.Stardust, 100);
                _this.currentPokemonCount++;
                _this.config.mainMenuController.setPokemonCount(_this.currentPokemonCount);
            }
        };
        this.onSettingsChanged = function (settings, previousSettings) {
            _this.config.map.config.followPlayer = settings.mapFolllowPlayer;
        };
        this.config = config;
        this.config.settingsService.subscribe(this.onSettingsChanged);
        this.currentlySniping = false;
        this.previousCaptureAttempts = [];
        this.itemsUsedForCapture = [];
        this.currentExp = 0;
        this.currentStardust = 0;
        this.currentPokemonCount = 0;
        this.currentItemCount = 0;
        this.latestPlayerStats = null;
    }
    InterfaceHandler.prototype.onFortTarget = function (fortTarget) {
        this.config.map.targetFort(fortTarget);
    };
    InterfaceHandler.prototype.onFortUsed = function (fortUsed) {
        var itemsAddedCount = _.sum(_.map(fortUsed.ItemsList, function (item) { return item.Count; }));
        this.currentItemCount += itemsAddedCount;
        this.config.mainMenuController.setItemCount(this.currentItemCount);
        this.config.fortCacheService.setName(fortUsed.Id, fortUsed.Name);
        var pokeStop = _.find(this.pokeStops, function (ps) { return ps.Id === fortUsed.Id; });
        pokeStop.Name = fortUsed.Name;
        this.config.map.usePokeStop(fortUsed);
        this.currentExp += fortUsed.Exp;
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationPokeStopUsed(fortUsed); });
        this.config.profileInfoController.addExp(this.currentExp, fortUsed.Exp);
    };
    InterfaceHandler.prototype.onProfile = function (profile) {
        this.config.mainMenuController.updateProfileData(profile);
        this.config.profileInfoController.setProfileData(profile);
        this.config.requestSender.sendPlayerStatsRequest();
        this.config.requestSender.sendGetPokemonSettingsRequest();
        this.config.requestSender.sendInventoryListRequest();
        this.config.requestSender.sendPokemonListRequest();
        this.config.requestSender.sendEggsListRequest();
    };
    InterfaceHandler.prototype.onUseBerry = function (berry) {
        this.currentItemCount--;
        this.config.mainMenuController.setItemCount(this.currentItemCount);
        var berryId = berry.BerryType || StaticInfo.berryIds[0];
        this.itemsUsedForCapture.push(berryId);
    };
    InterfaceHandler.prototype.onEvolveCount = function (evolveCount) {
    };
    InterfaceHandler.prototype.onPokemonEvolve = function (pokemonEvolve) {
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationPokemonEvolved(pokemonEvolve); });
        this.currentExp += pokemonEvolve.Exp;
        this.config.profileInfoController.addExp(this.currentExp, pokemonEvolve.Exp);
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
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationEggHatched(eggHatched); });
    };
    InterfaceHandler.prototype.onIncubatorStatus = function (incubatorStatus) {
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationIncubatorStatus(incubatorStatus); });
    };
    InterfaceHandler.prototype.onItemRecycle = function (itemRecycle) {
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationItemRecycle(itemRecycle); });
        this.currentItemCount -= itemRecycle.Count;
        this.config.mainMenuController.setItemCount(this.currentItemCount);
    };
    InterfaceHandler.prototype.onPokemonTransfer = function (pokemonTransfer) {
        _.each(this.config.notificationControllers, function (ctrl) { return ctrl.addNotificationPokemonTransfer(pokemonTransfer); });
        this.currentPokemonCount--;
        this.config.mainMenuController.setPokemonCount(this.currentPokemonCount);
    };
    InterfaceHandler.prototype.onPokemonList = function (pokemonList) {
        this.config.pokemonMenuController.updatePokemonList(pokemonList);
        this.currentPokemonCount = pokemonList.Pokemons.length;
        this.config.mainMenuController.setPokemonCount(this.currentPokemonCount);
    };
    InterfaceHandler.prototype.onEggList = function (eggList) {
        var totalIncubated = _.filter(eggList.Incubators, function (inc) { return inc.PokemonId != "0"; }).length;
        var totalUnincubated = eggList.UnusedEggs.length;
        if (this.config.requestSender.currentBotFamily === BotFamily.Necro) {
            this.config.eggMenuController.updateEggList(eggList, this.latestPlayerStats.KmWalked);
        }
        else {
            this.config.eggMenuController.updateEggList(eggList);
        }
        this.config.mainMenuController.setEggCount(totalIncubated + totalUnincubated);
    };
    InterfaceHandler.prototype.onInventoryList = function (inventoryList) {
        var totalCount = _.sum(_.map(inventoryList.Items, function (item) { return item.Count; }));
        this.config.inventoryMenuController.updateInventoryList(inventoryList);
        this.currentItemCount = totalCount;
        this.config.mainMenuController.setItemCount(this.currentItemCount);
    };
    InterfaceHandler.prototype.onPlayerStats = function (playerStats) {
        this.currentExp = playerStats.Experience;
        this.config.profileInfoController.setPlayerStats(playerStats);
        this.latestPlayerStats = playerStats;
    };
    InterfaceHandler.prototype.onSendPokemonListRequest = function (request) {
        this.config.pokemonMenuController.pokemonListRequested(request);
    };
    InterfaceHandler.prototype.onSendEggsListRequest = function (request) {
        this.config.eggMenuController.eggListRequested(request);
    };
    InterfaceHandler.prototype.onSendInventoryListRequest = function (request) {
        this.config.inventoryMenuController.inventoryListRequested(request);
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
var PokeElement;
(function (PokeElement) {
    PokeElement[PokeElement["Bug"] = 0] = "Bug";
    PokeElement[PokeElement["Grass"] = 1] = "Grass";
    PokeElement[PokeElement["Dark"] = 2] = "Dark";
    PokeElement[PokeElement["Ground"] = 3] = "Ground";
    PokeElement[PokeElement["Dragon"] = 4] = "Dragon";
    PokeElement[PokeElement["Ice"] = 5] = "Ice";
    PokeElement[PokeElement["Electric"] = 6] = "Electric";
    PokeElement[PokeElement["Normal"] = 7] = "Normal";
    PokeElement[PokeElement["Fairy"] = 8] = "Fairy";
    PokeElement[PokeElement["Poison"] = 9] = "Poison";
    PokeElement[PokeElement["Fighting"] = 10] = "Fighting";
    PokeElement[PokeElement["Psychic"] = 11] = "Psychic";
    PokeElement[PokeElement["Fire"] = 12] = "Fire";
    PokeElement[PokeElement["Rock"] = 13] = "Rock";
    PokeElement[PokeElement["Flying"] = 14] = "Flying";
    PokeElement[PokeElement["Steel"] = 15] = "Steel";
    PokeElement[PokeElement["Ghost"] = 16] = "Ghost";
    PokeElement[PokeElement["Water"] = 17] = "Water";
})(PokeElement || (PokeElement = {}));
var MoveType;
(function (MoveType) {
    MoveType[MoveType["QuickMove"] = 0] = "QuickMove";
    MoveType[MoveType["ChargeMove"] = 1] = "ChargeMove";
})(MoveType || (MoveType = {}));
;
var StaticInfo = (function () {
    function StaticInfo() {
    }
    StaticInfo.calculateCurrentLevel = function (totalExp) {
        for (var i = 0; i < StaticInfo.totalExpForLevel.length; i++) {
            if (StaticInfo.totalExpForLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine level";
    };
    StaticInfo.calculateCurrentGymLevel = function (totalExp) {
        for (var i = 0; i < StaticInfo.totalExpForGymLevel.length; i++) {
            if (StaticInfo.totalExpForGymLevel[i + 1] >= totalExp) {
                return i;
            }
        }
        throw "Unable to determine gym level";
    };
    StaticInfo.init = function () {
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
        var totalExpForGymLevel = [];
        totalExpForGymLevel[0] = -Infinity;
        totalExpForGymLevel[1] = 0;
        totalExpForGymLevel[2] = 2000;
        totalExpForGymLevel[3] = 4000;
        totalExpForGymLevel[4] = 8000;
        totalExpForGymLevel[5] = 12000;
        totalExpForGymLevel[6] = 16000;
        totalExpForGymLevel[7] = 20000;
        totalExpForGymLevel[8] = 30000;
        totalExpForGymLevel[9] = 40000;
        totalExpForGymLevel[10] = 50000;
        totalExpForGymLevel[11] = Infinity;
        StaticInfo.totalExpForGymLevel = totalExpForGymLevel;
        var moveInfo = [];
        moveInfo[13] = {
            moveId: 13,
            name: "Wrap",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.25,
            damagePerSecondWithStab: 7.81,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.6,
            cooldown: 4.00
        };
        moveInfo[13].availableToPokemon[23] = {
            pokemonId: 23,
            baseAttack: 112
        };
        moveInfo[13].availableToPokemon[69] = {
            pokemonId: 69,
            baseAttack: 158
        };
        moveInfo[13].availableToPokemon[72] = {
            pokemonId: 72,
            baseAttack: 106
        };
        moveInfo[13].availableToPokemon[147] = {
            pokemonId: 147,
            baseAttack: 128
        };
        moveInfo[13].availableToPokemon[148] = {
            pokemonId: 148,
            baseAttack: 170
        };
        moveInfo[14] = {
            moveId: 14,
            name: "Hyper Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 120,
            damageWithStab: 120,
            damagePerSecond: 24.00,
            damagePerSecondWithStab: 30.00,
            damagePerSecondDefensive: 17.14,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.8,
            cooldown: 5.00
        };
        moveInfo[14].availableToPokemon[20] = {
            pokemonId: 20,
            baseAttack: 146
        };
        moveInfo[14].availableToPokemon[40] = {
            pokemonId: 40,
            baseAttack: 168
        };
        moveInfo[14].availableToPokemon[101] = {
            pokemonId: 101,
            baseAttack: 150
        };
        moveInfo[14].availableToPokemon[108] = {
            pokemonId: 108,
            baseAttack: 126
        };
        moveInfo[14].availableToPokemon[142] = {
            pokemonId: 142,
            baseAttack: 182
        };
        moveInfo[14].availableToPokemon[143] = {
            pokemonId: 143,
            baseAttack: 180
        };
        moveInfo[14].availableToPokemon[149] = {
            pokemonId: 149,
            baseAttack: 250
        };
        moveInfo[14].availableToPokemon[150] = {
            pokemonId: 150,
            baseAttack: 284
        };
        moveInfo[14].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[16] = {
            moveId: 16,
            name: "Dark Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 12.86,
            damagePerSecondWithStab: 16.07,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.50
        };
        moveInfo[16].availableToPokemon[24] = {
            pokemonId: 24,
            baseAttack: 166
        };
        moveInfo[16].availableToPokemon[52] = {
            pokemonId: 52,
            baseAttack: 104
        };
        moveInfo[16].availableToPokemon[89] = {
            pokemonId: 89,
            baseAttack: 180
        };
        moveInfo[16].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[16].availableToPokemon[93] = {
            pokemonId: 93,
            baseAttack: 172
        };
        moveInfo[16].availableToPokemon[94] = {
            pokemonId: 94,
            baseAttack: 204
        };
        moveInfo[16].availableToPokemon[109] = {
            pokemonId: 109,
            baseAttack: 136
        };
        moveInfo[16].availableToPokemon[110] = {
            pokemonId: 110,
            baseAttack: 190
        };
        moveInfo[18] = {
            moveId: 18,
            name: "Sludge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 2.60
        };
        moveInfo[18].availableToPokemon[88] = {
            pokemonId: 88,
            baseAttack: 124
        };
        moveInfo[18].availableToPokemon[109] = {
            pokemonId: 109,
            baseAttack: 136
        };
        moveInfo[20] = {
            moveId: 20,
            name: "Vice Grip",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 11.90,
            damagePerSecondWithStab: 14.88,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.25,
            cooldown: 2.10
        };
        moveInfo[20].availableToPokemon[98] = {
            pokemonId: 98,
            baseAttack: 116
        };
        moveInfo[20].availableToPokemon[99] = {
            pokemonId: 99,
            baseAttack: 178
        };
        moveInfo[20].availableToPokemon[127] = {
            pokemonId: 127,
            baseAttack: 184
        };
        moveInfo[21] = {
            moveId: 21,
            name: "Flame Wheel",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 8.70,
            damagePerSecondWithStab: 10.87,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 4.60
        };
        moveInfo[21].availableToPokemon[58] = {
            pokemonId: 58,
            baseAttack: 156
        };
        moveInfo[21].availableToPokemon[77] = {
            pokemonId: 77,
            baseAttack: 168
        };
        moveInfo[22] = {
            moveId: 22,
            name: "Megahorn",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.3,
            cooldown: 3.20
        };
        moveInfo[22].availableToPokemon[34] = {
            pokemonId: 34,
            baseAttack: 204
        };
        moveInfo[22].availableToPokemon[112] = {
            pokemonId: 112,
            baseAttack: 166
        };
        moveInfo[22].availableToPokemon[119] = {
            pokemonId: 119,
            baseAttack: 172
        };
        moveInfo[24] = {
            moveId: 24,
            name: "Flamethrower",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 18.97,
            damagePerSecondWithStab: 23.71,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.9,
            cooldown: 2.90
        };
        moveInfo[24].availableToPokemon[4] = {
            pokemonId: 4,
            baseAttack: 128
        };
        moveInfo[24].availableToPokemon[5] = {
            pokemonId: 5,
            baseAttack: 160
        };
        moveInfo[24].availableToPokemon[6] = {
            pokemonId: 6,
            baseAttack: 212
        };
        moveInfo[24].availableToPokemon[37] = {
            pokemonId: 37,
            baseAttack: 106
        };
        moveInfo[24].availableToPokemon[38] = {
            pokemonId: 38,
            baseAttack: 176
        };
        moveInfo[24].availableToPokemon[58] = {
            pokemonId: 58,
            baseAttack: 156
        };
        moveInfo[24].availableToPokemon[59] = {
            pokemonId: 59,
            baseAttack: 230
        };
        moveInfo[24].availableToPokemon[126] = {
            pokemonId: 126,
            baseAttack: 214
        };
        moveInfo[24].availableToPokemon[136] = {
            pokemonId: 136,
            baseAttack: 238
        };
        moveInfo[26] = {
            moveId: 26,
            name: "Dig",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 12.07,
            damagePerSecondWithStab: 15.09,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.4,
            cooldown: 5.80
        };
        moveInfo[26].availableToPokemon[19] = {
            pokemonId: 19,
            baseAttack: 92
        };
        moveInfo[26].availableToPokemon[20] = {
            pokemonId: 20,
            baseAttack: 146
        };
        moveInfo[26].availableToPokemon[27] = {
            pokemonId: 27,
            baseAttack: 90
        };
        moveInfo[26].availableToPokemon[30] = {
            pokemonId: 30,
            baseAttack: 132
        };
        moveInfo[26].availableToPokemon[33] = {
            pokemonId: 33,
            baseAttack: 142
        };
        moveInfo[26].availableToPokemon[50] = {
            pokemonId: 50,
            baseAttack: 108
        };
        moveInfo[26].availableToPokemon[74] = {
            pokemonId: 74,
            baseAttack: 106
        };
        moveInfo[26].availableToPokemon[75] = {
            pokemonId: 75,
            baseAttack: 142
        };
        moveInfo[26].availableToPokemon[104] = {
            pokemonId: 104,
            baseAttack: 102
        };
        moveInfo[26].availableToPokemon[105] = {
            pokemonId: 105,
            baseAttack: 140
        };
        moveInfo[26].availableToPokemon[133] = {
            pokemonId: 133,
            baseAttack: 114
        };
        moveInfo[28] = {
            moveId: 28,
            name: "Cross Chop",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 60,
            damageWithStab: 60,
            damagePerSecond: 30.00,
            damagePerSecondWithStab: 37.50,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.3,
            cooldown: 2.00
        };
        moveInfo[28].availableToPokemon[54] = {
            pokemonId: 54,
            baseAttack: 132
        };
        moveInfo[28].availableToPokemon[56] = {
            pokemonId: 56,
            baseAttack: 122
        };
        moveInfo[28].availableToPokemon[57] = {
            pokemonId: 57,
            baseAttack: 178
        };
        moveInfo[28].availableToPokemon[66] = {
            pokemonId: 66,
            baseAttack: 118
        };
        moveInfo[28].availableToPokemon[67] = {
            pokemonId: 67,
            baseAttack: 154
        };
        moveInfo[28].availableToPokemon[68] = {
            pokemonId: 68,
            baseAttack: 198
        };
        moveInfo[30] = {
            moveId: 30,
            name: "Psybeam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 10.53,
            damagePerSecondWithStab: 13.16,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1.3,
            cooldown: 3.80
        };
        moveInfo[30].availableToPokemon[48] = {
            pokemonId: 48,
            baseAttack: 108
        };
        moveInfo[30].availableToPokemon[54] = {
            pokemonId: 54,
            baseAttack: 132
        };
        moveInfo[30].availableToPokemon[64] = {
            pokemonId: 64,
            baseAttack: 150
        };
        moveInfo[30].availableToPokemon[96] = {
            pokemonId: 96,
            baseAttack: 104
        };
        moveInfo[30].availableToPokemon[113] = {
            pokemonId: 113,
            baseAttack: 40
        };
        moveInfo[30].availableToPokemon[121] = {
            pokemonId: 121,
            baseAttack: 194
        };
        moveInfo[30].availableToPokemon[122] = {
            pokemonId: 122,
            baseAttack: 154
        };
        moveInfo[30].availableToPokemon[137] = {
            pokemonId: 137,
            baseAttack: 156
        };
        moveInfo[31] = {
            moveId: 31,
            name: "Earthquake",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 23.81,
            damagePerSecondWithStab: 29.76,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.95,
            cooldown: 4.20
        };
        moveInfo[31].availableToPokemon[28] = {
            pokemonId: 28,
            baseAttack: 150
        };
        moveInfo[31].availableToPokemon[31] = {
            pokemonId: 31,
            baseAttack: 184
        };
        moveInfo[31].availableToPokemon[34] = {
            pokemonId: 34,
            baseAttack: 204
        };
        moveInfo[31].availableToPokemon[51] = {
            pokemonId: 51,
            baseAttack: 148
        };
        moveInfo[31].availableToPokemon[76] = {
            pokemonId: 76,
            baseAttack: 176
        };
        moveInfo[31].availableToPokemon[105] = {
            pokemonId: 105,
            baseAttack: 140
        };
        moveInfo[31].availableToPokemon[112] = {
            pokemonId: 112,
            baseAttack: 166
        };
        moveInfo[31].availableToPokemon[115] = {
            pokemonId: 115,
            baseAttack: 142
        };
        moveInfo[31].availableToPokemon[128] = {
            pokemonId: 128,
            baseAttack: 148
        };
        moveInfo[31].availableToPokemon[143] = {
            pokemonId: 143,
            baseAttack: 180
        };
        moveInfo[31].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[32] = {
            moveId: 32,
            name: "Stone Edge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.81,
            damagePerSecondWithStab: 32.26,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.10
        };
        moveInfo[32].availableToPokemon[31] = {
            pokemonId: 31,
            baseAttack: 184
        };
        moveInfo[32].availableToPokemon[51] = {
            pokemonId: 51,
            baseAttack: 148
        };
        moveInfo[32].availableToPokemon[68] = {
            pokemonId: 68,
            baseAttack: 198
        };
        moveInfo[32].availableToPokemon[75] = {
            pokemonId: 75,
            baseAttack: 142
        };
        moveInfo[32].availableToPokemon[76] = {
            pokemonId: 76,
            baseAttack: 176
        };
        moveInfo[32].availableToPokemon[95] = {
            pokemonId: 95,
            baseAttack: 90
        };
        moveInfo[32].availableToPokemon[106] = {
            pokemonId: 106,
            baseAttack: 148
        };
        moveInfo[32].availableToPokemon[112] = {
            pokemonId: 112,
            baseAttack: 166
        };
        moveInfo[32].availableToPokemon[141] = {
            pokemonId: 141,
            baseAttack: 190
        };
        moveInfo[33] = {
            moveId: 33,
            name: "Ice Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 12.86,
            damagePerSecondWithStab: 16.07,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.50
        };
        moveInfo[33].availableToPokemon[62] = {
            pokemonId: 62,
            baseAttack: 180
        };
        moveInfo[33].availableToPokemon[107] = {
            pokemonId: 107,
            baseAttack: 138
        };
        moveInfo[33].availableToPokemon[124] = {
            pokemonId: 124,
            baseAttack: 172
        };
        moveInfo[35] = {
            moveId: 35,
            name: "Discharge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 14.00,
            damagePerSecondWithStab: 17.50,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.7,
            cooldown: 2.50
        };
        moveInfo[35].availableToPokemon[25] = {
            pokemonId: 25,
            baseAttack: 124
        };
        moveInfo[35].availableToPokemon[81] = {
            pokemonId: 81,
            baseAttack: 128
        };
        moveInfo[35].availableToPokemon[82] = {
            pokemonId: 82,
            baseAttack: 186
        };
        moveInfo[35].availableToPokemon[100] = {
            pokemonId: 100,
            baseAttack: 102
        };
        moveInfo[35].availableToPokemon[101] = {
            pokemonId: 101,
            baseAttack: 150
        };
        moveInfo[35].availableToPokemon[135] = {
            pokemonId: 135,
            baseAttack: 192
        };
        moveInfo[35].availableToPokemon[137] = {
            pokemonId: 137,
            baseAttack: 156
        };
        moveInfo[35].availableToPokemon[145] = {
            pokemonId: 145,
            baseAttack: 232
        };
        moveInfo[36] = {
            moveId: 36,
            name: "Flash Cannon",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 60,
            damageWithStab: 60,
            damagePerSecond: 15.38,
            damagePerSecondWithStab: 19.23,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.1,
            cooldown: 3.90
        };
        moveInfo[36].availableToPokemon[9] = {
            pokemonId: 9,
            baseAttack: 186
        };
        moveInfo[36].availableToPokemon[82] = {
            pokemonId: 82,
            baseAttack: 186
        };
        moveInfo[36].availableToPokemon[116] = {
            pokemonId: 116,
            baseAttack: 122
        };
        moveInfo[38] = {
            moveId: 38,
            name: "Drill Peck",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.81,
            damagePerSecondWithStab: 18.52,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.9,
            cooldown: 2.70
        };
        moveInfo[38].availableToPokemon[21] = {
            pokemonId: 21,
            baseAttack: 102
        };
        moveInfo[38].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[38].availableToPokemon[85] = {
            pokemonId: 85,
            baseAttack: 182
        };
        moveInfo[39] = {
            moveId: 39,
            name: "Ice Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 17.81,
            damagePerSecondWithStab: 22.26,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.35,
            cooldown: 3.65
        };
        moveInfo[39].availableToPokemon[8] = {
            pokemonId: 8,
            baseAttack: 144
        };
        moveInfo[39].availableToPokemon[9] = {
            pokemonId: 9,
            baseAttack: 186
        };
        moveInfo[39].availableToPokemon[55] = {
            pokemonId: 55,
            baseAttack: 194
        };
        moveInfo[39].availableToPokemon[80] = {
            pokemonId: 80,
            baseAttack: 184
        };
        moveInfo[39].availableToPokemon[131] = {
            pokemonId: 131,
            baseAttack: 186
        };
        moveInfo[39].availableToPokemon[144] = {
            pokemonId: 144,
            baseAttack: 198
        };
        moveInfo[40] = {
            moveId: 40,
            name: "Blizzard",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 25.64,
            damagePerSecondWithStab: 32.05,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0,
            cooldown: 3.90
        };
        moveInfo[40].availableToPokemon[73] = {
            pokemonId: 73,
            baseAttack: 170
        };
        moveInfo[40].availableToPokemon[87] = {
            pokemonId: 87,
            baseAttack: 156
        };
        moveInfo[40].availableToPokemon[91] = {
            pokemonId: 91,
            baseAttack: 196
        };
        moveInfo[40].availableToPokemon[117] = {
            pokemonId: 117,
            baseAttack: 176
        };
        moveInfo[40].availableToPokemon[131] = {
            pokemonId: 131,
            baseAttack: 186
        };
        moveInfo[40].availableToPokemon[144] = {
            pokemonId: 144,
            baseAttack: 198
        };
        moveInfo[42] = {
            moveId: 42,
            name: "Heat Wave",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 21.05,
            damagePerSecondWithStab: 26.32,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.80
        };
        moveInfo[42].availableToPokemon[38] = {
            pokemonId: 38,
            baseAttack: 176
        };
        moveInfo[42].availableToPokemon[78] = {
            pokemonId: 78,
            baseAttack: 200
        };
        moveInfo[42].availableToPokemon[136] = {
            pokemonId: 136,
            baseAttack: 238
        };
        moveInfo[45] = {
            moveId: 45,
            name: "Aerial Ace",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.6,
            cooldown: 2.90
        };
        moveInfo[45].availableToPokemon[15] = {
            pokemonId: 15,
            baseAttack: 144
        };
        moveInfo[45].availableToPokemon[16] = {
            pokemonId: 16,
            baseAttack: 94
        };
        moveInfo[45].availableToPokemon[17] = {
            pokemonId: 17,
            baseAttack: 126
        };
        moveInfo[45].availableToPokemon[18] = {
            pokemonId: 18,
            baseAttack: 170
        };
        moveInfo[45].availableToPokemon[21] = {
            pokemonId: 21,
            baseAttack: 102
        };
        moveInfo[45].availableToPokemon[22] = {
            pokemonId: 22,
            baseAttack: 168
        };
        moveInfo[45].availableToPokemon[83] = {
            pokemonId: 83,
            baseAttack: 138
        };
        moveInfo[45].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[45].availableToPokemon[85] = {
            pokemonId: 85,
            baseAttack: 182
        };
        moveInfo[46] = {
            moveId: 46,
            name: "Drill Run",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 50,
            damageWithStab: 50,
            damagePerSecond: 14.71,
            damagePerSecondWithStab: 18.38,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.7,
            cooldown: 3.40
        };
        moveInfo[46].availableToPokemon[22] = {
            pokemonId: 22,
            baseAttack: 168
        };
        moveInfo[46].availableToPokemon[78] = {
            pokemonId: 78,
            baseAttack: 200
        };
        moveInfo[46].availableToPokemon[119] = {
            pokemonId: 119,
            baseAttack: 172
        };
        moveInfo[47] = {
            moveId: 47,
            name: "Petal Blizzard",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 20.31,
            damagePerSecondWithStab: 25.39,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1,
            cooldown: 3.20
        };
        moveInfo[47].availableToPokemon[3] = {
            pokemonId: 3,
            baseAttack: 198
        };
        moveInfo[47].availableToPokemon[44] = {
            pokemonId: 44,
            baseAttack: 162
        };
        moveInfo[47].availableToPokemon[45] = {
            pokemonId: 45,
            baseAttack: 202
        };
        moveInfo[49] = {
            moveId: 49,
            name: "Bug Buzz",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 75,
            damageWithStab: 75,
            damagePerSecond: 17.65,
            damagePerSecondWithStab: 22.06,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.5,
            cooldown: 4.25
        };
        moveInfo[49].availableToPokemon[12] = {
            pokemonId: 12,
            baseAttack: 144
        };
        moveInfo[49].availableToPokemon[49] = {
            pokemonId: 49,
            baseAttack: 172
        };
        moveInfo[49].availableToPokemon[123] = {
            pokemonId: 123,
            baseAttack: 176
        };
        moveInfo[50] = {
            moveId: 50,
            name: "Poison Fang",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.42,
            damagePerSecondWithStab: 13.02,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.2,
            cooldown: 2.40
        };
        moveInfo[50].availableToPokemon[29] = {
            pokemonId: 29,
            baseAttack: 100
        };
        moveInfo[50].availableToPokemon[30] = {
            pokemonId: 30,
            baseAttack: 132
        };
        moveInfo[50].availableToPokemon[41] = {
            pokemonId: 41,
            baseAttack: 88
        };
        moveInfo[50].availableToPokemon[42] = {
            pokemonId: 42,
            baseAttack: 164
        };
        moveInfo[50].availableToPokemon[48] = {
            pokemonId: 48,
            baseAttack: 108
        };
        moveInfo[50].availableToPokemon[49] = {
            pokemonId: 49,
            baseAttack: 172
        };
        moveInfo[51] = {
            moveId: 51,
            name: "Night Slash",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.70
        };
        moveInfo[51].availableToPokemon[52] = {
            pokemonId: 52,
            baseAttack: 104
        };
        moveInfo[51].availableToPokemon[53] = {
            pokemonId: 53,
            baseAttack: 156
        };
        moveInfo[51].availableToPokemon[57] = {
            pokemonId: 57,
            baseAttack: 178
        };
        moveInfo[51].availableToPokemon[123] = {
            pokemonId: 123,
            baseAttack: 176
        };
        moveInfo[53] = {
            moveId: 53,
            name: "Bubble Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.90
        };
        moveInfo[53].availableToPokemon[60] = {
            pokemonId: 60,
            baseAttack: 108
        };
        moveInfo[53].availableToPokemon[61] = {
            pokemonId: 61,
            baseAttack: 132
        };
        moveInfo[53].availableToPokemon[72] = {
            pokemonId: 72,
            baseAttack: 106
        };
        moveInfo[53].availableToPokemon[90] = {
            pokemonId: 90,
            baseAttack: 120
        };
        moveInfo[53].availableToPokemon[98] = {
            pokemonId: 98,
            baseAttack: 116
        };
        moveInfo[53].availableToPokemon[116] = {
            pokemonId: 116,
            baseAttack: 122
        };
        moveInfo[53].availableToPokemon[120] = {
            pokemonId: 120,
            baseAttack: 130
        };
        moveInfo[54] = {
            moveId: 54,
            name: "Submission",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.15,
            cooldown: 2.10
        };
        moveInfo[54].availableToPokemon[62] = {
            pokemonId: 62,
            baseAttack: 180
        };
        moveInfo[54].availableToPokemon[67] = {
            pokemonId: 67,
            baseAttack: 154
        };
        moveInfo[54].availableToPokemon[68] = {
            pokemonId: 68,
            baseAttack: 198
        };
        moveInfo[54].availableToPokemon[127] = {
            pokemonId: 127,
            baseAttack: 184
        };
        moveInfo[56] = {
            moveId: 56,
            name: "Low Sweep",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 13.33,
            damagePerSecondWithStab: 16.67,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.15,
            cooldown: 2.25
        };
        moveInfo[56].availableToPokemon[56] = {
            pokemonId: 56,
            baseAttack: 122
        };
        moveInfo[56].availableToPokemon[57] = {
            pokemonId: 57,
            baseAttack: 178
        };
        moveInfo[56].availableToPokemon[66] = {
            pokemonId: 66,
            baseAttack: 118
        };
        moveInfo[56].availableToPokemon[106] = {
            pokemonId: 106,
            baseAttack: 148
        };
        moveInfo[57] = {
            moveId: 57,
            name: "Aqua Jet",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.64,
            damagePerSecondWithStab: 13.30,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.4,
            cooldown: 2.35
        };
        moveInfo[57].availableToPokemon[7] = {
            pokemonId: 7,
            baseAttack: 112
        };
        moveInfo[57].availableToPokemon[8] = {
            pokemonId: 8,
            baseAttack: 144
        };
        moveInfo[57].availableToPokemon[86] = {
            pokemonId: 86,
            baseAttack: 104
        };
        moveInfo[57].availableToPokemon[87] = {
            pokemonId: 87,
            baseAttack: 156
        };
        moveInfo[57].availableToPokemon[140] = {
            pokemonId: 140,
            baseAttack: 148
        };
        moveInfo[58] = {
            moveId: 58,
            name: "Aqua Tail",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 19.15,
            damagePerSecondWithStab: 23.94,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 2.35
        };
        moveInfo[58].availableToPokemon[7] = {
            pokemonId: 7,
            baseAttack: 112
        };
        moveInfo[58].availableToPokemon[54] = {
            pokemonId: 54,
            baseAttack: 132
        };
        moveInfo[58].availableToPokemon[86] = {
            pokemonId: 86,
            baseAttack: 104
        };
        moveInfo[58].availableToPokemon[118] = {
            pokemonId: 118,
            baseAttack: 112
        };
        moveInfo[58].availableToPokemon[134] = {
            pokemonId: 134,
            baseAttack: 186
        };
        moveInfo[58].availableToPokemon[147] = {
            pokemonId: 147,
            baseAttack: 128
        };
        moveInfo[58].availableToPokemon[148] = {
            pokemonId: 148,
            baseAttack: 170
        };
        moveInfo[59] = {
            moveId: 59,
            name: "Seed Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.5,
            cooldown: 2.40
        };
        moveInfo[59].availableToPokemon[1] = {
            pokemonId: 1,
            baseAttack: 126
        };
        moveInfo[59].availableToPokemon[43] = {
            pokemonId: 43,
            baseAttack: 134
        };
        moveInfo[59].availableToPokemon[46] = {
            pokemonId: 46,
            baseAttack: 122
        };
        moveInfo[59].availableToPokemon[70] = {
            pokemonId: 70,
            baseAttack: 190
        };
        moveInfo[59].availableToPokemon[102] = {
            pokemonId: 102,
            baseAttack: 110
        };
        moveInfo[59].availableToPokemon[103] = {
            pokemonId: 103,
            baseAttack: 232
        };
        moveInfo[60] = {
            moveId: 60,
            name: "Psyshock",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.81,
            damagePerSecondWithStab: 18.52,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.5,
            cooldown: 2.70
        };
        moveInfo[60].availableToPokemon[63] = {
            pokemonId: 63,
            baseAttack: 110
        };
        moveInfo[60].availableToPokemon[79] = {
            pokemonId: 79,
            baseAttack: 110
        };
        moveInfo[60].availableToPokemon[96] = {
            pokemonId: 96,
            baseAttack: 104
        };
        moveInfo[60].availableToPokemon[97] = {
            pokemonId: 97,
            baseAttack: 162
        };
        moveInfo[60].availableToPokemon[124] = {
            pokemonId: 124,
            baseAttack: 172
        };
        moveInfo[62] = {
            moveId: 62,
            name: "Ancient Power",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 9.72,
            damagePerSecondWithStab: 12.15,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.35,
            cooldown: 3.60
        };
        moveInfo[62].availableToPokemon[76] = {
            pokemonId: 76,
            baseAttack: 176
        };
        moveInfo[62].availableToPokemon[102] = {
            pokemonId: 102,
            baseAttack: 110
        };
        moveInfo[62].availableToPokemon[138] = {
            pokemonId: 138,
            baseAttack: 132
        };
        moveInfo[62].availableToPokemon[139] = {
            pokemonId: 139,
            baseAttack: 180
        };
        moveInfo[62].availableToPokemon[140] = {
            pokemonId: 140,
            baseAttack: 148
        };
        moveInfo[62].availableToPokemon[141] = {
            pokemonId: 141,
            baseAttack: 190
        };
        moveInfo[62].availableToPokemon[142] = {
            pokemonId: 142,
            baseAttack: 182
        };
        moveInfo[63] = {
            moveId: 63,
            name: "Rock Tomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 8.82,
            damagePerSecondWithStab: 11.03,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.9,
            cooldown: 3.40
        };
        moveInfo[63].availableToPokemon[27] = {
            pokemonId: 27,
            baseAttack: 90
        };
        moveInfo[63].availableToPokemon[28] = {
            pokemonId: 28,
            baseAttack: 150
        };
        moveInfo[63].availableToPokemon[50] = {
            pokemonId: 50,
            baseAttack: 108
        };
        moveInfo[63].availableToPokemon[74] = {
            pokemonId: 74,
            baseAttack: 106
        };
        moveInfo[63].availableToPokemon[138] = {
            pokemonId: 138,
            baseAttack: 132
        };
        moveInfo[63].availableToPokemon[140] = {
            pokemonId: 140,
            baseAttack: 148
        };
        moveInfo[64] = {
            moveId: 64,
            name: "Rock Slide",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 50,
            damageWithStab: 50,
            damagePerSecond: 15.63,
            damagePerSecondWithStab: 19.53,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1.4,
            cooldown: 3.20
        };
        moveInfo[64].availableToPokemon[27] = {
            pokemonId: 27,
            baseAttack: 90
        };
        moveInfo[64].availableToPokemon[74] = {
            pokemonId: 74,
            baseAttack: 106
        };
        moveInfo[64].availableToPokemon[75] = {
            pokemonId: 75,
            baseAttack: 142
        };
        moveInfo[64].availableToPokemon[95] = {
            pokemonId: 95,
            baseAttack: 90
        };
        moveInfo[64].availableToPokemon[139] = {
            pokemonId: 139,
            baseAttack: 180
        };
        moveInfo[65] = {
            moveId: 65,
            name: "Power Gem",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 13.79,
            damagePerSecondWithStab: 17.24,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.8,
            cooldown: 2.90
        };
        moveInfo[65].availableToPokemon[53] = {
            pokemonId: 53,
            baseAttack: 156
        };
        moveInfo[65].availableToPokemon[120] = {
            pokemonId: 120,
            baseAttack: 130
        };
        moveInfo[65].availableToPokemon[121] = {
            pokemonId: 121,
            baseAttack: 194
        };
        moveInfo[69] = {
            moveId: 69,
            name: "Ominous Wind",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 9.68,
            damagePerSecondWithStab: 12.10,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.25,
            cooldown: 3.10
        };
        moveInfo[69].availableToPokemon[42] = {
            pokemonId: 42,
            baseAttack: 164
        };
        moveInfo[69].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[70] = {
            moveId: 70,
            name: "Shadow Ball",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 14.61,
            damagePerSecondWithStab: 18.26,
            damagePerSecondDefensive: 8.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.3,
            cooldown: 3.08
        };
        moveInfo[70].availableToPokemon[63] = {
            pokemonId: 63,
            baseAttack: 110
        };
        moveInfo[70].availableToPokemon[64] = {
            pokemonId: 64,
            baseAttack: 150
        };
        moveInfo[70].availableToPokemon[65] = {
            pokemonId: 65,
            baseAttack: 186
        };
        moveInfo[70].availableToPokemon[93] = {
            pokemonId: 93,
            baseAttack: 172
        };
        moveInfo[70].availableToPokemon[94] = {
            pokemonId: 94,
            baseAttack: 204
        };
        moveInfo[70].availableToPokemon[97] = {
            pokemonId: 97,
            baseAttack: 162
        };
        moveInfo[70].availableToPokemon[110] = {
            pokemonId: 110,
            baseAttack: 190
        };
        moveInfo[70].availableToPokemon[122] = {
            pokemonId: 122,
            baseAttack: 154
        };
        moveInfo[70].availableToPokemon[150] = {
            pokemonId: 150,
            baseAttack: 284
        };
        moveInfo[72] = {
            moveId: 72,
            name: "Magnet Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.71,
            damagePerSecondWithStab: 13.39,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.55,
            cooldown: 2.80
        };
        moveInfo[72].availableToPokemon[81] = {
            pokemonId: 81,
            baseAttack: 128
        };
        moveInfo[72].availableToPokemon[82] = {
            pokemonId: 82,
            baseAttack: 186
        };
        moveInfo[74] = {
            moveId: 74,
            name: "Iron Head",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 15.00,
            damagePerSecondWithStab: 18.75,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.00
        };
        moveInfo[74].availableToPokemon[95] = {
            pokemonId: 95,
            baseAttack: 90
        };
        moveInfo[74].availableToPokemon[128] = {
            pokemonId: 128,
            baseAttack: 148
        };
        moveInfo[74].availableToPokemon[142] = {
            pokemonId: 142,
            baseAttack: 182
        };
        moveInfo[77] = {
            moveId: 77,
            name: "Thunder Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.40
        };
        moveInfo[77].availableToPokemon[26] = {
            pokemonId: 26,
            baseAttack: 200
        };
        moveInfo[77].availableToPokemon[107] = {
            pokemonId: 107,
            baseAttack: 138
        };
        moveInfo[77].availableToPokemon[125] = {
            pokemonId: 125,
            baseAttack: 198
        };
        moveInfo[79] = {
            moveId: 79,
            name: "Thunderbolt",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 20.37,
            damagePerSecondWithStab: 25.46,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.8,
            cooldown: 2.70
        };
        moveInfo[79].availableToPokemon[25] = {
            pokemonId: 25,
            baseAttack: 124
        };
        moveInfo[79].availableToPokemon[81] = {
            pokemonId: 81,
            baseAttack: 128
        };
        moveInfo[79].availableToPokemon[100] = {
            pokemonId: 100,
            baseAttack: 102
        };
        moveInfo[79].availableToPokemon[101] = {
            pokemonId: 101,
            baseAttack: 150
        };
        moveInfo[79].availableToPokemon[125] = {
            pokemonId: 125,
            baseAttack: 198
        };
        moveInfo[79].availableToPokemon[135] = {
            pokemonId: 135,
            baseAttack: 192
        };
        moveInfo[79].availableToPokemon[145] = {
            pokemonId: 145,
            baseAttack: 232
        };
        moveInfo[80] = {
            moveId: 80,
            name: "Twister",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 9.26,
            damagePerSecondWithStab: 11.57,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 1.75,
            cooldown: 2.70
        };
        moveInfo[80].availableToPokemon[16] = {
            pokemonId: 16,
            baseAttack: 94
        };
        moveInfo[80].availableToPokemon[17] = {
            pokemonId: 17,
            baseAttack: 126
        };
        moveInfo[80].availableToPokemon[21] = {
            pokemonId: 21,
            baseAttack: 102
        };
        moveInfo[80].availableToPokemon[22] = {
            pokemonId: 22,
            baseAttack: 168
        };
        moveInfo[80].availableToPokemon[130] = {
            pokemonId: 130,
            baseAttack: 192
        };
        moveInfo[80].availableToPokemon[147] = {
            pokemonId: 147,
            baseAttack: 128
        };
        moveInfo[82] = {
            moveId: 82,
            name: "Dragon Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 18.06,
            damagePerSecondWithStab: 22.57,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.2,
            cooldown: 3.60
        };
        moveInfo[82].availableToPokemon[116] = {
            pokemonId: 116,
            baseAttack: 122
        };
        moveInfo[82].availableToPokemon[117] = {
            pokemonId: 117,
            baseAttack: 176
        };
        moveInfo[82].availableToPokemon[130] = {
            pokemonId: 130,
            baseAttack: 192
        };
        moveInfo[82].availableToPokemon[131] = {
            pokemonId: 131,
            baseAttack: 186
        };
        moveInfo[82].availableToPokemon[148] = {
            pokemonId: 148,
            baseAttack: 170
        };
        moveInfo[82].availableToPokemon[149] = {
            pokemonId: 149,
            baseAttack: 250
        };
        moveInfo[82].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[83] = {
            moveId: 83,
            name: "Dragon Claw",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 21.88,
            damagePerSecondWithStab: 27.34,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 1.60
        };
        moveInfo[83].availableToPokemon[6] = {
            pokemonId: 6,
            baseAttack: 212
        };
        moveInfo[83].availableToPokemon[149] = {
            pokemonId: 149,
            baseAttack: 250
        };
        moveInfo[84] = {
            moveId: 84,
            name: "Disarming Voice",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.41,
            damagePerSecondWithStab: 8.01,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 1.8,
            cooldown: 3.90
        };
        moveInfo[84].availableToPokemon[35] = {
            pokemonId: 35,
            baseAttack: 116
        };
        moveInfo[84].availableToPokemon[39] = {
            pokemonId: 39,
            baseAttack: 98
        };
        moveInfo[85] = {
            moveId: 85,
            name: "Draining Kiss",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 8.93,
            damagePerSecondWithStab: 11.16,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.1,
            cooldown: 2.80
        };
        moveInfo[85].availableToPokemon[124] = {
            pokemonId: 124,
            baseAttack: 172
        };
        moveInfo[86] = {
            moveId: 86,
            name: "Dazzling Gleam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 13.10,
            damagePerSecondWithStab: 16.37,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.8,
            cooldown: 4.20
        };
        moveInfo[86].availableToPokemon[36] = {
            pokemonId: 36,
            baseAttack: 178
        };
        moveInfo[86].availableToPokemon[40] = {
            pokemonId: 40,
            baseAttack: 168
        };
        moveInfo[86].availableToPokemon[64] = {
            pokemonId: 64,
            baseAttack: 150
        };
        moveInfo[86].availableToPokemon[65] = {
            pokemonId: 65,
            baseAttack: 186
        };
        moveInfo[86].availableToPokemon[113] = {
            pokemonId: 113,
            baseAttack: 40
        };
        moveInfo[87] = {
            moveId: 87,
            name: "Moonblast",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 85,
            damageWithStab: 85,
            damagePerSecond: 20.73,
            damagePerSecondWithStab: 25.91,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.6,
            cooldown: 4.10
        };
        moveInfo[87].availableToPokemon[35] = {
            pokemonId: 35,
            baseAttack: 116
        };
        moveInfo[87].availableToPokemon[36] = {
            pokemonId: 36,
            baseAttack: 178
        };
        moveInfo[87].availableToPokemon[43] = {
            pokemonId: 43,
            baseAttack: 134
        };
        moveInfo[87].availableToPokemon[44] = {
            pokemonId: 44,
            baseAttack: 162
        };
        moveInfo[87].availableToPokemon[45] = {
            pokemonId: 45,
            baseAttack: 202
        };
        moveInfo[87].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[88] = {
            moveId: 88,
            name: "Play Rough",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fairy,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 18.97,
            damagePerSecondWithStab: 23.71,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1.3,
            cooldown: 2.90
        };
        moveInfo[88].availableToPokemon[39] = {
            pokemonId: 39,
            baseAttack: 98
        };
        moveInfo[88].availableToPokemon[40] = {
            pokemonId: 40,
            baseAttack: 168
        };
        moveInfo[88].availableToPokemon[53] = {
            pokemonId: 53,
            baseAttack: 156
        };
        moveInfo[89] = {
            moveId: 89,
            name: "Cross Poison",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.3,
            cooldown: 1.50
        };
        moveInfo[89].availableToPokemon[46] = {
            pokemonId: 46,
            baseAttack: 122
        };
        moveInfo[89].availableToPokemon[47] = {
            pokemonId: 47,
            baseAttack: 162
        };
        moveInfo[90] = {
            moveId: 90,
            name: "Sludge Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 21.15,
            damagePerSecondWithStab: 26.44,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.5,
            cooldown: 2.60
        };
        moveInfo[90].availableToPokemon[1] = {
            pokemonId: 1,
            baseAttack: 126
        };
        moveInfo[90].availableToPokemon[2] = {
            pokemonId: 2,
            baseAttack: 156
        };
        moveInfo[90].availableToPokemon[3] = {
            pokemonId: 3,
            baseAttack: 198
        };
        moveInfo[90].availableToPokemon[15] = {
            pokemonId: 15,
            baseAttack: 144
        };
        moveInfo[90].availableToPokemon[23] = {
            pokemonId: 23,
            baseAttack: 112
        };
        moveInfo[90].availableToPokemon[29] = {
            pokemonId: 29,
            baseAttack: 100
        };
        moveInfo[90].availableToPokemon[30] = {
            pokemonId: 30,
            baseAttack: 132
        };
        moveInfo[90].availableToPokemon[32] = {
            pokemonId: 32,
            baseAttack: 110
        };
        moveInfo[90].availableToPokemon[33] = {
            pokemonId: 33,
            baseAttack: 142
        };
        moveInfo[90].availableToPokemon[41] = {
            pokemonId: 41,
            baseAttack: 88
        };
        moveInfo[90].availableToPokemon[43] = {
            pokemonId: 43,
            baseAttack: 134
        };
        moveInfo[90].availableToPokemon[44] = {
            pokemonId: 44,
            baseAttack: 162
        };
        moveInfo[90].availableToPokemon[69] = {
            pokemonId: 69,
            baseAttack: 158
        };
        moveInfo[90].availableToPokemon[70] = {
            pokemonId: 70,
            baseAttack: 190
        };
        moveInfo[90].availableToPokemon[71] = {
            pokemonId: 71,
            baseAttack: 222
        };
        moveInfo[90].availableToPokemon[88] = {
            pokemonId: 88,
            baseAttack: 124
        };
        moveInfo[90].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[90].availableToPokemon[93] = {
            pokemonId: 93,
            baseAttack: 172
        };
        moveInfo[90].availableToPokemon[109] = {
            pokemonId: 109,
            baseAttack: 136
        };
        moveInfo[90].availableToPokemon[110] = {
            pokemonId: 110,
            baseAttack: 190
        };
        moveInfo[90].availableToPokemon[114] = {
            pokemonId: 114,
            baseAttack: 164
        };
        moveInfo[91] = {
            moveId: 91,
            name: "Sludge Wave",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 20.59,
            damagePerSecondWithStab: 25.74,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.9,
            cooldown: 3.40
        };
        moveInfo[91].availableToPokemon[24] = {
            pokemonId: 24,
            baseAttack: 166
        };
        moveInfo[91].availableToPokemon[31] = {
            pokemonId: 31,
            baseAttack: 184
        };
        moveInfo[91].availableToPokemon[34] = {
            pokemonId: 34,
            baseAttack: 204
        };
        moveInfo[91].availableToPokemon[73] = {
            pokemonId: 73,
            baseAttack: 170
        };
        moveInfo[91].availableToPokemon[89] = {
            pokemonId: 89,
            baseAttack: 180
        };
        moveInfo[91].availableToPokemon[94] = {
            pokemonId: 94,
            baseAttack: 204
        };
        moveInfo[92] = {
            moveId: 92,
            name: "Gunk Shot",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 65,
            damageWithStab: 65,
            damagePerSecond: 21.67,
            damagePerSecondWithStab: 27.08,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 3.00
        };
        moveInfo[92].availableToPokemon[23] = {
            pokemonId: 23,
            baseAttack: 112
        };
        moveInfo[92].availableToPokemon[24] = {
            pokemonId: 24,
            baseAttack: 166
        };
        moveInfo[92].availableToPokemon[89] = {
            pokemonId: 89,
            baseAttack: 180
        };
        moveInfo[94] = {
            moveId: 94,
            name: "Bone Club",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 15.63,
            damagePerSecondWithStab: 19.53,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.25,
            cooldown: 1.60
        };
        moveInfo[94].availableToPokemon[104] = {
            pokemonId: 104,
            baseAttack: 102
        };
        moveInfo[94].availableToPokemon[105] = {
            pokemonId: 105,
            baseAttack: 140
        };
        moveInfo[95] = {
            moveId: 95,
            name: "Bulldoze",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 10.29,
            damagePerSecondWithStab: 12.87,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1.1,
            cooldown: 3.40
        };
        moveInfo[95].availableToPokemon[28] = {
            pokemonId: 28,
            baseAttack: 150
        };
        moveInfo[95].availableToPokemon[59] = {
            pokemonId: 59,
            baseAttack: 230
        };
        moveInfo[95].availableToPokemon[104] = {
            pokemonId: 104,
            baseAttack: 102
        };
        moveInfo[95].availableToPokemon[111] = {
            pokemonId: 111,
            baseAttack: 110
        };
        moveInfo[96] = {
            moveId: 96,
            name: "Mud Bomb",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.45,
            cooldown: 2.60
        };
        moveInfo[96].availableToPokemon[50] = {
            pokemonId: 50,
            baseAttack: 108
        };
        moveInfo[96].availableToPokemon[51] = {
            pokemonId: 51,
            baseAttack: 148
        };
        moveInfo[96].availableToPokemon[60] = {
            pokemonId: 60,
            baseAttack: 108
        };
        moveInfo[96].availableToPokemon[61] = {
            pokemonId: 61,
            baseAttack: 132
        };
        moveInfo[96].availableToPokemon[88] = {
            pokemonId: 88,
            baseAttack: 124
        };
        moveInfo[99] = {
            moveId: 99,
            name: "Signal Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 45,
            damageWithStab: 45,
            damagePerSecond: 14.52,
            damagePerSecondWithStab: 18.15,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 1,
            cooldown: 3.10
        };
        moveInfo[99].availableToPokemon[12] = {
            pokemonId: 12,
            baseAttack: 144
        };
        moveInfo[99].availableToPokemon[48] = {
            pokemonId: 48,
            baseAttack: 108
        };
        moveInfo[99].availableToPokemon[63] = {
            pokemonId: 63,
            baseAttack: 110
        };
        moveInfo[99].availableToPokemon[100] = {
            pokemonId: 100,
            baseAttack: 102
        };
        moveInfo[99].availableToPokemon[137] = {
            pokemonId: 137,
            baseAttack: 156
        };
        moveInfo[100] = {
            moveId: 100,
            name: "X-Scissor",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.25,
            cooldown: 2.10
        };
        moveInfo[100].availableToPokemon[15] = {
            pokemonId: 15,
            baseAttack: 144
        };
        moveInfo[100].availableToPokemon[46] = {
            pokemonId: 46,
            baseAttack: 122
        };
        moveInfo[100].availableToPokemon[47] = {
            pokemonId: 47,
            baseAttack: 162
        };
        moveInfo[100].availableToPokemon[99] = {
            pokemonId: 99,
            baseAttack: 178
        };
        moveInfo[100].availableToPokemon[123] = {
            pokemonId: 123,
            baseAttack: 176
        };
        moveInfo[100].availableToPokemon[127] = {
            pokemonId: 127,
            baseAttack: 184
        };
        moveInfo[101] = {
            moveId: 101,
            name: "Flame Charge",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 8.06,
            damagePerSecondWithStab: 10.08,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.2,
            cooldown: 3.10
        };
        moveInfo[101].availableToPokemon[4] = {
            pokemonId: 4,
            baseAttack: 128
        };
        moveInfo[101].availableToPokemon[37] = {
            pokemonId: 37,
            baseAttack: 106
        };
        moveInfo[101].availableToPokemon[77] = {
            pokemonId: 77,
            baseAttack: 168
        };
        moveInfo[102] = {
            moveId: 102,
            name: "Flame Burst",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.2,
            cooldown: 2.10
        };
        moveInfo[102].availableToPokemon[4] = {
            pokemonId: 4,
            baseAttack: 128
        };
        moveInfo[102].availableToPokemon[5] = {
            pokemonId: 5,
            baseAttack: 160
        };
        moveInfo[103] = {
            moveId: 103,
            name: "Fire Blast",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 100,
            damageWithStab: 100,
            damagePerSecond: 24.39,
            damagePerSecondWithStab: 30.49,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 0.4,
            cooldown: 4.10
        };
        moveInfo[103].availableToPokemon[6] = {
            pokemonId: 6,
            baseAttack: 212
        };
        moveInfo[103].availableToPokemon[38] = {
            pokemonId: 38,
            baseAttack: 176
        };
        moveInfo[103].availableToPokemon[59] = {
            pokemonId: 59,
            baseAttack: 230
        };
        moveInfo[103].availableToPokemon[77] = {
            pokemonId: 77,
            baseAttack: 168
        };
        moveInfo[103].availableToPokemon[78] = {
            pokemonId: 78,
            baseAttack: 200
        };
        moveInfo[103].availableToPokemon[126] = {
            pokemonId: 126,
            baseAttack: 214
        };
        moveInfo[103].availableToPokemon[136] = {
            pokemonId: 136,
            baseAttack: 238
        };
        moveInfo[103].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[104] = {
            moveId: 104,
            name: "Brine",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.42,
            damagePerSecondWithStab: 13.02,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.35,
            cooldown: 2.40
        };
        moveInfo[104].availableToPokemon[138] = {
            pokemonId: 138,
            baseAttack: 132
        };
        moveInfo[105] = {
            moveId: 105,
            name: "Water Pulse",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 10.61,
            damagePerSecondWithStab: 13.26,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 1,
            cooldown: 3.30
        };
        moveInfo[105].availableToPokemon[7] = {
            pokemonId: 7,
            baseAttack: 112
        };
        moveInfo[105].availableToPokemon[72] = {
            pokemonId: 72,
            baseAttack: 106
        };
        moveInfo[105].availableToPokemon[79] = {
            pokemonId: 79,
            baseAttack: 110
        };
        moveInfo[105].availableToPokemon[80] = {
            pokemonId: 80,
            baseAttack: 184
        };
        moveInfo[105].availableToPokemon[90] = {
            pokemonId: 90,
            baseAttack: 120
        };
        moveInfo[105].availableToPokemon[98] = {
            pokemonId: 98,
            baseAttack: 116
        };
        moveInfo[105].availableToPokemon[99] = {
            pokemonId: 99,
            baseAttack: 178
        };
        moveInfo[105].availableToPokemon[118] = {
            pokemonId: 118,
            baseAttack: 112
        };
        moveInfo[105].availableToPokemon[134] = {
            pokemonId: 134,
            baseAttack: 186
        };
        moveInfo[105].availableToPokemon[141] = {
            pokemonId: 141,
            baseAttack: 190
        };
        moveInfo[106] = {
            moveId: 106,
            name: "Scald",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 13.75,
            damagePerSecondWithStab: 17.19,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 2.1,
            cooldown: 4.00
        };
        moveInfo[106].availableToPokemon[61] = {
            pokemonId: 61,
            baseAttack: 132
        };
        moveInfo[107] = {
            moveId: 107,
            name: "Hydro Pump",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 90,
            damageWithStab: 90,
            damagePerSecond: 23.68,
            damagePerSecondWithStab: 29.61,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 2.1,
            cooldown: 3.80
        };
        moveInfo[107].availableToPokemon[8] = {
            pokemonId: 8,
            baseAttack: 144
        };
        moveInfo[107].availableToPokemon[9] = {
            pokemonId: 9,
            baseAttack: 186
        };
        moveInfo[107].availableToPokemon[55] = {
            pokemonId: 55,
            baseAttack: 194
        };
        moveInfo[107].availableToPokemon[62] = {
            pokemonId: 62,
            baseAttack: 180
        };
        moveInfo[107].availableToPokemon[73] = {
            pokemonId: 73,
            baseAttack: 170
        };
        moveInfo[107].availableToPokemon[91] = {
            pokemonId: 91,
            baseAttack: 196
        };
        moveInfo[107].availableToPokemon[117] = {
            pokemonId: 117,
            baseAttack: 176
        };
        moveInfo[107].availableToPokemon[121] = {
            pokemonId: 121,
            baseAttack: 194
        };
        moveInfo[107].availableToPokemon[130] = {
            pokemonId: 130,
            baseAttack: 192
        };
        moveInfo[107].availableToPokemon[134] = {
            pokemonId: 134,
            baseAttack: 186
        };
        moveInfo[107].availableToPokemon[139] = {
            pokemonId: 139,
            baseAttack: 180
        };
        moveInfo[111] = {
            moveId: 111,
            name: "Icy Wind",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 6.58,
            damagePerSecondWithStab: 8.22,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.7,
            cooldown: 3.80
        };
        moveInfo[111].availableToPokemon[86] = {
            pokemonId: 86,
            baseAttack: 104
        };
        moveInfo[111].availableToPokemon[87] = {
            pokemonId: 87,
            baseAttack: 156
        };
        moveInfo[111].availableToPokemon[90] = {
            pokemonId: 90,
            baseAttack: 120
        };
        moveInfo[111].availableToPokemon[91] = {
            pokemonId: 91,
            baseAttack: 196
        };
        moveInfo[111].availableToPokemon[119] = {
            pokemonId: 119,
            baseAttack: 172
        };
        moveInfo[111].availableToPokemon[144] = {
            pokemonId: 144,
            baseAttack: 198
        };
        moveInfo[115] = {
            moveId: 115,
            name: "Fire Punch",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.51,
            cooldown: 2.80
        };
        moveInfo[115].availableToPokemon[5] = {
            pokemonId: 5,
            baseAttack: 160
        };
        moveInfo[115].availableToPokemon[107] = {
            pokemonId: 107,
            baseAttack: 138
        };
        moveInfo[115].availableToPokemon[126] = {
            pokemonId: 126,
            baseAttack: 214
        };
        moveInfo[116] = {
            moveId: 116,
            name: "Solar Beam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 120,
            damageWithStab: 120,
            damagePerSecond: 24.49,
            damagePerSecondWithStab: 30.61,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.7,
            cooldown: 4.90
        };
        moveInfo[116].availableToPokemon[2] = {
            pokemonId: 2,
            baseAttack: 156
        };
        moveInfo[116].availableToPokemon[3] = {
            pokemonId: 3,
            baseAttack: 198
        };
        moveInfo[116].availableToPokemon[45] = {
            pokemonId: 45,
            baseAttack: 202
        };
        moveInfo[116].availableToPokemon[47] = {
            pokemonId: 47,
            baseAttack: 162
        };
        moveInfo[116].availableToPokemon[71] = {
            pokemonId: 71,
            baseAttack: 222
        };
        moveInfo[116].availableToPokemon[103] = {
            pokemonId: 103,
            baseAttack: 232
        };
        moveInfo[116].availableToPokemon[114] = {
            pokemonId: 114,
            baseAttack: 164
        };
        moveInfo[116].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[117] = {
            moveId: 117,
            name: "Leaf Blade",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 55,
            damageWithStab: 55,
            damagePerSecond: 19.64,
            damagePerSecondWithStab: 24.55,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 1,
            cooldown: 2.80
        };
        moveInfo[117].availableToPokemon[71] = {
            pokemonId: 71,
            baseAttack: 222
        };
        moveInfo[117].availableToPokemon[83] = {
            pokemonId: 83,
            baseAttack: 138
        };
        moveInfo[118] = {
            moveId: 118,
            name: "Power Whip",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 70,
            damageWithStab: 70,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.3,
            cooldown: 2.80
        };
        moveInfo[118].availableToPokemon[1] = {
            pokemonId: 1,
            baseAttack: 126
        };
        moveInfo[118].availableToPokemon[2] = {
            pokemonId: 2,
            baseAttack: 156
        };
        moveInfo[118].availableToPokemon[69] = {
            pokemonId: 69,
            baseAttack: 158
        };
        moveInfo[118].availableToPokemon[70] = {
            pokemonId: 70,
            baseAttack: 190
        };
        moveInfo[118].availableToPokemon[108] = {
            pokemonId: 108,
            baseAttack: 126
        };
        moveInfo[118].availableToPokemon[114] = {
            pokemonId: 114,
            baseAttack: 164
        };
        moveInfo[121] = {
            moveId: 121,
            name: "Air Cutter",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 9.09,
            damagePerSecondWithStab: 11.36,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.9,
            cooldown: 3.30
        };
        moveInfo[121].availableToPokemon[16] = {
            pokemonId: 16,
            baseAttack: 94
        };
        moveInfo[121].availableToPokemon[17] = {
            pokemonId: 17,
            baseAttack: 126
        };
        moveInfo[121].availableToPokemon[18] = {
            pokemonId: 18,
            baseAttack: 170
        };
        moveInfo[121].availableToPokemon[41] = {
            pokemonId: 41,
            baseAttack: 88
        };
        moveInfo[121].availableToPokemon[42] = {
            pokemonId: 42,
            baseAttack: 164
        };
        moveInfo[121].availableToPokemon[83] = {
            pokemonId: 83,
            baseAttack: 138
        };
        moveInfo[121].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[122] = {
            moveId: 122,
            name: "Hurricane",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 80,
            damageWithStab: 80,
            damagePerSecond: 25.00,
            damagePerSecondWithStab: 31.25,
            energyPerSecond: 0.00,
            chargeEnergy: 1,
            dodgeWindow: 1.77,
            cooldown: 3.20
        };
        moveInfo[122].availableToPokemon[18] = {
            pokemonId: 18,
            baseAttack: 170
        };
        moveInfo[122].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[123] = {
            moveId: 123,
            name: "Brick Break",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 18.75,
            damagePerSecondWithStab: 23.44,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.4,
            cooldown: 1.60
        };
        moveInfo[123].availableToPokemon[26] = {
            pokemonId: 26,
            baseAttack: 200
        };
        moveInfo[123].availableToPokemon[56] = {
            pokemonId: 56,
            baseAttack: 122
        };
        moveInfo[123].availableToPokemon[66] = {
            pokemonId: 66,
            baseAttack: 118
        };
        moveInfo[123].availableToPokemon[67] = {
            pokemonId: 67,
            baseAttack: 154
        };
        moveInfo[123].availableToPokemon[115] = {
            pokemonId: 115,
            baseAttack: 142
        };
        moveInfo[125] = {
            moveId: 125,
            name: "Swift",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.5,
            cooldown: 3.00
        };
        moveInfo[125].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[125].availableToPokemon[120] = {
            pokemonId: 120,
            baseAttack: 130
        };
        moveInfo[125].availableToPokemon[133] = {
            pokemonId: 133,
            baseAttack: 114
        };
        moveInfo[126] = {
            moveId: 126,
            name: "Horn Attack",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 11.36,
            damagePerSecondWithStab: 14.20,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.3,
            cooldown: 2.20
        };
        moveInfo[126].availableToPokemon[32] = {
            pokemonId: 32,
            baseAttack: 110
        };
        moveInfo[126].availableToPokemon[33] = {
            pokemonId: 33,
            baseAttack: 142
        };
        moveInfo[126].availableToPokemon[111] = {
            pokemonId: 111,
            baseAttack: 110
        };
        moveInfo[126].availableToPokemon[118] = {
            pokemonId: 118,
            baseAttack: 112
        };
        moveInfo[126].availableToPokemon[128] = {
            pokemonId: 128,
            baseAttack: 148
        };
        moveInfo[127] = {
            moveId: 127,
            name: "Stomp",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 30,
            damageWithStab: 30,
            damagePerSecond: 14.29,
            damagePerSecondWithStab: 17.86,
            energyPerSecond: 0.00,
            chargeEnergy: 4,
            dodgeWindow: 0.7,
            cooldown: 2.10
        };
        moveInfo[127].availableToPokemon[106] = {
            pokemonId: 106,
            baseAttack: 148
        };
        moveInfo[127].availableToPokemon[108] = {
            pokemonId: 108,
            baseAttack: 126
        };
        moveInfo[127].availableToPokemon[111] = {
            pokemonId: 111,
            baseAttack: 110
        };
        moveInfo[127].availableToPokemon[115] = {
            pokemonId: 115,
            baseAttack: 142
        };
        moveInfo[129] = {
            moveId: 129,
            name: "Hyper Fang",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 35,
            damageWithStab: 35,
            damagePerSecond: 16.67,
            damagePerSecondWithStab: 20.83,
            energyPerSecond: 0.00,
            chargeEnergy: 3,
            dodgeWindow: 0.3,
            cooldown: 2.10
        };
        moveInfo[129].availableToPokemon[19] = {
            pokemonId: 19,
            baseAttack: 92
        };
        moveInfo[129].availableToPokemon[20] = {
            pokemonId: 20,
            baseAttack: 146
        };
        moveInfo[131] = {
            moveId: 131,
            name: "Body Slam",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 40,
            damageWithStab: 40,
            damagePerSecond: 25.64,
            damagePerSecondWithStab: 32.05,
            energyPerSecond: 0.00,
            chargeEnergy: 2,
            dodgeWindow: 0.2,
            cooldown: 1.56
        };
        moveInfo[131].availableToPokemon[19] = {
            pokemonId: 19,
            baseAttack: 92
        };
        moveInfo[131].availableToPokemon[29] = {
            pokemonId: 29,
            baseAttack: 100
        };
        moveInfo[131].availableToPokemon[32] = {
            pokemonId: 32,
            baseAttack: 110
        };
        moveInfo[131].availableToPokemon[35] = {
            pokemonId: 35,
            baseAttack: 116
        };
        moveInfo[131].availableToPokemon[37] = {
            pokemonId: 37,
            baseAttack: 106
        };
        moveInfo[131].availableToPokemon[39] = {
            pokemonId: 39,
            baseAttack: 98
        };
        moveInfo[131].availableToPokemon[52] = {
            pokemonId: 52,
            baseAttack: 104
        };
        moveInfo[131].availableToPokemon[58] = {
            pokemonId: 58,
            baseAttack: 156
        };
        moveInfo[131].availableToPokemon[60] = {
            pokemonId: 60,
            baseAttack: 108
        };
        moveInfo[131].availableToPokemon[133] = {
            pokemonId: 133,
            baseAttack: 114
        };
        moveInfo[131].availableToPokemon[143] = {
            pokemonId: 143,
            baseAttack: 180
        };
        moveInfo[133] = {
            moveId: 133,
            name: "Struggle",
            type: MoveType.ChargeMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 8.85,
            damagePerSecondWithStab: 11.06,
            energyPerSecond: 0.00,
            chargeEnergy: 5,
            dodgeWindow: 0.7,
            cooldown: 1.70
        };
        moveInfo[133].availableToPokemon[10] = {
            pokemonId: 10,
            baseAttack: 62
        };
        moveInfo[133].availableToPokemon[11] = {
            pokemonId: 11,
            baseAttack: 56
        };
        moveInfo[133].availableToPokemon[13] = {
            pokemonId: 13,
            baseAttack: 68
        };
        moveInfo[133].availableToPokemon[14] = {
            pokemonId: 14,
            baseAttack: 62
        };
        moveInfo[133].availableToPokemon[129] = {
            pokemonId: 129,
            baseAttack: 42
        };
        moveInfo[133].availableToPokemon[132] = {
            pokemonId: 132,
            baseAttack: 110
        };
        moveInfo[200] = {
            moveId: 200,
            name: "Fury Cutter",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 3,
            damageWithStab: 3,
            damagePerSecond: 7.50,
            damagePerSecondWithStab: 9.38,
            damagePerSecondDefensive: 1.25,
            energyPerSecond: 15.00,
            cooldown: 0.40
        };
        moveInfo[200].availableToPokemon[34] = {
            pokemonId: 34,
            baseAttack: 204
        };
        moveInfo[200].availableToPokemon[47] = {
            pokemonId: 47,
            baseAttack: 162
        };
        moveInfo[200].availableToPokemon[83] = {
            pokemonId: 83,
            baseAttack: 138
        };
        moveInfo[200].availableToPokemon[123] = {
            pokemonId: 123,
            baseAttack: 176
        };
        moveInfo[200].availableToPokemon[127] = {
            pokemonId: 127,
            baseAttack: 184
        };
        moveInfo[200].availableToPokemon[141] = {
            pokemonId: 141,
            baseAttack: 190
        };
        moveInfo[201] = {
            moveId: 201,
            name: "Bug Bite",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Bug,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 2.04,
            energyPerSecond: 15.56,
            cooldown: 0.45
        };
        moveInfo[201].availableToPokemon[10] = {
            pokemonId: 10,
            baseAttack: 62
        };
        moveInfo[201].availableToPokemon[11] = {
            pokemonId: 11,
            baseAttack: 56
        };
        moveInfo[201].availableToPokemon[12] = {
            pokemonId: 12,
            baseAttack: 144
        };
        moveInfo[201].availableToPokemon[13] = {
            pokemonId: 13,
            baseAttack: 68
        };
        moveInfo[201].availableToPokemon[14] = {
            pokemonId: 14,
            baseAttack: 62
        };
        moveInfo[201].availableToPokemon[15] = {
            pokemonId: 15,
            baseAttack: 144
        };
        moveInfo[201].availableToPokemon[46] = {
            pokemonId: 46,
            baseAttack: 122
        };
        moveInfo[201].availableToPokemon[47] = {
            pokemonId: 47,
            baseAttack: 162
        };
        moveInfo[201].availableToPokemon[48] = {
            pokemonId: 48,
            baseAttack: 108
        };
        moveInfo[201].availableToPokemon[49] = {
            pokemonId: 49,
            baseAttack: 172
        };
        moveInfo[203] = {
            moveId: 203,
            name: "Sucker Punch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.59,
            energyPerSecond: 12.86,
            cooldown: 0.70
        };
        moveInfo[203].availableToPokemon[51] = {
            pokemonId: 51,
            baseAttack: 148
        };
        moveInfo[203].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[203].availableToPokemon[94] = {
            pokemonId: 94,
            baseAttack: 204
        };
        moveInfo[204] = {
            moveId: 204,
            name: "Dragon Breath",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dragon,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[204].availableToPokemon[117] = {
            pokemonId: 117,
            baseAttack: 176
        };
        moveInfo[204].availableToPokemon[130] = {
            pokemonId: 130,
            baseAttack: 192
        };
        moveInfo[204].availableToPokemon[147] = {
            pokemonId: 147,
            baseAttack: 128
        };
        moveInfo[204].availableToPokemon[148] = {
            pokemonId: 148,
            baseAttack: 170
        };
        moveInfo[204].availableToPokemon[149] = {
            pokemonId: 149,
            baseAttack: 250
        };
        moveInfo[205] = {
            moveId: 205,
            name: "Thunder Shock",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 1.92,
            energyPerSecond: 13.33,
            cooldown: 0.60
        };
        moveInfo[205].availableToPokemon[25] = {
            pokemonId: 25,
            baseAttack: 124
        };
        moveInfo[205].availableToPokemon[26] = {
            pokemonId: 26,
            baseAttack: 200
        };
        moveInfo[205].availableToPokemon[81] = {
            pokemonId: 81,
            baseAttack: 128
        };
        moveInfo[205].availableToPokemon[82] = {
            pokemonId: 82,
            baseAttack: 186
        };
        moveInfo[205].availableToPokemon[125] = {
            pokemonId: 125,
            baseAttack: 198
        };
        moveInfo[205].availableToPokemon[135] = {
            pokemonId: 135,
            baseAttack: 192
        };
        moveInfo[205].availableToPokemon[145] = {
            pokemonId: 145,
            baseAttack: 232
        };
        moveInfo[206] = {
            moveId: 206,
            name: "Spark",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Electric,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.59,
            energyPerSecond: 11.43,
            cooldown: 0.70
        };
        moveInfo[206].availableToPokemon[26] = {
            pokemonId: 26,
            baseAttack: 200
        };
        moveInfo[206].availableToPokemon[81] = {
            pokemonId: 81,
            baseAttack: 128
        };
        moveInfo[206].availableToPokemon[82] = {
            pokemonId: 82,
            baseAttack: 186
        };
        moveInfo[206].availableToPokemon[100] = {
            pokemonId: 100,
            baseAttack: 102
        };
        moveInfo[206].availableToPokemon[101] = {
            pokemonId: 101,
            baseAttack: 150
        };
        moveInfo[207] = {
            moveId: 207,
            name: "Low Kick",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 1.92,
            energyPerSecond: 11.67,
            cooldown: 0.60
        };
        moveInfo[207].availableToPokemon[57] = {
            pokemonId: 57,
            baseAttack: 178
        };
        moveInfo[207].availableToPokemon[66] = {
            pokemonId: 66,
            baseAttack: 118
        };
        moveInfo[207].availableToPokemon[67] = {
            pokemonId: 67,
            baseAttack: 154
        };
        moveInfo[207].availableToPokemon[78] = {
            pokemonId: 78,
            baseAttack: 200
        };
        moveInfo[207].availableToPokemon[106] = {
            pokemonId: 106,
            baseAttack: 148
        };
        moveInfo[207].availableToPokemon[115] = {
            pokemonId: 115,
            baseAttack: 142
        };
        moveInfo[207].availableToPokemon[125] = {
            pokemonId: 125,
            baseAttack: 198
        };
        moveInfo[208] = {
            moveId: 208,
            name: "Karate Chop",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 7.50,
            damagePerSecondWithStab: 9.38,
            damagePerSecondDefensive: 2.14,
            energyPerSecond: 10.00,
            cooldown: 0.80
        };
        moveInfo[208].availableToPokemon[56] = {
            pokemonId: 56,
            baseAttack: 122
        };
        moveInfo[208].availableToPokemon[57] = {
            pokemonId: 57,
            baseAttack: 178
        };
        moveInfo[208].availableToPokemon[66] = {
            pokemonId: 66,
            baseAttack: 118
        };
        moveInfo[208].availableToPokemon[67] = {
            pokemonId: 67,
            baseAttack: 154
        };
        moveInfo[208].availableToPokemon[68] = {
            pokemonId: 68,
            baseAttack: 198
        };
        moveInfo[208].availableToPokemon[126] = {
            pokemonId: 126,
            baseAttack: 214
        };
        moveInfo[209] = {
            moveId: 209,
            name: "Ember",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 9.52,
            damagePerSecondWithStab: 11.90,
            damagePerSecondDefensive: 3.28,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[209].availableToPokemon[4] = {
            pokemonId: 4,
            baseAttack: 128
        };
        moveInfo[209].availableToPokemon[5] = {
            pokemonId: 5,
            baseAttack: 160
        };
        moveInfo[209].availableToPokemon[6] = {
            pokemonId: 6,
            baseAttack: 212
        };
        moveInfo[209].availableToPokemon[37] = {
            pokemonId: 37,
            baseAttack: 106
        };
        moveInfo[209].availableToPokemon[38] = {
            pokemonId: 38,
            baseAttack: 176
        };
        moveInfo[209].availableToPokemon[58] = {
            pokemonId: 58,
            baseAttack: 156
        };
        moveInfo[209].availableToPokemon[77] = {
            pokemonId: 77,
            baseAttack: 168
        };
        moveInfo[209].availableToPokemon[78] = {
            pokemonId: 78,
            baseAttack: 200
        };
        moveInfo[209].availableToPokemon[126] = {
            pokemonId: 126,
            baseAttack: 214
        };
        moveInfo[209].availableToPokemon[136] = {
            pokemonId: 136,
            baseAttack: 238
        };
        moveInfo[209].availableToPokemon[146] = {
            pokemonId: 146,
            baseAttack: 242
        };
        moveInfo[210] = {
            moveId: 210,
            name: "Wing Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 9,
            damageWithStab: 9,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 3.27,
            energyPerSecond: 9.33,
            cooldown: 0.75
        };
        moveInfo[210].availableToPokemon[6] = {
            pokemonId: 6,
            baseAttack: 212
        };
        moveInfo[210].availableToPokemon[17] = {
            pokemonId: 17,
            baseAttack: 126
        };
        moveInfo[210].availableToPokemon[18] = {
            pokemonId: 18,
            baseAttack: 170
        };
        moveInfo[210].availableToPokemon[42] = {
            pokemonId: 42,
            baseAttack: 164
        };
        moveInfo[211] = {
            moveId: 211,
            name: "Peck",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Flying,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 8.70,
            damagePerSecondWithStab: 10.87,
            damagePerSecondDefensive: 3.17,
            energyPerSecond: 8.70,
            cooldown: 1.15
        };
        moveInfo[211].availableToPokemon[21] = {
            pokemonId: 21,
            baseAttack: 102
        };
        moveInfo[211].availableToPokemon[22] = {
            pokemonId: 22,
            baseAttack: 168
        };
        moveInfo[211].availableToPokemon[32] = {
            pokemonId: 32,
            baseAttack: 110
        };
        moveInfo[211].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[211].availableToPokemon[118] = {
            pokemonId: 118,
            baseAttack: 112
        };
        moveInfo[211].availableToPokemon[119] = {
            pokemonId: 119,
            baseAttack: 172
        };
        moveInfo[212] = {
            moveId: 212,
            name: "Lick",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 5,
            damageWithStab: 5,
            damagePerSecond: 10.00,
            damagePerSecondWithStab: 12.50,
            damagePerSecondDefensive: 2.00,
            energyPerSecond: 12.00,
            cooldown: 0.50
        };
        moveInfo[212].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[212].availableToPokemon[93] = {
            pokemonId: 93,
            baseAttack: 172
        };
        moveInfo[212].availableToPokemon[108] = {
            pokemonId: 108,
            baseAttack: 126
        };
        moveInfo[212].availableToPokemon[143] = {
            pokemonId: 143,
            baseAttack: 180
        };
        moveInfo[213] = {
            moveId: 213,
            name: "Shadow Claw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ghost,
            damage: 11,
            damageWithStab: 11,
            damagePerSecond: 11.58,
            damagePerSecondWithStab: 14.47,
            damagePerSecondDefensive: 3.73,
            energyPerSecond: 8.42,
            cooldown: 0.95
        };
        moveInfo[213].availableToPokemon[92] = {
            pokemonId: 92,
            baseAttack: 136
        };
        moveInfo[213].availableToPokemon[93] = {
            pokemonId: 93,
            baseAttack: 172
        };
        moveInfo[213].availableToPokemon[94] = {
            pokemonId: 94,
            baseAttack: 204
        };
        moveInfo[214] = {
            moveId: 214,
            name: "Vine Whip",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 10.77,
            damagePerSecondWithStab: 13.46,
            damagePerSecondDefensive: 2.64,
            energyPerSecond: 10.77,
            cooldown: 0.65
        };
        moveInfo[214].availableToPokemon[1] = {
            pokemonId: 1,
            baseAttack: 126
        };
        moveInfo[214].availableToPokemon[2] = {
            pokemonId: 2,
            baseAttack: 156
        };
        moveInfo[214].availableToPokemon[3] = {
            pokemonId: 3,
            baseAttack: 198
        };
        moveInfo[214].availableToPokemon[69] = {
            pokemonId: 69,
            baseAttack: 158
        };
        moveInfo[214].availableToPokemon[114] = {
            pokemonId: 114,
            baseAttack: 164
        };
        moveInfo[215] = {
            moveId: 215,
            name: "Razor Leaf",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Grass,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.34,
            damagePerSecondWithStab: 12.93,
            damagePerSecondDefensive: 4.35,
            energyPerSecond: 8.28,
            cooldown: 1.45
        };
        moveInfo[215].availableToPokemon[2] = {
            pokemonId: 2,
            baseAttack: 156
        };
        moveInfo[215].availableToPokemon[3] = {
            pokemonId: 3,
            baseAttack: 198
        };
        moveInfo[215].availableToPokemon[43] = {
            pokemonId: 43,
            baseAttack: 134
        };
        moveInfo[215].availableToPokemon[44] = {
            pokemonId: 44,
            baseAttack: 162
        };
        moveInfo[215].availableToPokemon[45] = {
            pokemonId: 45,
            baseAttack: 202
        };
        moveInfo[215].availableToPokemon[70] = {
            pokemonId: 70,
            baseAttack: 190
        };
        moveInfo[215].availableToPokemon[71] = {
            pokemonId: 71,
            baseAttack: 222
        };
        moveInfo[216] = {
            moveId: 216,
            name: "Mud Shot",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 10.91,
            damagePerSecondWithStab: 13.64,
            damagePerSecondDefensive: 2.35,
            energyPerSecond: 12.73,
            cooldown: 0.55
        };
        moveInfo[216].availableToPokemon[27] = {
            pokemonId: 27,
            baseAttack: 90
        };
        moveInfo[216].availableToPokemon[28] = {
            pokemonId: 28,
            baseAttack: 150
        };
        moveInfo[216].availableToPokemon[50] = {
            pokemonId: 50,
            baseAttack: 108
        };
        moveInfo[216].availableToPokemon[51] = {
            pokemonId: 51,
            baseAttack: 148
        };
        moveInfo[216].availableToPokemon[60] = {
            pokemonId: 60,
            baseAttack: 108
        };
        moveInfo[216].availableToPokemon[61] = {
            pokemonId: 61,
            baseAttack: 132
        };
        moveInfo[216].availableToPokemon[62] = {
            pokemonId: 62,
            baseAttack: 180
        };
        moveInfo[216].availableToPokemon[75] = {
            pokemonId: 75,
            baseAttack: 142
        };
        moveInfo[216].availableToPokemon[76] = {
            pokemonId: 76,
            baseAttack: 176
        };
        moveInfo[216].availableToPokemon[98] = {
            pokemonId: 98,
            baseAttack: 116
        };
        moveInfo[216].availableToPokemon[99] = {
            pokemonId: 99,
            baseAttack: 178
        };
        moveInfo[216].availableToPokemon[118] = {
            pokemonId: 118,
            baseAttack: 112
        };
        moveInfo[216].availableToPokemon[138] = {
            pokemonId: 138,
            baseAttack: 132
        };
        moveInfo[216].availableToPokemon[140] = {
            pokemonId: 140,
            baseAttack: 148
        };
        moveInfo[216].availableToPokemon[141] = {
            pokemonId: 141,
            baseAttack: 190
        };
        moveInfo[217] = {
            moveId: 217,
            name: "Ice Shard",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.71,
            damagePerSecondWithStab: 13.39,
            damagePerSecondDefensive: 4.41,
            energyPerSecond: 8.57,
            cooldown: 1.40
        };
        moveInfo[217].availableToPokemon[86] = {
            pokemonId: 86,
            baseAttack: 104
        };
        moveInfo[217].availableToPokemon[87] = {
            pokemonId: 87,
            baseAttack: 156
        };
        moveInfo[217].availableToPokemon[90] = {
            pokemonId: 90,
            baseAttack: 120
        };
        moveInfo[217].availableToPokemon[91] = {
            pokemonId: 91,
            baseAttack: 196
        };
        moveInfo[217].availableToPokemon[131] = {
            pokemonId: 131,
            baseAttack: 186
        };
        moveInfo[218] = {
            moveId: 218,
            name: "Frost Breath",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ice,
            damage: 9,
            damageWithStab: 9,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 3.20,
            energyPerSecond: 8.64,
            cooldown: 0.81
        };
        moveInfo[218].availableToPokemon[87] = {
            pokemonId: 87,
            baseAttack: 156
        };
        moveInfo[218].availableToPokemon[91] = {
            pokemonId: 91,
            baseAttack: 196
        };
        moveInfo[218].availableToPokemon[124] = {
            pokemonId: 124,
            baseAttack: 172
        };
        moveInfo[218].availableToPokemon[131] = {
            pokemonId: 131,
            baseAttack: 186
        };
        moveInfo[218].availableToPokemon[144] = {
            pokemonId: 144,
            baseAttack: 198
        };
        moveInfo[219] = {
            moveId: 219,
            name: "Quick Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 7.52,
            damagePerSecondWithStab: 9.40,
            damagePerSecondDefensive: 3.00,
            energyPerSecond: 9.02,
            cooldown: 1.33
        };
        moveInfo[219].availableToPokemon[16] = {
            pokemonId: 16,
            baseAttack: 94
        };
        moveInfo[219].availableToPokemon[19] = {
            pokemonId: 19,
            baseAttack: 92
        };
        moveInfo[219].availableToPokemon[20] = {
            pokemonId: 20,
            baseAttack: 146
        };
        moveInfo[219].availableToPokemon[21] = {
            pokemonId: 21,
            baseAttack: 102
        };
        moveInfo[219].availableToPokemon[25] = {
            pokemonId: 25,
            baseAttack: 124
        };
        moveInfo[219].availableToPokemon[37] = {
            pokemonId: 37,
            baseAttack: 106
        };
        moveInfo[219].availableToPokemon[41] = {
            pokemonId: 41,
            baseAttack: 88
        };
        moveInfo[219].availableToPokemon[84] = {
            pokemonId: 84,
            baseAttack: 126
        };
        moveInfo[219].availableToPokemon[120] = {
            pokemonId: 120,
            baseAttack: 130
        };
        moveInfo[219].availableToPokemon[121] = {
            pokemonId: 121,
            baseAttack: 194
        };
        moveInfo[219].availableToPokemon[133] = {
            pokemonId: 133,
            baseAttack: 114
        };
        moveInfo[219].availableToPokemon[137] = {
            pokemonId: 137,
            baseAttack: 156
        };
        moveInfo[220] = {
            moveId: 220,
            name: "Scratch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[220].availableToPokemon[4] = {
            pokemonId: 4,
            baseAttack: 128
        };
        moveInfo[220].availableToPokemon[5] = {
            pokemonId: 5,
            baseAttack: 160
        };
        moveInfo[220].availableToPokemon[27] = {
            pokemonId: 27,
            baseAttack: 90
        };
        moveInfo[220].availableToPokemon[46] = {
            pokemonId: 46,
            baseAttack: 122
        };
        moveInfo[220].availableToPokemon[50] = {
            pokemonId: 50,
            baseAttack: 108
        };
        moveInfo[220].availableToPokemon[52] = {
            pokemonId: 52,
            baseAttack: 104
        };
        moveInfo[220].availableToPokemon[53] = {
            pokemonId: 53,
            baseAttack: 156
        };
        moveInfo[220].availableToPokemon[56] = {
            pokemonId: 56,
            baseAttack: 122
        };
        moveInfo[220].availableToPokemon[140] = {
            pokemonId: 140,
            baseAttack: 148
        };
        moveInfo[221] = {
            moveId: 221,
            name: "Tackle",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 10.91,
            damagePerSecondWithStab: 13.64,
            damagePerSecondDefensive: 3.87,
            energyPerSecond: 9.09,
            cooldown: 1.10
        };
        moveInfo[221].availableToPokemon[1] = {
            pokemonId: 1,
            baseAttack: 126
        };
        moveInfo[221].availableToPokemon[7] = {
            pokemonId: 7,
            baseAttack: 112
        };
        moveInfo[221].availableToPokemon[10] = {
            pokemonId: 10,
            baseAttack: 62
        };
        moveInfo[221].availableToPokemon[11] = {
            pokemonId: 11,
            baseAttack: 56
        };
        moveInfo[221].availableToPokemon[16] = {
            pokemonId: 16,
            baseAttack: 94
        };
        moveInfo[221].availableToPokemon[19] = {
            pokemonId: 19,
            baseAttack: 92
        };
        moveInfo[221].availableToPokemon[74] = {
            pokemonId: 74,
            baseAttack: 106
        };
        moveInfo[221].availableToPokemon[77] = {
            pokemonId: 77,
            baseAttack: 168
        };
        moveInfo[221].availableToPokemon[90] = {
            pokemonId: 90,
            baseAttack: 120
        };
        moveInfo[221].availableToPokemon[95] = {
            pokemonId: 95,
            baseAttack: 90
        };
        moveInfo[221].availableToPokemon[100] = {
            pokemonId: 100,
            baseAttack: 102
        };
        moveInfo[221].availableToPokemon[101] = {
            pokemonId: 101,
            baseAttack: 150
        };
        moveInfo[221].availableToPokemon[109] = {
            pokemonId: 109,
            baseAttack: 136
        };
        moveInfo[221].availableToPokemon[110] = {
            pokemonId: 110,
            baseAttack: 190
        };
        moveInfo[221].availableToPokemon[128] = {
            pokemonId: 128,
            baseAttack: 148
        };
        moveInfo[221].availableToPokemon[133] = {
            pokemonId: 133,
            baseAttack: 114
        };
        moveInfo[221].availableToPokemon[137] = {
            pokemonId: 137,
            baseAttack: 156
        };
        moveInfo[222] = {
            moveId: 222,
            name: "Pound",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Normal,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 12.96,
            damagePerSecondWithStab: 16.20,
            damagePerSecondDefensive: 2.76,
            energyPerSecond: 12.96,
            cooldown: 0.54
        };
        moveInfo[222].availableToPokemon[35] = {
            pokemonId: 35,
            baseAttack: 116
        };
        moveInfo[222].availableToPokemon[36] = {
            pokemonId: 36,
            baseAttack: 178
        };
        moveInfo[222].availableToPokemon[39] = {
            pokemonId: 39,
            baseAttack: 98
        };
        moveInfo[222].availableToPokemon[40] = {
            pokemonId: 40,
            baseAttack: 168
        };
        moveInfo[222].availableToPokemon[96] = {
            pokemonId: 96,
            baseAttack: 104
        };
        moveInfo[222].availableToPokemon[113] = {
            pokemonId: 113,
            baseAttack: 40
        };
        moveInfo[222].availableToPokemon[124] = {
            pokemonId: 124,
            baseAttack: 172
        };
        moveInfo[222].availableToPokemon[132] = {
            pokemonId: 132,
            baseAttack: 110
        };
        moveInfo[222].availableToPokemon[151] = {
            pokemonId: 151,
            baseAttack: 220
        };
        moveInfo[224] = {
            moveId: 224,
            name: "Poison Jab",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.43,
            damagePerSecondWithStab: 14.29,
            damagePerSecondDefensive: 3.93,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[224].availableToPokemon[14] = {
            pokemonId: 14,
            baseAttack: 62
        };
        moveInfo[224].availableToPokemon[15] = {
            pokemonId: 15,
            baseAttack: 144
        };
        moveInfo[224].availableToPokemon[31] = {
            pokemonId: 31,
            baseAttack: 184
        };
        moveInfo[224].availableToPokemon[33] = {
            pokemonId: 33,
            baseAttack: 142
        };
        moveInfo[224].availableToPokemon[34] = {
            pokemonId: 34,
            baseAttack: 204
        };
        moveInfo[224].availableToPokemon[73] = {
            pokemonId: 73,
            baseAttack: 170
        };
        moveInfo[224].availableToPokemon[89] = {
            pokemonId: 89,
            baseAttack: 180
        };
        moveInfo[224].availableToPokemon[119] = {
            pokemonId: 119,
            baseAttack: 172
        };
        moveInfo[225] = {
            moveId: 225,
            name: "Acid",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 9.52,
            damagePerSecondWithStab: 11.90,
            damagePerSecondDefensive: 3.28,
            energyPerSecond: 9.52,
            cooldown: 1.05
        };
        moveInfo[225].availableToPokemon[23] = {
            pokemonId: 23,
            baseAttack: 112
        };
        moveInfo[225].availableToPokemon[24] = {
            pokemonId: 24,
            baseAttack: 166
        };
        moveInfo[225].availableToPokemon[43] = {
            pokemonId: 43,
            baseAttack: 134
        };
        moveInfo[225].availableToPokemon[44] = {
            pokemonId: 44,
            baseAttack: 162
        };
        moveInfo[225].availableToPokemon[45] = {
            pokemonId: 45,
            baseAttack: 202
        };
        moveInfo[225].availableToPokemon[69] = {
            pokemonId: 69,
            baseAttack: 158
        };
        moveInfo[225].availableToPokemon[70] = {
            pokemonId: 70,
            baseAttack: 190
        };
        moveInfo[225].availableToPokemon[71] = {
            pokemonId: 71,
            baseAttack: 222
        };
        moveInfo[225].availableToPokemon[73] = {
            pokemonId: 73,
            baseAttack: 170
        };
        moveInfo[225].availableToPokemon[88] = {
            pokemonId: 88,
            baseAttack: 124
        };
        moveInfo[225].availableToPokemon[89] = {
            pokemonId: 89,
            baseAttack: 180
        };
        moveInfo[225].availableToPokemon[109] = {
            pokemonId: 109,
            baseAttack: 136
        };
        moveInfo[225].availableToPokemon[110] = {
            pokemonId: 110,
            baseAttack: 190
        };
        moveInfo[226] = {
            moveId: 226,
            name: "Psycho Cut",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 7,
            damageWithStab: 7,
            damagePerSecond: 12.28,
            damagePerSecondWithStab: 15.35,
            damagePerSecondDefensive: 2.72,
            energyPerSecond: 12.28,
            cooldown: 0.57
        };
        moveInfo[226].availableToPokemon[64] = {
            pokemonId: 64,
            baseAttack: 150
        };
        moveInfo[226].availableToPokemon[65] = {
            pokemonId: 65,
            baseAttack: 186
        };
        moveInfo[226].availableToPokemon[150] = {
            pokemonId: 150,
            baseAttack: 284
        };
        moveInfo[227] = {
            moveId: 227,
            name: "Rock Throw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Rock,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 8.82,
            damagePerSecondWithStab: 11.03,
            damagePerSecondDefensive: 3.57,
            energyPerSecond: 11.03,
            cooldown: 1.36
        };
        moveInfo[227].availableToPokemon[74] = {
            pokemonId: 74,
            baseAttack: 106
        };
        moveInfo[227].availableToPokemon[75] = {
            pokemonId: 75,
            baseAttack: 142
        };
        moveInfo[227].availableToPokemon[76] = {
            pokemonId: 76,
            baseAttack: 176
        };
        moveInfo[227].availableToPokemon[95] = {
            pokemonId: 95,
            baseAttack: 90
        };
        moveInfo[227].availableToPokemon[139] = {
            pokemonId: 139,
            baseAttack: 180
        };
        moveInfo[228] = {
            moveId: 228,
            name: "Metal Claw",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 8,
            damageWithStab: 8,
            damagePerSecond: 12.70,
            damagePerSecondWithStab: 15.87,
            damagePerSecondDefensive: 3.04,
            energyPerSecond: 11.11,
            cooldown: 0.63
        };
        moveInfo[228].availableToPokemon[28] = {
            pokemonId: 28,
            baseAttack: 150
        };
        moveInfo[228].availableToPokemon[99] = {
            pokemonId: 99,
            baseAttack: 178
        };
        moveInfo[229] = {
            moveId: 229,
            name: "Bullet Punch",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 8.33,
            damagePerSecondWithStab: 10.42,
            damagePerSecondDefensive: 3.13,
            energyPerSecond: 8.33,
            cooldown: 1.20
        };
        moveInfo[229].availableToPokemon[68] = {
            pokemonId: 68,
            baseAttack: 198
        };
        moveInfo[229].availableToPokemon[107] = {
            pokemonId: 107,
            baseAttack: 138
        };
        moveInfo[230] = {
            moveId: 230,
            name: "Water Gun",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 12.00,
            damagePerSecondWithStab: 15.00,
            damagePerSecondDefensive: 2.40,
            energyPerSecond: 14.00,
            cooldown: 0.50
        };
        moveInfo[230].availableToPokemon[8] = {
            pokemonId: 8,
            baseAttack: 144
        };
        moveInfo[230].availableToPokemon[9] = {
            pokemonId: 9,
            baseAttack: 186
        };
        moveInfo[230].availableToPokemon[54] = {
            pokemonId: 54,
            baseAttack: 132
        };
        moveInfo[230].availableToPokemon[55] = {
            pokemonId: 55,
            baseAttack: 194
        };
        moveInfo[230].availableToPokemon[79] = {
            pokemonId: 79,
            baseAttack: 110
        };
        moveInfo[230].availableToPokemon[80] = {
            pokemonId: 80,
            baseAttack: 184
        };
        moveInfo[230].availableToPokemon[86] = {
            pokemonId: 86,
            baseAttack: 104
        };
        moveInfo[230].availableToPokemon[116] = {
            pokemonId: 116,
            baseAttack: 122
        };
        moveInfo[230].availableToPokemon[117] = {
            pokemonId: 117,
            baseAttack: 176
        };
        moveInfo[230].availableToPokemon[120] = {
            pokemonId: 120,
            baseAttack: 130
        };
        moveInfo[230].availableToPokemon[121] = {
            pokemonId: 121,
            baseAttack: 194
        };
        moveInfo[230].availableToPokemon[134] = {
            pokemonId: 134,
            baseAttack: 186
        };
        moveInfo[230].availableToPokemon[138] = {
            pokemonId: 138,
            baseAttack: 132
        };
        moveInfo[230].availableToPokemon[139] = {
            pokemonId: 139,
            baseAttack: 180
        };
        moveInfo[231] = {
            moveId: 231,
            name: "Splash",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 0,
            damageWithStab: 0,
            damagePerSecond: 0.00,
            damagePerSecondWithStab: 0.00,
            damagePerSecondDefensive: 0.00,
            energyPerSecond: 0.00,
            cooldown: 1.23
        };
        moveInfo[231].availableToPokemon[129] = {
            pokemonId: 129,
            baseAttack: 42
        };
        moveInfo[233] = {
            moveId: 233,
            name: "Mud Slap",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Ground,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 11.11,
            damagePerSecondWithStab: 13.89,
            damagePerSecondDefensive: 4.48,
            energyPerSecond: 8.89,
            cooldown: 1.35
        };
        moveInfo[233].availableToPokemon[88] = {
            pokemonId: 88,
            baseAttack: 124
        };
        moveInfo[233].availableToPokemon[104] = {
            pokemonId: 104,
            baseAttack: 102
        };
        moveInfo[233].availableToPokemon[105] = {
            pokemonId: 105,
            baseAttack: 140
        };
        moveInfo[233].availableToPokemon[111] = {
            pokemonId: 111,
            baseAttack: 110
        };
        moveInfo[233].availableToPokemon[112] = {
            pokemonId: 112,
            baseAttack: 166
        };
        moveInfo[233].availableToPokemon[115] = {
            pokemonId: 115,
            baseAttack: 142
        };
        moveInfo[234] = {
            moveId: 234,
            name: "Zen Headbutt",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.43,
            damagePerSecondWithStab: 14.29,
            damagePerSecondDefensive: 3.93,
            energyPerSecond: 8.57,
            cooldown: 1.05
        };
        moveInfo[234].availableToPokemon[35] = {
            pokemonId: 35,
            baseAttack: 116
        };
        moveInfo[234].availableToPokemon[36] = {
            pokemonId: 36,
            baseAttack: 178
        };
        moveInfo[234].availableToPokemon[54] = {
            pokemonId: 54,
            baseAttack: 132
        };
        moveInfo[234].availableToPokemon[63] = {
            pokemonId: 63,
            baseAttack: 110
        };
        moveInfo[234].availableToPokemon[97] = {
            pokemonId: 97,
            baseAttack: 162
        };
        moveInfo[234].availableToPokemon[103] = {
            pokemonId: 103,
            baseAttack: 232
        };
        moveInfo[234].availableToPokemon[108] = {
            pokemonId: 108,
            baseAttack: 126
        };
        moveInfo[234].availableToPokemon[113] = {
            pokemonId: 113,
            baseAttack: 40
        };
        moveInfo[234].availableToPokemon[122] = {
            pokemonId: 122,
            baseAttack: 154
        };
        moveInfo[234].availableToPokemon[128] = {
            pokemonId: 128,
            baseAttack: 148
        };
        moveInfo[234].availableToPokemon[143] = {
            pokemonId: 143,
            baseAttack: 180
        };
        moveInfo[235] = {
            moveId: 235,
            name: "Confusion",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Psychic,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 9.93,
            damagePerSecondWithStab: 12.42,
            damagePerSecondDefensive: 4.27,
            energyPerSecond: 9.27,
            cooldown: 1.51
        };
        moveInfo[235].availableToPokemon[12] = {
            pokemonId: 12,
            baseAttack: 144
        };
        moveInfo[235].availableToPokemon[48] = {
            pokemonId: 48,
            baseAttack: 108
        };
        moveInfo[235].availableToPokemon[49] = {
            pokemonId: 49,
            baseAttack: 172
        };
        moveInfo[235].availableToPokemon[55] = {
            pokemonId: 55,
            baseAttack: 194
        };
        moveInfo[235].availableToPokemon[64] = {
            pokemonId: 64,
            baseAttack: 150
        };
        moveInfo[235].availableToPokemon[65] = {
            pokemonId: 65,
            baseAttack: 186
        };
        moveInfo[235].availableToPokemon[79] = {
            pokemonId: 79,
            baseAttack: 110
        };
        moveInfo[235].availableToPokemon[80] = {
            pokemonId: 80,
            baseAttack: 184
        };
        moveInfo[235].availableToPokemon[96] = {
            pokemonId: 96,
            baseAttack: 104
        };
        moveInfo[235].availableToPokemon[97] = {
            pokemonId: 97,
            baseAttack: 162
        };
        moveInfo[235].availableToPokemon[102] = {
            pokemonId: 102,
            baseAttack: 110
        };
        moveInfo[235].availableToPokemon[103] = {
            pokemonId: 103,
            baseAttack: 232
        };
        moveInfo[235].availableToPokemon[122] = {
            pokemonId: 122,
            baseAttack: 154
        };
        moveInfo[235].availableToPokemon[150] = {
            pokemonId: 150,
            baseAttack: 284
        };
        moveInfo[236] = {
            moveId: 236,
            name: "Poison Sting",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Poison,
            damage: 6,
            damageWithStab: 6,
            damagePerSecond: 10.43,
            damagePerSecondWithStab: 13.04,
            damagePerSecondDefensive: 2.33,
            energyPerSecond: 13.91,
            cooldown: 0.58
        };
        moveInfo[236].availableToPokemon[13] = {
            pokemonId: 13,
            baseAttack: 68
        };
        moveInfo[236].availableToPokemon[23] = {
            pokemonId: 23,
            baseAttack: 112
        };
        moveInfo[236].availableToPokemon[29] = {
            pokemonId: 29,
            baseAttack: 100
        };
        moveInfo[236].availableToPokemon[30] = {
            pokemonId: 30,
            baseAttack: 132
        };
        moveInfo[236].availableToPokemon[32] = {
            pokemonId: 32,
            baseAttack: 110
        };
        moveInfo[236].availableToPokemon[33] = {
            pokemonId: 33,
            baseAttack: 142
        };
        moveInfo[236].availableToPokemon[72] = {
            pokemonId: 72,
            baseAttack: 106
        };
        moveInfo[237] = {
            moveId: 237,
            name: "Bubble",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Water,
            damage: 25,
            damageWithStab: 25,
            damagePerSecond: 10.87,
            damagePerSecondWithStab: 13.59,
            damagePerSecondDefensive: 5.81,
            energyPerSecond: 10.87,
            cooldown: 2.30
        };
        moveInfo[237].availableToPokemon[7] = {
            pokemonId: 7,
            baseAttack: 112
        };
        moveInfo[237].availableToPokemon[60] = {
            pokemonId: 60,
            baseAttack: 108
        };
        moveInfo[237].availableToPokemon[61] = {
            pokemonId: 61,
            baseAttack: 132
        };
        moveInfo[237].availableToPokemon[62] = {
            pokemonId: 62,
            baseAttack: 180
        };
        moveInfo[237].availableToPokemon[72] = {
            pokemonId: 72,
            baseAttack: 106
        };
        moveInfo[237].availableToPokemon[98] = {
            pokemonId: 98,
            baseAttack: 116
        };
        moveInfo[237].availableToPokemon[116] = {
            pokemonId: 116,
            baseAttack: 122
        };
        moveInfo[238] = {
            moveId: 238,
            name: "Feint Attack",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Dark,
            damage: 12,
            damageWithStab: 12,
            damagePerSecond: 11.54,
            damagePerSecondWithStab: 14.42,
            damagePerSecondDefensive: 3.95,
            energyPerSecond: 9.62,
            cooldown: 1.04
        };
        moveInfo[238].availableToPokemon[38] = {
            pokemonId: 38,
            baseAttack: 176
        };
        moveInfo[238].availableToPokemon[39] = {
            pokemonId: 39,
            baseAttack: 98
        };
        moveInfo[238].availableToPokemon[40] = {
            pokemonId: 40,
            baseAttack: 168
        };
        moveInfo[238].availableToPokemon[53] = {
            pokemonId: 53,
            baseAttack: 156
        };
        moveInfo[238].availableToPokemon[85] = {
            pokemonId: 85,
            baseAttack: 182
        };
        moveInfo[239] = {
            moveId: 239,
            name: "Steel Wing",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Steel,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 11.28,
            damagePerSecondWithStab: 14.10,
            damagePerSecondDefensive: 4.50,
            energyPerSecond: 9.02,
            cooldown: 1.33
        };
        moveInfo[239].availableToPokemon[17] = {
            pokemonId: 17,
            baseAttack: 126
        };
        moveInfo[239].availableToPokemon[18] = {
            pokemonId: 18,
            baseAttack: 170
        };
        moveInfo[239].availableToPokemon[22] = {
            pokemonId: 22,
            baseAttack: 168
        };
        moveInfo[239].availableToPokemon[85] = {
            pokemonId: 85,
            baseAttack: 182
        };
        moveInfo[239].availableToPokemon[123] = {
            pokemonId: 123,
            baseAttack: 176
        };
        moveInfo[239].availableToPokemon[142] = {
            pokemonId: 142,
            baseAttack: 182
        };
        moveInfo[239].availableToPokemon[149] = {
            pokemonId: 149,
            baseAttack: 250
        };
        moveInfo[240] = {
            moveId: 240,
            name: "Fire Fang",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fire,
            damage: 10,
            damageWithStab: 10,
            damagePerSecond: 11.90,
            damagePerSecondWithStab: 14.88,
            damagePerSecondDefensive: 3.52,
            energyPerSecond: 9.52,
            cooldown: 0.84
        };
        moveInfo[240].availableToPokemon[59] = {
            pokemonId: 59,
            baseAttack: 230
        };
        moveInfo[241] = {
            moveId: 241,
            name: "Rock Smash",
            type: MoveType.QuickMove,
            availableToPokemon: [],
            element: PokeElement.Fighting,
            damage: 15,
            damageWithStab: 15,
            damagePerSecond: 10.64,
            damagePerSecondWithStab: 13.30,
            damagePerSecondDefensive: 4.40,
            energyPerSecond: 8.51,
            cooldown: 1.41
        };
        moveInfo[241].availableToPokemon[104] = {
            pokemonId: 104,
            baseAttack: 102
        };
        moveInfo[241].availableToPokemon[105] = {
            pokemonId: 105,
            baseAttack: 140
        };
        moveInfo[241].availableToPokemon[106] = {
            pokemonId: 106,
            baseAttack: 148
        };
        moveInfo[241].availableToPokemon[107] = {
            pokemonId: 107,
            baseAttack: 138
        };
        moveInfo[241].availableToPokemon[111] = {
            pokemonId: 111,
            baseAttack: 110
        };
        moveInfo[241].availableToPokemon[112] = {
            pokemonId: 112,
            baseAttack: 166
        };
        moveInfo[241].availableToPokemon[127] = {
            pokemonId: 127,
            baseAttack: 184
        };
        StaticInfo.moveInfo = moveInfo;
        var pokemonInfo = [];
        pokemonInfo[0] =
            {
                elements: [],
                evolvesInto: []
            };
        pokemonInfo[1] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [2]
        };
        pokemonInfo[2] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [3]
        };
        pokemonInfo[3] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[4] = {
            elements: [PokeElement.Fire],
            evolvesInto: [5]
        };
        pokemonInfo[5] = {
            elements: [PokeElement.Fire],
            evolvesInto: [6]
        };
        pokemonInfo[6] = {
            elements: [PokeElement.Fire, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[7] = {
            elements: [PokeElement.Water],
            evolvesInto: [8]
        };
        pokemonInfo[8] = {
            elements: [PokeElement.Water],
            evolvesInto: [9]
        };
        pokemonInfo[9] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[10] = {
            elements: [PokeElement.Bug],
            evolvesInto: [11]
        };
        pokemonInfo[11] = {
            elements: [PokeElement.Bug],
            evolvesInto: [12]
        };
        pokemonInfo[12] = {
            elements: [PokeElement.Bug, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[13] = {
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [14]
        };
        pokemonInfo[14] = {
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [15]
        };
        pokemonInfo[15] = {
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[16] = {
            elements: [PokeElement.Normal],
            evolvesInto: [17]
        };
        pokemonInfo[17] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [18]
        };
        pokemonInfo[18] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[19] = {
            elements: [PokeElement.Normal],
            evolvesInto: [20]
        };
        pokemonInfo[20] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[21] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [22]
        };
        pokemonInfo[22] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[23] = {
            elements: [PokeElement.Poison],
            evolvesInto: [24]
        };
        pokemonInfo[24] = {
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[25] = {
            elements: [PokeElement.Electric],
            evolvesInto: [26]
        };
        pokemonInfo[26] = {
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[27] = {
            elements: [PokeElement.Ground],
            evolvesInto: [28]
        };
        pokemonInfo[28] = {
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[29] = {
            elements: [PokeElement.Poison],
            evolvesInto: [30]
        };
        pokemonInfo[30] = {
            elements: [PokeElement.Poison],
            evolvesInto: [31]
        };
        pokemonInfo[31] = {
            elements: [PokeElement.Poison, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[32] = {
            elements: [PokeElement.Poison],
            evolvesInto: [33]
        };
        pokemonInfo[33] = {
            elements: [PokeElement.Poison],
            evolvesInto: [34]
        };
        pokemonInfo[34] = {
            elements: [PokeElement.Poison, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[35] = {
            elements: [PokeElement.Fairy],
            evolvesInto: [36]
        };
        pokemonInfo[36] = {
            elements: [PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[37] = {
            elements: [PokeElement.Fire],
            evolvesInto: [38]
        };
        pokemonInfo[38] = {
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[39] = {
            elements: [PokeElement.Normal, PokeElement.Fairy],
            evolvesInto: [40]
        };
        pokemonInfo[40] = {
            elements: [PokeElement.Normal, PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[41] = {
            elements: [PokeElement.Poison, PokeElement.Flying],
            evolvesInto: [42]
        };
        pokemonInfo[42] = {
            elements: [PokeElement.Poison, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[43] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [44]
        };
        pokemonInfo[44] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [45]
        };
        pokemonInfo[45] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[46] = {
            elements: [PokeElement.Bug, PokeElement.Grass],
            evolvesInto: [47]
        };
        pokemonInfo[47] = {
            elements: [PokeElement.Bug, PokeElement.Grass],
            evolvesInto: []
        };
        pokemonInfo[48] = {
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: [49]
        };
        pokemonInfo[49] = {
            elements: [PokeElement.Bug, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[50] = {
            elements: [PokeElement.Ground],
            evolvesInto: [51]
        };
        pokemonInfo[51] = {
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[52] = {
            elements: [PokeElement.Normal],
            evolvesInto: [53]
        };
        pokemonInfo[53] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[54] = {
            elements: [PokeElement.Water],
            evolvesInto: [55]
        };
        pokemonInfo[55] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[56] = {
            elements: [PokeElement.Fighting],
            evolvesInto: [57]
        };
        pokemonInfo[57] = {
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[58] = {
            elements: [PokeElement.Fire],
            evolvesInto: [59]
        };
        pokemonInfo[59] = {
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[60] = {
            elements: [PokeElement.Water],
            evolvesInto: [61]
        };
        pokemonInfo[61] = {
            elements: [PokeElement.Water],
            evolvesInto: [62]
        };
        pokemonInfo[62] = {
            elements: [PokeElement.Water, PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[63] = {
            elements: [PokeElement.Psychic],
            evolvesInto: [64]
        };
        pokemonInfo[64] = {
            elements: [PokeElement.Psychic],
            evolvesInto: [65]
        };
        pokemonInfo[65] = {
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[66] = {
            elements: [PokeElement.Fighting],
            evolvesInto: [67]
        };
        pokemonInfo[67] = {
            elements: [PokeElement.Fighting],
            evolvesInto: [68]
        };
        pokemonInfo[68] = {
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[69] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [70]
        };
        pokemonInfo[70] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: [71]
        };
        pokemonInfo[71] = {
            elements: [PokeElement.Grass, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[72] = {
            elements: [PokeElement.Water, PokeElement.Poison],
            evolvesInto: [73]
        };
        pokemonInfo[73] = {
            elements: [PokeElement.Water, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[74] = {
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: [75]
        };
        pokemonInfo[75] = {
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: [76]
        };
        pokemonInfo[76] = {
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[77] = {
            elements: [PokeElement.Fire],
            evolvesInto: [78]
        };
        pokemonInfo[78] = {
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[79] = {
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: [80]
        };
        pokemonInfo[80] = {
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[81] = {
            elements: [PokeElement.Electric, PokeElement.Steel],
            evolvesInto: [82]
        };
        pokemonInfo[82] = {
            elements: [PokeElement.Electric, PokeElement.Steel],
            evolvesInto: []
        };
        pokemonInfo[83] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[84] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: [85]
        };
        pokemonInfo[85] = {
            elements: [PokeElement.Normal, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[86] = {
            elements: [PokeElement.Water],
            evolvesInto: [87]
        };
        pokemonInfo[87] = {
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[88] = {
            elements: [PokeElement.Poison],
            evolvesInto: [89]
        };
        pokemonInfo[89] = {
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[90] = {
            elements: [PokeElement.Water],
            evolvesInto: [91]
        };
        pokemonInfo[91] = {
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[92] = {
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: [93]
        };
        pokemonInfo[93] = {
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: [94]
        };
        pokemonInfo[94] = {
            elements: [PokeElement.Ghost, PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[95] = {
            elements: [PokeElement.Rock, PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[96] = {
            elements: [PokeElement.Psychic],
            evolvesInto: [97]
        };
        pokemonInfo[97] = {
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[98] = {
            elements: [PokeElement.Water],
            evolvesInto: [99]
        };
        pokemonInfo[99] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[100] = {
            elements: [PokeElement.Electric],
            evolvesInto: [101]
        };
        pokemonInfo[101] = {
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[102] = {
            elements: [PokeElement.Grass, PokeElement.Psychic],
            evolvesInto: [103]
        };
        pokemonInfo[103] = {
            elements: [PokeElement.Grass, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[104] = {
            elements: [PokeElement.Ground],
            evolvesInto: [105]
        };
        pokemonInfo[105] = {
            elements: [PokeElement.Ground],
            evolvesInto: []
        };
        pokemonInfo[106] = {
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[107] = {
            elements: [PokeElement.Fighting],
            evolvesInto: []
        };
        pokemonInfo[108] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[109] = {
            elements: [PokeElement.Poison],
            evolvesInto: [110]
        };
        pokemonInfo[110] = {
            elements: [PokeElement.Poison],
            evolvesInto: []
        };
        pokemonInfo[111] = {
            elements: [PokeElement.Ground, PokeElement.Rock],
            evolvesInto: [112]
        };
        pokemonInfo[112] = {
            elements: [PokeElement.Ground, PokeElement.Rock],
            evolvesInto: []
        };
        pokemonInfo[113] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[114] = {
            elements: [PokeElement.Grass],
            evolvesInto: []
        };
        pokemonInfo[115] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[116] = {
            elements: [PokeElement.Water],
            evolvesInto: [117]
        };
        pokemonInfo[117] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[118] = {
            elements: [PokeElement.Water],
            evolvesInto: [119]
        };
        pokemonInfo[119] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[120] = {
            elements: [PokeElement.Water],
            evolvesInto: [121]
        };
        pokemonInfo[121] = {
            elements: [PokeElement.Water, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[122] = {
            elements: [PokeElement.Psychic, PokeElement.Fairy],
            evolvesInto: []
        };
        pokemonInfo[123] = {
            elements: [PokeElement.Bug, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[124] = {
            elements: [PokeElement.Ice, PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[125] = {
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[126] = {
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[127] = {
            elements: [PokeElement.Bug],
            evolvesInto: []
        };
        pokemonInfo[128] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[129] = {
            elements: [PokeElement.Water],
            evolvesInto: [130]
        };
        pokemonInfo[130] = {
            elements: [PokeElement.Water, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[131] = {
            elements: [PokeElement.Water, PokeElement.Ice],
            evolvesInto: []
        };
        pokemonInfo[132] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[133] = {
            elements: [PokeElement.Normal],
            evolvesInto: [134, 135, 136]
        };
        pokemonInfo[134] = {
            elements: [PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[135] = {
            elements: [PokeElement.Electric],
            evolvesInto: []
        };
        pokemonInfo[136] = {
            elements: [PokeElement.Fire],
            evolvesInto: []
        };
        pokemonInfo[137] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[138] = {
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: [139]
        };
        pokemonInfo[139] = {
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[140] = {
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: [141]
        };
        pokemonInfo[141] = {
            elements: [PokeElement.Rock, PokeElement.Water],
            evolvesInto: []
        };
        pokemonInfo[142] = {
            elements: [PokeElement.Rock, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[143] = {
            elements: [PokeElement.Normal],
            evolvesInto: []
        };
        pokemonInfo[144] = {
            elements: [PokeElement.Ice, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[145] = {
            elements: [PokeElement.Electric, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[146] = {
            elements: [PokeElement.Fire, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[147] = {
            elements: [PokeElement.Dragon],
            evolvesInto: [148]
        };
        pokemonInfo[148] = {
            elements: [PokeElement.Dragon],
            evolvesInto: [149]
        };
        pokemonInfo[149] = {
            elements: [PokeElement.Dragon, PokeElement.Flying],
            evolvesInto: []
        };
        pokemonInfo[150] = {
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        pokemonInfo[151] = {
            elements: [PokeElement.Psychic],
            evolvesInto: []
        };
        var _loop_1 = function(i) {
            var poke = pokemonInfo[i];
            poke.pokemonId = i;
            var possibleMoves = _.filter(moveInfo, function (move) {
                if (!move) {
                    return false;
                }
                var found = _.find(move.availableToPokemon, function (av) {
                    if (!av) {
                        return false;
                    }
                    var found2 = av.pokemonId === poke.pokemonId;
                    return found2;
                });
                return found;
            });
            poke.possibleMoves = _.map(possibleMoves, function (move) { return move.moveId; });
        };
        for (var i = 0; i < pokemonInfo.length; i++) {
            _loop_1(i);
        }
        StaticInfo.pokemonInfo = pokemonInfo;
    };
    return StaticInfo;
}());
var FortType;
(function (FortType) {
    FortType[FortType["Gym"] = 0] = "Gym";
    FortType[FortType["PokeStop"] = 1] = "PokeStop";
})(FortType || (FortType = {}));
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
var BotFamily;
(function (BotFamily) {
    BotFamily[BotFamily["Undetermined"] = 0] = "Undetermined";
    BotFamily[BotFamily["Necro"] = 1] = "Necro";
    BotFamily[BotFamily["PMB"] = 2] = "PMB";
})(BotFamily || (BotFamily = {}));
var BotWSClient = (function () {
    function BotWSClient() {
        var _this = this;
        this.start = function (config) {
            _this.config = config;
            var settings = _this.config.settingsService.settings;
            var url = _this.buildConnectionString(settings.clientAddress, settings.clientPort, settings.clientUseSSL);
            _this.webSocket = new WebSocket(url);
            _this.webSocket.onopen = _this.clientOnOpen;
            _this.webSocket.onmessage = _this.clientOnMessage;
            _this.webSocket.onclose = _this.clientOnClose;
            _this.webSocket.onerror = _this.clientOnError;
            _this.running = true;
        };
        this.buildConnectionString = function (address, port, useSSL) {
            var protocol = useSSL ? "wss" : "ws";
            return protocol + "://" + address + ":" + port;
        };
        this.restart = function () {
            _this.restarting = true;
            _this.stop();
        };
        this.stop = function () {
            _this.running = false;
            _this.webSocket.close();
        };
        this.clientOnOpen = function (event) {
            console.log("WebSocket connected to " + _this.webSocket.url);
            _this.verifyProfileTimeout = setTimeout(_this.verifyProfileSent, 5000);
        };
        this.verifyProfileSent = function () {
            if (!_this.profileSent) {
                console.log("Profile event not received. Reconnecting...");
                _this.restart();
            }
        };
        this.clientOnClose = function (event) {
            console.log("WebSocket closed", event);
            clearTimeout(_this.verifyProfileTimeout);
            _this.profileSent = false;
            if (_this.running) {
                setTimeout(function () {
                    _this.start(_this.config);
                }, 1000);
            }
            if (_this.restarting) {
                _this.restarting = false;
                _this.start(_this.config);
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
            if (_.includes(type, ".ProfileEvent,")) {
                if (_this.currentBotFamily === BotFamily.Undetermined) {
                    if (_.startsWith(type, "PoGo.NecroBot.")) {
                        _this.currentBotFamily = BotFamily.Necro;
                    }
                    else if (_.startsWith(type, "PoGo.PokeMobBot.")) {
                        _this.currentBotFamily = BotFamily.PMB;
                    }
                }
                var profile_1 = message.Profile;
                profile_1.Timestamp = timestamp;
                profile_1.PlayerData.PokeCoin = _this.getCurrency(message, "POKECOIN");
                profile_1.PlayerData.StarDust = _this.getCurrency(message, "STARDUST");
                _this.profileSent = true;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onProfile(profile_1); });
            }
            else if (_.includes(type, ".UpdatePositionEvent,")) {
                var mapLocation_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onUpdatePosition(mapLocation_1); });
            }
            else if (_.includes(type, ".PokeStopListEvent,")) {
                var forts_1 = message.Forts.$values;
                _.each(forts_1, function (fort) { return fort.Timestamp = timestamp; });
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokeStopList(forts_1); });
            }
            else if (_.includes(type, ".FortTargetEvent,")) {
                var fortTarget_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onFortTarget(fortTarget_1); });
            }
            else if (_.includes(type, ".FortUsedEvent,")) {
                var fortUsed_1 = message;
                fortUsed_1.ItemsList = _this.parseItemString(fortUsed_1.Items);
                _.each(_this.config.eventHandlers, function (eh) { return eh.onFortUsed(fortUsed_1); });
            }
            else if (_.includes(type, ".UseBerry,")) {
                var useBerry_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onUseBerry(useBerry_1); });
            }
            else if (_.includes(type, ".PokemonCaptureEvent,")) {
                var pokemonCapture_1 = message;
                pokemonCapture_1.IsSnipe = _this.currentlySniping;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonCapture(pokemonCapture_1); });
            }
            else if (_.includes(type, ".EvolveCountEvent,")) {
                var evolveCount_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onEvolveCount(evolveCount_1); });
            }
            else if (_.includes(type, ".PokemonEvolveEvent,")) {
                var pokemonEvolve_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonEvolve(pokemonEvolve_1); });
            }
            else if (_.includes(type, ".SnipeScanEvent,")) {
                var snipeScan_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeScan(snipeScan_1); });
            }
            else if (_.includes(type, ".SnipeModeEvent,")) {
                var snipeMode_1 = message;
                _this.currentlySniping = snipeMode_1.Active;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeMode(snipeMode_1); });
            }
            else if (_.includes(type, ".SnipeEvent,")) {
                var snipeMessage_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onSnipeMessage(snipeMessage_1); });
            }
            else if (_.includes(type, ".UpdateEvent,")) {
                var updateEvent_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onUpdate(updateEvent_1); });
            }
            else if (_.includes(type, ".WarnEvent,")) {
                var warnEvent_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onWarn(warnEvent_1); });
            }
            else if (_.includes(type, ".EggHatchedEvent,")) {
                var eggHatched_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onEggHatched(eggHatched_1); });
            }
            else if (_.includes(type, ".EggIncubatorStatusEvent,")) {
                var incubatorStatus_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onIncubatorStatus(incubatorStatus_1); });
            }
            else if (_.includes(type, ".ItemRecycledEvent,")) {
                var itemRecycle_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onItemRecycle(itemRecycle_1); });
            }
            else if (_.includes(type, ".TransferPokemonEvent,")) {
                var pokemonTransfer_1 = message;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonTransfer(pokemonTransfer_1); });
            }
            else if (_.includes(type, ".PokemonListEvent,") || _.includes(type, ".PokemonListResponce,")) {
                var originalList = void 0;
                if (_this.currentBotFamily === BotFamily.PMB) {
                    originalList = message.PokemonList.$values;
                }
                else {
                    originalList = message.Data.$values;
                }
                var pokemonList_1 = {
                    Pokemons: [],
                    Timestamp: timestamp
                };
                _.each(originalList, function (val) {
                    if (_this.currentBotFamily === BotFamily.PMB) {
                        var pokemon = val.Item1;
                        pokemon.Perfection = val.Item2;
                        pokemon.FamilyCandies = val.Item3;
                        pokemonList_1.Pokemons.push(pokemon);
                    }
                    else {
                        var pokemon = val.Base;
                        pokemon.Perfection = val.IvPerfection;
                        pokemonList_1.Pokemons.push(pokemon);
                    }
                });
                _.each(_this.config.eventHandlers, function (eh) { return eh.onPokemonList(pokemonList_1); });
            }
            else if (_.includes(type, ".EggsListEvent,") || _.includes(type, ".EggListResponce,")) {
                var eggList_1;
                if (_this.currentBotFamily === BotFamily.PMB) {
                    eggList_1 = message;
                    eggList_1.Incubators = message.Incubators.$values;
                    eggList_1.UnusedEggs = message.UnusedEggs.$values;
                }
                else {
                    eggList_1 = message.Data;
                    eggList_1.Incubators = message.Data.Incubators.$values;
                    eggList_1.UnusedEggs = message.Data.UnusedEggs.$values;
                }
                eggList_1.Timestamp = timestamp;
                _.each(_this.config.eventHandlers, function (eh) { return eh.onEggList(eggList_1); });
            }
            else if (_.includes(type, ".InventoryListEvent,") || _.includes(type, ".ItemListResponce,")) {
                var originalList = void 0;
                if (_this.currentBotFamily === BotFamily.PMB) {
                    originalList = message.Items.$values;
                }
                else {
                    originalList = message.Data.$values;
                }
                var inventoryList_1 = {
                    Items: originalList,
                    Timestamp: timestamp
                };
                _.each(_this.config.eventHandlers, function (eh) { return eh.onInventoryList(inventoryList_1); });
            }
            else if (_.includes(type, ".PlayerStatsEvent,") || _.includes(type, ".TrainerProfileResponce,")) {
                var originalStats = void 0;
                if (_this.currentBotFamily === BotFamily.PMB) {
                    originalStats = message.PlayerStats.$values[0];
                }
                else {
                    originalStats = message.Data.Stats;
                }
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
            var pmbRequest = { Command: "PokemonList" };
            var necroRequest = { Command: "GetPokemonList" };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendPokemonListRequest(pmbRequest); });
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.PMB) {
                _this.sendRequest(pmbRequest);
            }
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.Necro) {
                _this.sendRequest(necroRequest);
            }
        };
        this.sendEggsListRequest = function () {
            var pmbRequest = { Command: "EggsList" };
            var necroRequest = { Command: "GetEggList" };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendEggsListRequest(pmbRequest); });
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.PMB) {
                _this.sendRequest(pmbRequest);
            }
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.Necro) {
                _this.sendRequest(necroRequest);
            }
        };
        this.sendInventoryListRequest = function () {
            var pmbRequest = { Command: "InventoryList" };
            var necroRequest = { Command: "GetItemsList" };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendInventoryListRequest(pmbRequest); });
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.PMB) {
                _this.sendRequest(pmbRequest);
            }
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.Necro) {
                _this.sendRequest(necroRequest);
            }
        };
        this.sendPlayerStatsRequest = function () {
            var pmbRequest = { Command: "PlayerStats" };
            var necroRequest = { Command: "GetTrainerProfile" };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendPlayerStatsRequest(pmbRequest); });
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.PMB) {
                _this.sendRequest(pmbRequest);
            }
            if (_this.currentBotFamily === BotFamily.Undetermined || _this.currentBotFamily === BotFamily.Necro) {
                _this.sendRequest(necroRequest);
            }
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
                Data: pokemonId.toString(),
                PokemonId: pokemonId
            };
            _.each(_this.config.eventHandlers, function (eh) { return eh.onSendTransferPokemonRequest(request); });
            _this.sendRequest(request);
        };
        this.sendEvolvePokemonRequest = function (pokemonId) {
            var request = {
                Command: "EvolvePokemon",
                Data: pokemonId.toString(),
                PokemonId: pokemonId
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
        this.currentlySniping = false;
        this.running = false;
        this.profileSent = false;
        this.currentBotFamily = BotFamily.Undetermined;
    }
    return BotWSClient;
}());
var LocalStorageDataStorage = (function () {
    function LocalStorageDataStorage() {
        this.setData = function (key, data) {
            var dataJson = JSON.stringify(data);
            localStorage.setItem(key, dataJson);
        };
        this.getData = function (key) {
            var dataJson = localStorage.getItem(key);
            if (!dataJson) {
                return null;
            }
            try {
                var data = JSON.parse(dataJson);
                return data;
            }
            catch (ex) {
                return null;
            }
        };
    }
    return LocalStorageDataStorage;
}());
var FortCacheService = (function () {
    function FortCacheService(dataStorage) {
        var _this = this;
        this.addFort = function (fort, addName) {
            var cacheEntry = {
                Id: fort.Id,
                Latitude: fort.Latitude,
                Longitude: fort.Longitude,
                Name: fort.Name,
                Type: fort.Type
            };
            var previous = _this.cache[cacheEntry.Id];
            _this.cache[cacheEntry.Id] = cacheEntry;
            if (previous && previous.Name) {
                if (addName) {
                    fort.Name = previous.Name;
                }
                cacheEntry.Name = previous.Name;
            }
            _this.saveCache();
        };
        this.saveCache = function () {
            _this.dataStorage.setData("fortCache", _this.cache);
        };
        this.loadCache = function () {
            _this.cache = _this.dataStorage.getData("fortCache") || {};
        };
        this.setName = function (id, name) {
            var fort = _this.cache[id];
            if (fort) {
                fort.Name = name;
            }
            _this.saveCache();
        };
        this.getCached = function () { return _this.cache; };
        this.dataStorage = dataStorage;
        this.loadCache();
    }
    return FortCacheService;
}());
var DefaultSettings = (function () {
    function DefaultSettings() {
    }
    Object.defineProperty(DefaultSettings, "settings", {
        get: function () {
            return {
                mapProvider: MapProvider.GMaps,
                mapFolllowPlayer: true,
                mapClearing: 0,
                mapGoogleApiKey: "",
                mapOsmApiKey: "",
                clientAddress: "127.0.0.1",
                clientPort: 14252,
                clientUseSSL: false,
                notificationsJournal: {
                    pokestopUsed: true,
                    pokemonCapture: true,
                    pokemonSnipe: true,
                    pokemonEvolved: true,
                    eggHatched: true,
                    incubatorStatus: true,
                    itemRecycle: true,
                    pokemonTransfer: true,
                },
                notificationsDesktop: {
                    pokestopUsed: false,
                    pokemonCapture: false,
                    pokemonSnipe: false,
                    pokemonEvolved: false,
                    eggHatched: false,
                    incubatorStatus: false,
                    itemRecycle: false,
                    pokemonTransfer: false,
                },
                notificationsToast: {
                    pokestopUsed: false,
                    pokemonCapture: false,
                    pokemonSnipe: false,
                    pokemonEvolved: false,
                    eggHatched: false,
                    incubatorStatus: false,
                    itemRecycle: false,
                    pokemonTransfer: false,
                },
                notificationsJournalClearingAnimation: true
            };
        },
        enumerable: true,
        configurable: true
    });
    return DefaultSettings;
}());
var SettingsService = (function () {
    function SettingsService(dataStorage) {
        var _this = this;
        this.settingsKey = "settings";
        this.load = function () {
            var loadedSettings = _this.dataStorage.getData(_this.settingsKey);
            if (loadedSettings === null) {
                _this.apply(DefaultSettings.settings);
                return;
            }
            _this.apply(loadedSettings);
        };
        this.cloneSettings = function (settings) {
            return _this.mergeSettings([settings]);
        };
        this.mergeSettings = function (allSettings) {
            var notificationsJournal = {
                pokestopUsed: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.pokestopUsed; }),
                pokemonCapture: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.pokemonCapture; }),
                pokemonSnipe: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.pokemonSnipe; }),
                pokemonEvolved: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.pokemonEvolved; }),
                eggHatched: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.eggHatched; }),
                incubatorStatus: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.incubatorStatus; }),
                itemRecycle: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.itemRecycle; }),
                pokemonTransfer: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournal && s.notificationsJournal.pokemonTransfer; })
            };
            var notificationsDesktop = {
                pokestopUsed: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.pokestopUsed; }),
                pokemonCapture: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.pokemonCapture; }),
                pokemonSnipe: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.pokemonSnipe; }),
                pokemonEvolved: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.pokemonEvolved; }),
                eggHatched: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.eggHatched; }),
                incubatorStatus: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.incubatorStatus; }),
                itemRecycle: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.itemRecycle; }),
                pokemonTransfer: _this.coalesceMap(allSettings, function (s) { return s.notificationsDesktop && s.notificationsDesktop.pokemonTransfer; })
            };
            var notificationsToast = {
                pokestopUsed: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.pokestopUsed; }),
                pokemonCapture: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.pokemonCapture; }),
                pokemonSnipe: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.pokemonSnipe; }),
                pokemonEvolved: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.pokemonEvolved; }),
                eggHatched: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.eggHatched; }),
                incubatorStatus: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.incubatorStatus; }),
                itemRecycle: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.itemRecycle; }),
                pokemonTransfer: _this.coalesceMap(allSettings, function (s) { return s.notificationsToast && s.notificationsToast.pokemonTransfer; })
            };
            return {
                mapProvider: _this.coalesceMap(allSettings, function (s) { return s.mapProvider; }),
                mapFolllowPlayer: _this.coalesceMap(allSettings, function (s) { return s.mapFolllowPlayer; }),
                mapClearing: _this.coalesceMap(allSettings, function (s) { return s.mapClearing; }),
                mapGoogleApiKey: _this.coalesceMap(allSettings, function (s) { return s.mapGoogleApiKey; }),
                mapOsmApiKey: _this.coalesceMap(allSettings, function (s) { return s.mapOsmApiKey; }),
                clientAddress: _this.coalesceMap(allSettings, function (s) { return s.clientAddress; }),
                clientPort: _this.coalesceMap(allSettings, function (s) { return s.clientPort; }),
                clientUseSSL: _this.coalesceMap(allSettings, function (s) { return s.clientUseSSL; }),
                notificationsJournal: notificationsJournal,
                notificationsDesktop: notificationsDesktop,
                notificationsToast: notificationsToast,
                notificationsJournalClearingAnimation: _this.coalesceMap(allSettings, function (s) { return s.notificationsJournalClearingAnimation; })
            };
        };
        this.coalesce = function (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                if (typeof inputs[i] !== "undefined") {
                    return inputs[i];
                }
            }
            throw "No value found";
        };
        this.apply = function (settings) {
            var previousSettings = _this.currentSettings;
            var defaultSettings = DefaultSettings.settings;
            var mergedSettings = _this.mergeSettings([settings, defaultSettings]);
            _this.currentSettings = mergedSettings;
            for (var i = 0; i < _this.subscribers.length; i++) {
                var settingsClone = _this.cloneSettings(mergedSettings);
                var previousClone = _this.cloneSettings(previousSettings);
                _this.subscribers[i](settingsClone, previousClone);
            }
            _this.save();
        };
        this.save = function () {
            _this.dataStorage.setData(_this.settingsKey, _this.currentSettings);
        };
        this.dataStorage = dataStorage;
        this.subscribers = [];
    }
    Object.defineProperty(SettingsService.prototype, "settings", {
        get: function () {
            return this.cloneSettings(this.currentSettings);
        },
        enumerable: true,
        configurable: true
    });
    SettingsService.prototype.coalesceMap = function (inputs, map) {
        var mapped = _.map(inputs, map);
        return this.coalesce(mapped);
    };
    SettingsService.prototype.subscribe = function (action) {
        this.subscribers.push(action);
    };
    SettingsService.prototype.settingsEqual = function (settings, to) {
        var equal = true;
        equal = equal && settings.mapProvider === to.mapProvider;
        equal = equal && settings.mapFolllowPlayer === to.mapFolllowPlayer;
        equal = equal && settings.mapClearing === to.mapClearing;
        equal = equal && settings.mapGoogleApiKey === to.mapGoogleApiKey;
        equal = equal && settings.mapOsmApiKey === to.mapOsmApiKey;
        equal = equal && settings.clientAddress === to.clientAddress;
        equal = equal && settings.clientPort === to.clientPort;
        equal = equal && settings.clientUseSSL === to.clientUseSSL;
        equal = equal && this.notificationSettingsEqual(settings.notificationsJournal, to.notificationsJournal);
        equal = equal && this.notificationSettingsEqual(settings.notificationsDesktop, to.notificationsDesktop);
        equal = equal && this.notificationSettingsEqual(settings.notificationsToast, to.notificationsToast);
        equal = equal && settings.notificationsJournalClearingAnimation === to.notificationsJournalClearingAnimation;
        return equal;
    };
    SettingsService.prototype.notificationSettingsEqual = function (settings, to) {
        var equal = true;
        equal = equal && settings.pokestopUsed === to.pokestopUsed;
        equal = equal && settings.pokemonCapture === to.pokemonCapture;
        equal = equal && settings.pokemonSnipe === to.pokemonSnipe;
        equal = equal && settings.pokemonEvolved === to.pokemonEvolved;
        equal = equal && settings.eggHatched === to.eggHatched;
        equal = equal && settings.incubatorStatus === to.incubatorStatus;
        equal = equal && settings.itemRecycle === to.itemRecycle;
        equal = equal && settings.pokemonTransfer === to.pokemonTransfer;
        return equal;
    };
    return SettingsService;
}());
var Language;
(function (Language) {
    Language[Language["English"] = 0] = "English";
    Language[Language["German"] = 1] = "German";
})(Language || (Language = {}));
var TranslationService = (function () {
    function TranslationService(language) {
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
    return TranslationService;
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
            "example": "example",
            "pokestop": "pokestop",
            "catch": "catch",
            "snipe": "snipe",
            "evolve": "evolve",
            "recycle": "recycle",
            "transfer": "transfer",
            "incubator-status": "incubator",
            "egg-hatched": "hatched"
        };
        this.pokemonTypes = [];
        this.pokemonTypes[PokeElement.Bug] = "Bug";
        this.pokemonTypes[PokeElement.Grass] = "Grass";
        this.pokemonTypes[PokeElement.Dark] = "Dark";
        this.pokemonTypes[PokeElement.Ground] = "Ground";
        this.pokemonTypes[PokeElement.Dragon] = "Dragon";
        this.pokemonTypes[PokeElement.Ice] = "Ice";
        this.pokemonTypes[PokeElement.Electric] = "Electric";
        this.pokemonTypes[PokeElement.Normal] = "Normal";
        this.pokemonTypes[PokeElement.Fairy] = "Fairy";
        this.pokemonTypes[PokeElement.Poison] = "Poison";
        this.pokemonTypes[PokeElement.Fighting] = "Fighting";
        this.pokemonTypes[PokeElement.Psychic] = "Psychic";
        this.pokemonTypes[PokeElement.Fire] = "Fire";
        this.pokemonTypes[PokeElement.Rock] = "Rock";
        this.pokemonTypes[PokeElement.Flying] = "Flying";
        this.pokemonTypes[PokeElement.Steel] = "Steel";
        this.pokemonTypes[PokeElement.Ghost] = "Ghost";
        this.pokemonTypes[PokeElement.Water] = "Water";
    }
    return EnglishTranslation;
}());
var GermanTranslation = (function (_super) {
    __extends(GermanTranslation, _super);
    function GermanTranslation() {
        _super.apply(this, arguments);
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
            "example": "beispiel",
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
}(EnglishTranslation));
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
    StaticInfo.init();
    var dataStorage = new LocalStorageDataStorage();
    var settingsService = new SettingsService(dataStorage);
    var fortCacheService = new FortCacheService(dataStorage);
    settingsService.load();
    var settings = settingsService.settings;
    var client = new BotWSClient();
    var translationController = new TranslationService();
    var toastController = new ToastController({
        toastElement: $("#notification")
    });
    var journalNotificationController = new JournalNotificationController({
        container: $("#journal .items"),
        clearAllButton: $("#journal .clear-all"),
        notificationCounter: $("#journal-counter"),
        exampleButton: $("#show-notification-journal-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsJournal,
        settingsService: settingsService
    });
    var desktopNotificationController = new DesktopNotificationController({
        permissionElement: $("#notification-desktop-status"),
        exampleButton: $("#show-notification-desktop-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsDesktop,
        settingsService: settingsService
    });
    var toastNotificationController = new ToastNotificationController({
        toastControler: toastController,
        exampleButton: $("#show-notification-toast-example-button"),
        translationController: translationController,
        notificationSettings: settings.notificationsToast,
        settingsService: settingsService
    });
    var mainMenuController = new MainMenuController({
        requestSender: client,
        mainMenuElement: $("#menu")
    });
    var pokemonMenuController = new PokemonMenuController({
        translationController: translationController,
        requestSender: client,
        pokemonMenuElement: $('body.live-version .content[data-category="pokemons"]'),
        pokemonDetailsElement: $("#pokemon-info"),
        pokemonLoadingSpinner: $(".spinner-overlay")
    });
    var inventoryMenuController = new InventoryMenuController({
        translationController: translationController,
        requestSender: client,
        inventoryMenuElement: $('body .content[data-category="items"]'),
        inventoryLoadingSpinner: $(".spinner-overlay")
    });
    var eggMenuController = new EggMenuController({
        translationController: translationController,
        requestSender: client,
        eggMenuElement: $('body .content[data-category="eggs"]'),
        eggLoadingSpinner: $(".spinner-overlay")
    });
    var settingsMenuController = new SettingsMenuController({
        settingsMenuElement: $('body.live-version .content[data-category="settings"]'),
        settingsButtonsElement: $("#settings-buttons"),
        settingsService: settingsService
    });
    settingsMenuController.setSettings(settings);
    var profileInfoController = new ProfileInfoController({
        hideUsername: false,
        profileInfoElement: $("#profile")
    });
    var mapConfig = {
        followPlayer: settings.mapFolllowPlayer,
        translationController: translationController,
        mapElement: $("#map"),
        infoWindowTemplate: $("#iw-template")
    };
    var useGoogleMap = settings.mapProvider === MapProvider.GMaps;
    var lMap = useGoogleMap ? new GoogleMap(mapConfig) : new LeafletMap(mapConfig);
    var interfaceHandler = new InterfaceHandler({
        translationController: translationController,
        notificationControllers: [
            journalNotificationController,
            desktopNotificationController,
            toastNotificationController
        ],
        mainMenuController: mainMenuController,
        pokemonMenuController: pokemonMenuController,
        inventoryMenuController: inventoryMenuController,
        eggMenuController: eggMenuController,
        profileInfoController: profileInfoController,
        requestSender: client,
        map: lMap,
        settingsService: settingsService,
        fortCacheService: fortCacheService
    });
    client.start({
        eventHandlers: [interfaceHandler],
        settingsService: settingsService
    });
});
//# sourceMappingURL=script.js.map