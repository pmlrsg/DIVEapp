/** handler to show sites for a specific regions
    bound to the onclick event for each region **/
function showSiteDetail( site, region) {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: config.URL_SITE+site,
		success: function (data) {
			$('#dive-site-detail').html(siteDetails.compileListMarkup(data));
			$('#dive-regions').hide();
			$('#dive-sites').hide();
			$('#dive-site-detail').show();
			menuBar.setBackButton( "showSitesFromRegion("+region+");")
			siteDetails.runSecondaryJavascript();
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
		thisMarkup += '<div class="col col-md-6" id="dive-sites-map" style="height: 500px;"></div>';
		//thisMarkup += '<div class="col col-md-6" id="dive-sites-null" style="height: 500px;"></div>';
		thisMarkup += '<div class="col col-md-6" id="dive-sites-list">';
		$.each(sites, function(key, val){

			var thisItem = sl.getSiteMarkup( val, region);
			thisArea.considerThis( val.latitude, val.longitude);
			//console.log( 'adding new site');
			//console.log( thisItem);
			items.push(  thisItem);
		});

		thisMarkup += items.join('');
		thisMarkup += '<div>';
		return( thisMarkup);
	}

	getSiteMarkup( site, region) {
		var thisItem = '';
		thisItem += '<a class="invisiLink" onclick="showSiteDetail('+site.id+','+region+')">';
		thisItem += '<div class="card mb-3 listColours">';
		thisItem += '<img class="card-img-top img-responsive">';
		thisItem += '<div class="card-block">'
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
		thisItem += '</a>';
		return thisItem;
	}

	runSecondaryJavascript() {

		var maxBounds = [[this.area.maxLat, this.area.maxLat], [this.area.minLon, this.area.minLon]]

		var diverIcon = LeafletHelper.getIcon();
		console.log( diverIcon);
		// map config
		var mapConfig =  {
			center: this.area.getCentrePoint(),
			zoom: 4 //,
			//maxBounds: maxBounds
		}

		// create map
		var thisMap = this.map = L.map(
			'dive-sites-map',
			mapConfig);

		// add basemap
		LeafletHelper.getBaseLayer().addTo( this.map);

		// add point
		$.each(this.sites, function(key, site){
			//console.log( "Adding: (" + key + ") "+ site.latitude + ", " + site.longitude );

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
