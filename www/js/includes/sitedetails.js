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

const defaultSiteZoomLevel = 11;

function showSiteDetail( site, region) {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: config.URL_SITE+site,
		success: function (data) {
			display.display(
				siteDetails.compileListMarkup(data),
				siteDetails);
			menuBar.setBackButton( "showSitesFromRegion("+region+");");
		},
		error: diveError.getErrorHandler( diveError.AREA_SITE)
	});
}

function diveSiteToggleFavorite() {
	var greyscaleClass = 'dive-greyed-img';
	if ( config.toggleFavorites(siteDetails.site)){
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
		this.site = site;
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
		var current_score = '?';
		if ( site.current_score && null != site.current_score ) {
			if ( site.current_score > 0 ) {
				current_score = site.current_score;
				if ( current_score > 5 ) {
					current_score = 5;
				}
				current_score = '<img alt="'+current_score+'" height="32" width="64" src="img/goggle-0'+current_score+'-64x32.png">';
			}
		}

		// score
		thisItem += '<div id="dive-details-current-score" class="col-2">';
		thisItem += current_score;
		thisItem += '</div>';


		// title
		thisItem += '<div id="dive-details-title" class="col-8">';
		thisItem += '<h1>'+ site.name         + '</h1>';
		thisItem += '</div>';

		// favorite star
		thisItem += '<div class="col-2 text-righty">';

		var favClass = '';
		if ( !config.isFavorite( site.id)) {
			favClass = ' dive-greyed-img';
		}
		thisItem += `
<svg class="nudge-down-4${favClass}" id="dive-favorite-star" width="30" height="30" xmlns="http://www.w3.org/2000/svg"
     onclick="diveSiteToggleFavorite(${site.id});">
  <polygon fill="yellow" fill-rule="nonzero" stroke="orange"
   points="15,0 6.3,27 29.4,10.5 0.6,10.5 23.7,27"/>
</svg>
`;
		thisItem += '</div>';
		thisItem += '</div>'; //end row

		// map
		thisItem += '<div class="row">';
		thisItem += '<div class="col col-md-12" id="dive-site-map" style="height: 300px;">';
		thisItem += '</div>';
		thisItem += '</div>'; //end row

		// chart
		thisItem += '<div id="dive-site-chart"></div>';
		thisItem += '</div>';
		thisItem += '<div id="dive-site-additional-details">';
		thisItem += '<h3>Details:</h2>';
		if ( site.description) {
			thisItem += '<p>' + site.description  + '</p>';
		}
		thisItem += '<table id="site-details-table">';
		thisItem += '<tr><td>Latitude:</td><td>'  + sensibleRounding( site.latitude) + '</td></tr>';
		thisItem += '<tr><td>longitude:</td><td>' + sensibleRounding( site.longitude) + '</td></tr>';
		thisItem += '<tr><td>created:</td><td>'   + sensibleDateTime( site.create_time) + '</td></tr>';
		thisItem += '<tr><td>modified:</td><td>'  + sensibleDateTime( site.modify_time) + '</td></tr>';
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

		this.map.setZoom( this.site.zoom_level||defaultSiteZoomLevel);

		L.marker(
			this.mapConfig,
			{icon: diverIcon}
		).addTo(this.map);
	}
}
