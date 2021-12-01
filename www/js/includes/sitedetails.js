const siteData = {
	labels: [
	],
	datasets: [
		{
			name:      "Score",
			chartType: "line",
			values:    []} /*,
		{
			name:      "Score Bar",
			chartType: "bar",
			values:    [ 2,3,4,5,4,5 ]} )*/
	],

	yMarkers: [
		{ label: "", value: 0, type: 'solid' },
		{ label: "", value: 5 }
	],
}

function diveSiteToggleFavorite( idSite) {
	var greyscaleClass = 'dive-greyed-img';
	if ( config.toggleFavorites( idSite)){
		$( '#dive-favorite-star').removeClass( greyscaleClass);
	} else {
		$( '#dive-favorite-star').addClass( greyscaleClass);
	}
}


class SiteDetails {

	constructor() {
		this.site    = null;
		this.chart   = null;
		this.chartConfig = null;
		this.mapConfig = null;
		this.map = null;
	}

	compileListMarkup( site) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */

		var thisItem = sl.getDetailsMarkup( site);
		//console.log( 'showing site detail' );
		//console.log( thisItem );
		items.push(  thisItem);
		return thisItem;
	}

	getDetailsMarkup( site) {
		this.site = site
		var thisItem  = '';

		/**
		   name
		   description
		   "latitude": 0,
		   "longitude": 0,
		   "create_time": "2021-09-16T01:07:58.404Z",
		   "modify_time": "2021-09-16T01:07:58.404Z",
		   "latest_score": 0,
		   "score_time": "2021-09-16T01:07:58.404Z"
		 */

		thisItem += '<div class="dive-details">';
		thisItem += '<div class="container-fluid">';
		thisItem += '<div class="row">';
		thisItem += '<div id="dive-details-title" class="col col-md-4">';
		thisItem += '<h1>'+ site.name         + '</h1>';
		var current_score = '?';
		if ( site.current_score && null != site.current_score ) {
			current_score = site.current_score;
		}
		thisItem += '<div class="row">'
		thisItem += '<div class="col col-md-12 text-righty">';

		var favClass = '';
		if ( !config.isFavorite( site.id)) {
			favClass = ' class="dive-greyed-img"';
		}
		thisItem += `
<svg id="dive-favorite-star" width="30" height="30" xmlns="http://www.w3.org/2000/svg"${favClass}
     onclick="diveSiteToggleFavorite(${site.id});">
  <polygon fill="yellow" fill-rule="nonzero" stroke="orange"
   points="15,0 6.3,27 29.4,10.5 0.6,10.5 23.7,27"/>
</svg>
`;
		thisItem += '</div></div>';
		thisItem += '<div class="container container-table">'
		thisItem += '<div class="row vertical-centre-row">';
		thisItem += '<div id="dive-details-current-score" class="col col-md-12">';
		thisItem += '<p>'+current_score+'<p>';
		thisItem += '</div></div></div></div>';
		thisItem += '<div class="col col-md-8" id="dive-site-map" style="height: 300px;">';
		thisItem += '</div>';
		thisItem += '</div>';
		thisItem += '<div id="dive-site-chart"></div>';
		thisItem += '</div>';
		thisItem += '<div id="dive-site-additional-details">';
		thisItem += '<h3>Details:</h2>';
		if ( site.description) {
			thisItem += '' + site.description  + '</p>';
		}
		thisItem += '<table id="site-details-table">';

		thisItem += '<tr><td>Latitude:</td><td>'           + site.latitude    + '</td></tr>';
		thisItem += '<tr><td>longitude:</td><td>'          + site.longitude   + '</td></tr>';
		thisItem += '<tr><td>created:</td><td>'            + site.create_time + '</td></tr>';
		thisItem += '<tr><td>modified:</td><td>'           + site.modify_time + '</td></tr>';
		thisItem += '<tr><td>score last updated: </td><td>' + site.score_time  + '</td></tr>';
		thisItem += '</table></div></div>';

		this.mapConfig = [ site.latitude, site.longitude];

		if (site.latest_scores != null) {
			siteData.datasets[0].values = site.latest_scores;

			var friendlyDates = []

			$.each( site.score_times, function( index, time) {
				var thisDate = new Date( time);
				friendlyDates.push( thisDate.getDate());
			});
			siteData.labels = friendlyDates;
		}


		this.chartConfig = {
        // new Chart() in case of ES6 module with above usage
			title: "Site Scores",
			data: siteData,
			type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
			height: 250,
			//			colors: ['#7cd6fd', '#743ee2'],
			colors: [ '#016676' ],
			valuesOverPoints: 1,
			lineOptions: {
				dotSize: 8,   // default 4
				regionFill: 1 // default: 0
			},
			barOptions: {
				spaceRatio: 0.8
			}
		};
		return thisItem;
	}

	runSecondaryJavascript() {
		// draw chart
		var diverIcon = LeafletHelper.getIcon();
		new frappe.Chart(
			"#dive-site-chart", // or a DOM element,
			this.chartConfig);

		var af = new AreaFinder();
		af.considerThis( this.mapConfig[0], this.mapConfig[1]);

		this.map = LeafletHelper.getMapFromAreaFinder(
			af,
			'dive-site-map');

		this.map.setZoom( this.site.zoom_level);

		L.marker(
			this.mapConfig,
			{icon: diverIcon}
		).addTo(this.map);
	}
}
