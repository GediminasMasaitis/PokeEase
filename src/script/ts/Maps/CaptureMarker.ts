class CaptureMarker extends google.maps.OverlayView {

    private latlng: google.maps.LatLng;
    private div: HTMLElement;
    private args: any;

    constructor(latlng: google.maps.LatLng, map: google.maps.Map, args: any) {
        super();

	    this.latlng = latlng;
	    this.args = args;
	    this.setMap(map);
    }

    public draw() {
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
		    })

		    if(this.args.PokemonId !== 'undefined')
			    i.css({'background-image': "url(images/pokemon/" + this.args.PokemonId + ".png)"});

		    i.css({
			    'background-size': "contain",
			    'background-position': "center center",
			    'background-repeat': 'no-repeat',
			    'width': "40px",
			    'height': "40px",
			    /* 'border-radius': '20px', */
			    'margin': "5px"
		    })

		    d.append(i);

		    /*google.maps.event.addDomListener(div, "click", function(event) {
			    alert('You clicked on a custom marker!');
			    google.maps.event.trigger(self, "click");
		    });*/

		    var panes = this.getPanes();
		    panes.overlayLayer.appendChild(div);
	    }

	    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	    if (point) {
		    div.style.left = (point.x - 10) + 'px';
		    div.style.top = (point.y - 20) + 'px';
	    }
    }

    public getPosition(): google.maps.LatLng {
        return this.latlng;
    }
}
