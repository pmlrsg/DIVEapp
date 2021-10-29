class LeafletHelper {

	static icon      = null;

	constructor() {
		this.icon = null;
	}

	static getIcon() {
		if ( null == this.icon) {
			this.icon = L.icon({
				iconUrl:      'img/diver.png',
				shadowUrl:    'img/diver-shadow.png',

				iconSize:     [50, 100], // size of the icon
				shadowSize:   [68, 100], // size of the shadow
				iconAnchor:   [23, 90], // point of the icon which will correspond to marker's location
				shadowAnchor: [15, 90],  // the same for the shadow
				//popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
			});
		}
		return this.icon;
	}

	static getBaseLayer() {
		this.baseLayer = L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				subdomains: ['a','b','c']});
		return this.baseLayer;
	}

	static getMapFromAreaFinder( finder, divId, ignoreBounds=false) {

		var centre = finder.getCentrePoint();

		// add a little padding to the north for marker height
		var topLat = finder.maxLat;
		var topLatDiff = topLat - centre[0];
		topLat = (topLatDiff * 1.22) + centre[0];

		var maxBounds = [
			[topLat,        finder.maxLon],
			[finder.minLat, finder.minLon]]

		var mapConfig =  {
			center: centre,
		}

		// create map
		var thisMap = L.map(
			divId,
			mapConfig);

		// add basemap
		this.getBaseLayer().addTo( thisMap);

		// set map zoom
		if ( !ignoreBounds) {
			thisMap.fitBounds( maxBounds);
		}

		return thisMap;
	}
}
