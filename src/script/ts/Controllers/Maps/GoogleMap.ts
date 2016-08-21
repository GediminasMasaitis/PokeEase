interface Window {
    setIwStyles();
}

interface IGoogleMapMarkerInfo {
    marker: google.maps.Marker;
    infoWindow: google.maps.InfoWindow;
}

interface IGoogleMapPokestopInfo extends IGoogleMapMarkerInfo {
    event: IPokeStopEvent;
}

interface IGoogleMapGymInfo extends IGoogleMapMarkerInfo {
    event: IGymEvent;
}

class GoogleMap implements IMap {
    public config: IMapConfig;

    private map: google.maps.Map;
    private playerMarker: google.maps.Marker;
    private locationHistory: Array<any> = [];
    private locationLine: google.maps.Polyline;

    // TODO: refactor this big time
    private pokestops: { [id: string]: IGoogleMapPokestopInfo } = {};
    private gyms: { [id: string]: IGoogleMapGymInfo } = {};
    private capMarkers: Array<CaptureMarker> = [];

    constructor(config: IMapConfig) {
        this.config = config;

        var mapStyle: any =[
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
]



        // Initialize the map.
        var mapOptions: google.maps.MapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(0,0),
            //center: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyle,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
        };
        const mapElement = this.config.mapElement.get(0);
        this.map = new google.maps.Map(mapElement, mapOptions);

