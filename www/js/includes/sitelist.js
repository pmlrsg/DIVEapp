/** handler to show sites for a specific regions
    bound to the onclick event for each region **/
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
		error: function(data, textStatus, errorThrown) {
			console.error('Data: ');
			console.error(data);
			console.error('Status: ' + textStatus);
			console.error('Error: ' + errorThrown);
		},
	});
}

class SiteList {

	constructor() {
		this.sites = [];
		this.map   = null;
	}

	compileListMarkup( sites, region) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */
		this.sites = sites;
		var thisMarkup = '';
		this.area   = new AreaFinder();
		var thisArea = this.area;
		thisMarkup += '<div class="col col-md-6 dive-map-side">';
		thisMarkup += '<div class="row">';
		thisMarkup += '<div class="col dive-map-container">';
		thisMarkup += '<div id="dive-sites-map" class="dive-map-actual"></div></div></div>';
		thisMarkup += '<div class="row">';
		thisMarkup += '<div class="col dive-side-placeholder"></div></div></div>'
		thisMarkup += '<div class="col col-md-6 dive-list" id="dive-sites-list">';
		$.each(sites, function(key, val){

			var isFavorite = config.isFavorite( val.id);
			var thisItem = SiteList.getSiteMarkup( val, region, isFavorite);
			thisArea.considerThis( val.latitude, val.longitude);
			//console.log( 'adding new site');
			//console.log( thisItem);
			items.push(  thisItem);
		});

		thisMarkup += items.join('');
		thisMarkup += '<div>';
		return( thisMarkup);
	}

	static getSiteMarkup( site, region, favorited=false) {
		var thisItem = '';
		thisItem += '<div class="card mb-3 listColours" onclick="showSiteDetail('+site.id+','+region+')">';
		thisItem += '<img class="card-img-top img-responsive">';
		thisItem += '<div class="card-block">'
		if ( favorited) {
			thisItem += '<div class="card-favorite"><img height="30" width="30" src="img/favorite.svg" /></div>';
		}
		thisItem += '   <h4 class="card-title">' + site.name +'</h4>';
		thisItem += '   <p class="card-text">'   + site.description +'</p>'
		thisItem += '   <p class="card-text"> Current Score: ' + (site.latest_score || 'Unknown' ) + '</p>'
		thisItem += '   <p class="card-text">';
		thisItem += '<small class="text-muted">';
		if ( site.score_time != null ) {
			thisItem += 'Last updated ';
			thisItem += humanTimeSince( site.score_time );
		}
		thisItem += ' </small>';
		thisItem += '</p> </div> </div>';
		return thisItem;
	}

	runSecondaryJavascript() {

		var thisMap = this.map = LeafletHelper.getMapFromAreaFinder( this.area, 'dive-sites-map');

		var diverIcon = LeafletHelper.getIcon();
		// add point
		$.each(this.sites, function(key, site){

			var marker = L.marker(
				[ site.latitude, site.longitude ],
				{icon: diverIcon}
			);
			marker.site_id   = site.id;
			marker.region_id = site.region;
			marker.on( 'click', function(e) {
				//console.log( e);
				showSiteDetail(e.target.site_id,e.target.region_id);
			});
			marker.addTo(thisMap);

		});

		//console.log( maxBounds);
		//console.log( this.area.getCentrePoint());
	}
}
