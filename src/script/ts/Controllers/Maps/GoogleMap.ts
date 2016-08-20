interface Window {
    setIwStyles();
}

class GoogleMap implements IMap {
    public config: IMapConfig;

    private map: google.maps.Map;
    private playerMarker: google.maps.Marker;
    private locationHistory: Array<any> = [];
    private locationLine: google.maps.Polyline;

    // TODO: refactor this big time
    private pokestopMarkers: { [id: string]: google.maps.Marker } = {};
    private pokestopEvents: { [id: string]: IPokeStopEvent } = {};
    private pokestopInfoWindows: { [id: string]: google.maps.InfoWindow } = {};
    private gymMarkers: { [id: string]: google.maps.Marker } = {};
    private gymEvents: { [id: string]: IGymEvent } = {};
    private gymInfoWindows: { [id: string]: google.maps.InfoWindow } = {};
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
                scaledSize: new google.maps.Size(50, 55)
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
        _.each(this.pokestopEvents, stop => {
            if (!(stop.Id in incomingPokestops)) {
                this.pokestopMarkers[stop.Id].setMap(null);
                delete this.pokestopMarkers[stop.Id];
                delete this.pokestopEvents[stop.Id];
            }
        });

        // Check for any markers that need to be added.
        _.each(incomingPokestops, stop => {
            if (!(stop.Id in this.pokestopEvents)) {
                this.pokestopEvents[stop.Id] = stop;
                this.pokestopMarkers[stop.Id] = this.createStopMarker(stop);
            }
        });

        // Check for any markers that need to be updated.
        _.each(pokeStops, pstop => {
            var isModified = pstop.LastModifiedTimestampMs > this.pokestopEvents[pstop.Id].LastModifiedTimestampMs;
            var isDifferentStatus = pstop.Status != this.pokestopEvents[pstop.Id].Status;
            
            if (isModified || isDifferentStatus) {
                this.pokestopMarkers[pstop.Id].setIcon(this.getStopIconData(pstop.Status));
                this.pokestopEvents[pstop.Id] = pstop;
            }
        });
    }

    public setGyms = (gyms: IGymEvent[]) => {
        // Translate list of incoming pokestops into id -> event dictionary.
        var incomingGyms: { [id: string]: IGymEvent } = {};
        _.each(gyms, g => { incomingGyms[g.Id] = g; });

        // Check for any markers that need to be removed.
        _.each(this.gymEvents, g => {
            if (!(g.Id in incomingGyms)) {
                this.gymMarkers[g.Id].setMap(null);
                delete this.gymMarkers[g.Id];
                delete this.gymEvents[g.Id];
            }
        });

        // Check for any markers that need to be added.
        _.each(incomingGyms, g => {
            // If the gym ownership has changed, remove it so it can be readded as the new team.
            if((g.Id in this.gymEvents) && this.gymEvents[g.Id].OwnedByTeam != g.OwnedByTeam) {
                this.gymMarkers[g.Id].setMap(null);
                delete this.gymMarkers[g.Id];
                delete this.gymEvents[g.Id];                
            }

            if (!(g.Id in this.gymEvents)) {
                this.gymEvents[g.Id] = g;
                this.gymMarkers[g.Id] = this.createGymMarker(g);
            }
        });
    }

    public usePokeStop(pokeStopUsed: IFortUsedEvent): void {
        var setStatus: PokeStopStatus = PokeStopStatus.Visited;
        if (this.pokestopEvents[pokeStopUsed.Id].Status === PokeStopStatus.Lure)
            setStatus = PokeStopStatus.VisitedLure;

        this.pokestopMarkers[pokeStopUsed.Id].setIcon(this.getStopIconData(setStatus));
        this.pokestopEvents[pokeStopUsed.Id].Status = setStatus;
    }

    public onPokemonCapture(pokemonCapture: IPokemonCaptureEvent): void {
        console.log(pokemonCapture);

        var captureMarker: CaptureMarker = new CaptureMarker(
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

        const infoWindow = this.createStopInfoWindow(pstop);
        this.pokestopInfoWindows[pstop.Id] = infoWindow;

        psMarker.addListener("click", () => {
            infoWindow.open(this.map, psMarker);
            window.setIwStyles();
        });

        return psMarker;
    }

    private createStopInfoWindow = (pstop: IPokeStopEvent): google.maps.InfoWindow => {
        const pstopName = pstop.Name || "Unknown";
        const template = this.config.infoWindowTemplate.clone();
        const wrap = template.find(".iw-wrap");
        wrap.addClass("iw-pokestop");
        switch (pstop.Status) {
            case PokeStopStatus.Normal:
                break;
            case PokeStopStatus.Visited:
                wrap.addClass("iw-pokestop-visited");
                break;
            case PokeStopStatus.Lure:
                wrap.addClass("iw-pokestop-lure");
                break;
            case PokeStopStatus.VisitedLure:
                wrap.addClass("iw-pokestop-visited");
                wrap.addClass("iw-pokestop-lure");
                break;
        }
       
        wrap.find(".iw-name .iw-detail-header").text("Pokestop");
        wrap.find(".iw-name .iw-detail-value").text(pstopName);
        wrap.find(".iw-latitude .iw-detail-value").text(pstop.Latitude);
        wrap.find(".iw-longitude .iw-detail-value").text(pstop.Longitude);
        const html = template.html();
        const window = new google.maps.InfoWindow({
            content: html
        });
        return window;
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
            scaledSize: new google.maps.Size(50, 50)
        };
    }

    private createGymMarker(gym: IGymEvent): google.maps.Marker {
        var gMarker: google.maps.Marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(gym.Latitude, gym.Longitude),
            icon: this.getGymIconData(gym),
            zIndex: 100
        });

        const infoWindow = this.createGymInfoWindow(gym);
        this.gymInfoWindows[gym.Id] = infoWindow;

        gMarker.addListener("click", () => {
            infoWindow.open(this.map, gMarker);
            window.setIwStyles();
        });

        return gMarker;
    }

    private createGymInfoWindow = (gym: IGymEvent): google.maps.InfoWindow => {
        const gymName = gym.Name || "Unknown";
        const template = this.config.infoWindowTemplate.clone();
        const wrap = template.find(".iw-wrap");
        wrap.addClass("iw-gym");
        switch (gym.OwnedByTeam) {
            case PlayerTeam.Neutral:
                wrap.addClass("iw-gym-neutral");
                break;
            case PlayerTeam.Instinct:
                wrap.addClass("iw-gym-instinct");
                break;
            case PlayerTeam.Mystic:
                wrap.addClass("iw-gym-mystic");
                break;
            case PlayerTeam.Valor:
                wrap.addClass("iw-gym-valor");
                break;
        }
        wrap.find(".iw-name .iw-detail-header").text("Gym");
        wrap.find(".iw-name .iw-detail-value").text(gymName);
        wrap.find(".iw-latitude .iw-detail-value").text(gym.Latitude);
        wrap.find(".iw-longitude .iw-detail-value").text(gym.Longitude);
        const html = template.html();
        const window = new google.maps.InfoWindow({
            content: html
        });
        return window;
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
            scaledSize: new google.maps.Size(50, 50)
        };
    }

}
