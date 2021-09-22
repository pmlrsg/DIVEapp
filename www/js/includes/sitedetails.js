
class SiteDetails {

	constructor() {
		this.regions = [];
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

		return thisItem;
	}
}