        this.playerMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            icon: {
                url: "images/markers/location.png",
                scaledSize: new google.maps.Size(50, 55),                
                anchor: new google.maps.Point(25, 45)
            },
            zIndex: 300
        });

        /*setTimeout(() => {
            console.log("setting new map style");
            mapOptions.styles = mapStyleOld;
            this.map.setOptions(mapOptions);
        }, 10000);*/

    }

    public movePlayer = (position: IUpdatePositionEvent): void => {
        const posArr = [position.Latitude, position.Longitude];
        const pos = new google.maps.LatLng(posArr[0], posArr[1]);

        this.playerMarker.setPosition(pos);

        if(this.config.followPlayer) {
            // Animate the map centering.
            const from    = {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()};
            const to      = {lat: posArr[0], lng: posArr[1]};
            const currentMap: google.maps.Map = this.map;
            $(from).animate(to, {
                duration: 200,
                step(cs, t) {
                    let newPos: google.maps.LatLng;
                    switch (t.prop) {
                        case "lat":
                            newPos = new google.maps.LatLng(cs, currentMap.getCenter().lng());
                            break;
                        case "lng":
                            newPos = new google.maps.LatLng(currentMap.getCenter().lat(), cs);
                            break;
                        default:
                            throw "Unknown t.prop";
                    }

                    currentMap.setCenter(newPos);
                }
            });
        }
		
        // Setup the location history line.		
        this.locationHistory.push({ lat: posArr[0], lng: posArr[1] });

        // Cap the amount of location points.
        /*while(this.locationHistory.length > 300) {
            this.locationHistory.splice(0, 1);
        }*/
		
		if(this.locationLine != null)
			this.locationLine.setMap(null);
        this.locationLine = new google.maps.Polyline({
            path: this.locationHistory,
            geodesic: true,
            strokeColor: '#00FFFF',
            strokeOpacity: 0.7,
            strokeWeight: 4
        });
        this.locationLine.setMap(this.map);
    }

    public setPokeStops = (pokeStops: IPokeStopEvent[]): void => {
        // Translate list of incoming pokestops into id -> event dictionary.
        var incomingPokestops: { [id: string]: IPokeStopEvent } = {};
        _.each(pokeStops, stop => { incomingPokestops[stop.Id] = stop; });

        // Check for any markers that need to be removed.
        _.each(this.pokestops, stop => {
            const stopId = stop.event.Id;
            if (!(stopId in incomingPokestops)) {
                stop.marker.setMap(null);
                delete stop.event;
                delete stop.marker;
                delete stop.infoWindow;
                delete this.pokestops[stopId];
            }
        });

        // Check for any markers that need to be added.
        _.each(incomingPokestops, stop => {
            const stopId = stop.Id;
            const currentEvents = _.map(this.pokestops, ps => ps.event) as IPokeStopEvent[];
            if (!(stopId in currentEvents)) {
                const marker = this.createStopMarker(stop);
                const infoWindow = this.createStopInfoWindow(stop, marker);
                this.pokestops[stopId] = {
                    event: stop,
                    marker: marker,
                    infoWindow: infoWindow
                };
            }
        });

        // Check for any markers that need to be updated.
        _.each(pokeStops, pstop => {
            var isModified = pstop.LastModifiedTimestampMs > this.pokestops[pstop.Id].event.LastModifiedTimestampMs;
            var isDifferentStatus = pstop.Status != this.pokestops[pstop.Id].event.Status;
            
            if (isModified || isDifferentStatus) {
                this.pokestops[pstop.Id].marker.setIcon(this.getStopIconData(pstop.Status));
                this.pokestops[pstop.Id].event = pstop;
            }
        });
    }

    public setGyms = (gyms: IGymEvent[]) => {
        // Translate list of incoming pokestops into id -> event dictionary.
        const incomingGyms: { [id: string]: IGymEvent } = {};
        _.each(gyms, g => { incomingGyms[g.Id] = g; });

        // Check for any markers that need to be removed.
        _.each(this.gyms, g => {
            const gymId = g.event.Id;
            if (!(gymId in incomingGyms)) {
                g.marker.setMap(null);
                delete g.marker;
                delete g.infoWindow;
                delete g.event;
                delete this.gyms[gymId];
            }
        });

        // Check for any markers that need to be added.
        let currentGymEvents = _.map(this.gyms, g => g.event) as IGymEvent[];
        _.each(incomingGyms, g => {
            // If the gym ownership has changed, remove it so it can be readded as the new team.
            const gymId = g.Id;
            if ((gymId in currentGymEvents) && this.gyms[gymId].event.OwnedByTeam !== g.OwnedByTeam) {
                this.gyms[gymId].marker.setMap(null);
                delete this.gyms[gymId].marker;
                delete this.gyms[gymId].infoWindow;
                delete this.gyms[gymId].event;
                delete this.gyms[gymId];
            }

            currentGymEvents = _.map(this.gyms, g => g.event) as IGymEvent[];
            if (!(g.Id in currentGymEvents)) {
                const marker = this.createGymMarker(g);
                const infoWindow = this.createGymInfoWindow(g, marker);
                this.gyms[g.Id] = {
                    event: g,
                    marker: marker,
                    infoWindow: infoWindow
                };
            }
        });
    }

    public usePokeStop(pokeStopUsed: IFortUsedEvent): void {
        let setStatus = PokeStopStatus.Visited;
        const stopId = pokeStopUsed.Id;
        if (this.pokestops[stopId].event.Status === PokeStopStatus.Lure) {
            setStatus = PokeStopStatus.VisitedLure;
        }

        this.pokestops[stopId].marker.setIcon(this.getStopIconData(setStatus));
        this.pokestops[stopId].event.Status = setStatus;
    }

    public onPokemonCapture(pokemonCapture: IPokemonCaptureEvent): void {
        console.log(pokemonCapture);

        const captureMarker = new CaptureMarker (
            new google.maps.LatLng(pokemonCapture.Latitude, pokemonCapture.Longitude),
            this.map,
            {
                PokemonId: pokemonCapture.Id
            }
        );
        this.capMarkers.push(captureMarker);
    }

    private createStopMarker = (pstop: IPokeStopEvent): google.maps.Marker => {
        const psMarker: google.maps.Marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(pstop.Latitude, pstop.Longitude),
            icon: this.getStopIconData(pstop.Status),
            zIndex: 100
        });

        return psMarker;
    }

    private createStopInfoWindow = (pstop: IPokeStopEvent, marker: google.maps.Marker): google.maps.InfoWindow => {
        const pstopName = pstop.Name || "Unknown";
        const template = this.config.infoWindowTemplate.clone();
        const wrap = template.find(".iw-wrap");
        const status = wrap.find(".iw-status");
        const icon = wrap.find(".iw-icon");
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
        const roundedLat = Math.round(pstop.Latitude * 10000000) / 10000000;
        const roundedLng = Math.round(pstop.Longitude * 10000000) / 10000000;

        wrap.find(".iw-name .iw-detail-header").text("Pokestop");
        wrap.find(".iw-name .iw-detail-value").text(pstopName);
        wrap.find(".iw-latitude .iw-detail-value").text(roundedLat);
        wrap.find(".iw-longitude .iw-detail-value").text(roundedLng);
        const html = template.html();
        const infoWindow = new google.maps.InfoWindow({
            content: html
        });

        marker.addListener("click", () => {
            infoWindow.open(this.map, marker);
            window.setIwStyles();
        });

        return infoWindow;
    }

    private getStopIconData(status: PokeStopStatus): any {
        var stopImage = "images/markers/";

        switch (status) {
            case PokeStopStatus.Normal: stopImage += "Normal.png"; break;
            case PokeStopStatus.Lure: stopImage += "Lured.png"; break;
            case PokeStopStatus.Visited: stopImage += "Visited.png"; break;
            case PokeStopStatus.VisitedLure: stopImage += "VisitedLure.png"; break;
            default:
                stopImage += "Normal.png";
                break;
        }

        return {
            url: stopImage,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
        };
    }

    private createGymMarker(gym: IGymEvent): google.maps.Marker {
        var gMarker: google.maps.Marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(gym.Latitude, gym.Longitude),
            icon: this.getGymIconData(gym),
            zIndex: 100
        });

        return gMarker;
    }

    private createGymInfoWindow = (gym: IGymEvent, marker: google.maps.Marker): google.maps.InfoWindow => {
        const gymName = gym.Name || "Unknown";
        const template = this.config.infoWindowTemplate.clone();
        const wrap = template.find(".iw-wrap");
        const status = wrap.find(".iw-status");
        const icon = wrap.find(".iw-icon");
        const emblem = wrap.find(".iw-gym-team-emblem");
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

        const roundedLat = Math.round(gym.Latitude * 10000000) / 10000000;
        const roundedLng = Math.round(gym.Longitude * 10000000) / 10000000;
        const gymExp = parseInt(gym.GymPoints);
        const gymLevel = StaticInfo.calculateCurrentGymLevel(gymExp);
        const nextGymLevelRequired = StaticInfo.totalExpForGymLevel[gymLevel + 1];

        wrap.find(".iw-name .iw-detail-header").text("Gym");
        wrap.find(".iw-name .iw-detail-value").text(gymName);

        wrap.find(".iw-gym-level").show();
        wrap.find(".iw-gym-xp").show();
        wrap.find(".iw-gym-hr-general").show();
        wrap.find(".iw-gym-level .iw-detail-value").text(gymLevel);
        wrap.find(".iw-gym-xp .iw-detail-value").text(`${gymExp} / ${nextGymLevelRequired}`);

        wrap.find(".iw-latitude .iw-detail-value").text(roundedLat);
        wrap.find(".iw-longitude .iw-detail-value").text(roundedLng);

        if (gym.OwnedByTeam !== PlayerTeam.Neutral) {
            wrap.find(".iw-gym-defender").show();
            wrap.find(".iw-gym-defender-cp").show();
            wrap.find(".iw-gym-hr-defender").show();
            wrap.find(".iw-gym-defender-icon").attr("src", `images/pokemon/${gym.GuardPokemonId}.png`);
            const pokemonName = this.config.translationController.translation.pokemonNames[gym.GuardPokemonId];
            wrap.find(".iw-gym-defender-name").text(pokemonName);
            wrap.find(".iw-gym-defender-cp .iw-detail-value").text(gym.GuardPokemonCp);
        }

        const html = template.html();
        const infoWindow = new google.maps.InfoWindow({
            content: html
        });

        marker.addListener("click", () => {
            infoWindow.open(this.map, marker);
            window.setIwStyles();
        });

        return infoWindow;
    }

    private getGymIconData(gym: IGymEvent) {
        var stopImage = "images/markers/";

        switch (gym.OwnedByTeam) {
            case PlayerTeam.Instinct: stopImage += "instinct.png"; break;
            case PlayerTeam.Mystic: stopImage += "mystic.png"; break;
            case PlayerTeam.Valor: stopImage += "valor.png"; break;
            case PlayerTeam.Neutral: stopImage += "unoccupied.png"; break;
            default:
                stopImage += "unoccupied.png";
                break;
        }

        return {
            url: stopImage,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
        };
    }

}
