const siteData = {
	labels: [
		"26th", "27th", "28th", "29th", "30th", "1st"
	],
	datasets: [
		{
			name:      "Score",
			chartType: "line",
			values:    [ 2,3,4,5,4,5 ]},
		{
			name:      "Score Bar",
			chartType: "bar",
			values:    [ 2,3,4,5,4,5 ]}],

	yMarkers: [
			   { label: "", value: 0, type: 'solid' },
			   { label: "Good Diving", value: 4 }
			  ],
}


class SiteDetails {

	constructor() {
		this.regions = [];
		this.chart   = null;
		this.chartConfig = null;
	}

	compileListMarkup( site) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */

		var thisItem = sl.getDetailsMarkup( site);
		console.log( 'showing site detail' );
		console.log( thisItem );
		items.push(  thisItem);
		return thisItem;
	}

	getDetailsMarkup( site) {
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
		thisItem += '<h1>'+ site.name         + '</h1>';
		if ( site.description) {
			thisItem += '<p>' + site.description  + '</p>';
		}
		thisItem += '<p>latitude:' + site.latitude     + '</p>';
		thisItem += '<p>longitude:' + site.longitude    + '</p>';
		thisItem += '<p>created:' + site.create_time  + '</p>';
		thisItem += '<p>modified:' + site.modify_time  + '</p>';
		thisItem += '<p>latest score:' + site.latest_score + '</p>';
		thisItem += '<p>score last updated:' + site.score_time   + '</p>';
		thisItem += '<div id="dive-site-chart"></div>';
		thisItem += '</div>';

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
		new frappe.Chart(
			"#dive-site-chart", // or a DOM element,
			this.chartConfig);
	}
}
