
/** hander to show sites for a specific regions
    bound to the onclick event for each region **/
function showSitesFromRegion( region) {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: config.URL_SITES + region,
		success: function (data) {
			$('#dive-sites').html(siteList.compileListMarkup(data, region));
			$('#dive-regions').hide();
			$('#dive-sites').show();
			$('#dive-site-detail').hide();
			menuBar.setBackButton( "app.fetchFeed();")
			siteList.runSecondaryJavascript();
		},
		error: function(data, textStatus, errorThrown) {
			console.error('Data: ');
			console.error(data);
			console.error('Status: ' + textStatus);
			console.error('Error: ' + errorThrown);
		},
	});
}

class RegionList {

	constructor() {
		this.regions = [];
		this.map     = null;
		this.area    = null;
		this.regions = null;
	}

	compileListMarkup( regions) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */
		this.regions = regions;
		var count = 1;
		var thisMarkup = '';
		this.area      = getAreaFinder();
		this.area      = new AreaFinder();
		var thisArea   = this.area;

		thisMarkup += '<div class="col col-md-6" id="dive-regions-map" style="height: 500px;"></div>';
		//thisMarkup += '<div class="col col-md-6" id="dive-sites-null" style="height: 500px;"></div>';
		thisMarkup += '<div class="col col-md-6" id="dive-regions-list">';
		$.each(regions, function(key, val){

			if ( !config.SHOW_REGION_ALL && val.id == 0 ) {
				console.log( 'skipping global region' );
			} else {
				var thisItem = sl.getRegionMarkup( val, (count % 2 ) == 0);
				thisArea.considerThis( val.maxy, val.maxx );
				thisArea.considerThis( val.miny, val.minx );
				console.log( 'adding new region' );
				console.log( thisItem );
				items.push(  thisItem);
				count++;
			}
		});
		thisMarkup += items.join( '');
		thisMarkup += '<div>';
		return( thisMarkup);
	}

	getRegionMarkup( region, odd) {
		var siteCount = 0;
		if ( region.site_count && region.site_count > 0 ) {
			siteCount = region.site_count;
		}
		var thisItem  = '';
		if ( siteCount > 0) {
			thisItem += '<a class="invisiLink" onclick="showSitesFromRegion('+region.id+')">';
		}
		thisItem += '<div class="card mb-3 listColours">';
		thisItem += '<img class="card-img-top img-responsive">';
		thisItem += '<div class="card-body';
		thisItem += '">';
		thisItem += '   <h4 class="card-title">' + region.name +'</h4>';
		thisItem += '   <p class="card-text">'   + region.description +'</p>'
		var pluralText = "s";
		if ( siteCount == 1) {
			pluralText = "";
		} else if ( siteCount < 1 ) {
			siteCount = "No"
		}
		thisItem += '<p class="card-text"><small class="text-muted">Contains '+siteCount+' site'+pluralText+'</small>';
		if ( false && siteCount > 0 ) {
			thisItem += '<a onclick="showSitesFromRegion('+region.id+')" class="card-link">View sites</a>';
		}
		thisItem += ' </div> </div>';
		if ( siteCount > 0 ) {
			thisItem += '</a>';
		}
		return thisItem;
	}

	runSecondaryJavascript() {

		var maxBounds = [[this.area.maxLat, this.area.maxLat], [this.area.minLon, this.area.minLon]]

		// map config
		var mapConfig =  {
			center: this.area.getCentrePoint(),
			zoom: 4,
			maxBounds: maxBounds
		}

		var thisMap = this.map = L.map(
			'dive-regions-map',
			mapConfig);

		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				subdomains: ['a','b','c']}).addTo( this.map );

		// add regions
		$.each(this.regions, function(key, region){
			//console.log( "Adding: (" + key + ") "+ site.latitude + ", " + site.longitude );
			var shape = L.rectangle(
				[[ region.maxy, region.maxx ], [ region.miny, region.minx ]],
				{
					color: "grey",
					weight: 1,
					fill: 1,
					opacity: 0.9});
			shape.region_id = region.id;
			shape.on( 'click', function(e) {
				console.log( e);
				showSitesFromRegion(e.target.region_id);
			});
			shape.addTo(thisMap);
		});

	}
}
