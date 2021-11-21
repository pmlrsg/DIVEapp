
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

		thisMarkup += '<div class="col col-md-6" id="dive-regions-map-side">';
		thisMarkup += '<div class="row">';
		thisMarkup += '<div class="col" id="dive-regions-map-container">';
		thisMarkup += '<div id="dive-regions-map"></div></div></div>';
		thisMarkup += '<div class="row">';
		thisMarkup += '<div class="col" id="dive-regions-wide-padding"></div></div></div>'
		//thisMarkup += '<div class="col col-md-6" id="dive-sites-null" style="height: 500px;"></div>';
		thisMarkup += '<div class="col col-md-6" id="dive-regions-list">';

		$.each(config.favoriteData, function( key,val) {
			thisArea.considerThis( val.latitude, val.longitude);
			var thisItem = SiteList.getSiteMarkup( val, val.region);
			items.push( thisItem);
		});
		$.each(regions, function(key, val){

			if ( !config.SHOW_REGION_ALL && val.id == 0 ) {
				console.log( 'skipping global region' );
			} else {
				var thisItem = sl.getRegionMarkup( val);
				thisArea.considerThis( val.maxy, val.maxx );
				thisArea.considerThis( val.miny, val.minx );
				//console.log( 'adding new region' );
				//console.log( thisItem );
				items.push(  thisItem);
				count++;
			}
		});
		thisMarkup += items.join( '');
		thisMarkup += '<div>';
		return( thisMarkup);
	}

	getRegionMarkup( region) {
		var siteCount = 0;
		if ( region.site_count && region.site_count > 0 ) {
			siteCount = region.site_count;
		}
		var thisItem  = '';
		thisItem += '<div class="card mb-3 listColours"'
		if ( siteCount > 0) {
			thisItem += ' onclick="showSitesFromRegion('+region.id+')"';
		}
		thisItem += '>';
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
		thisItem += ' </div> </div>';
		return thisItem;
	}

	runSecondaryJavascript() {

		var thisMap = this.map = LeafletHelper.getMapFromAreaFinder( this.area, 'dive-regions-map');

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
			shape.region_id   = region.id;
			shape.region_name = region.name;
			/*
			shape.on( 'click', function(e) {
				//console.log( e);
				showSitesFromRegion(e.target.region_id);
			}); */
			shape.addTo(thisMap);

		});

		// handle region overlap
		thisMap.on( 'click', function(e) {
			var clickedLayers = [];
			var point = e.latlng;
			thisMap.eachLayer( function( layer){
				if (layer.getBounds) {
					var bounds = layer.getBounds();
					if ( bounds.contains( point)) {
						clickedLayers.push( layer);
					}
				}
			});
			switch( clickedLayers.length) {
			case 0:
				// no layers, don't care
				break;
			case 1:
				// one layer just treat it as a normal click
				showSitesFromRegion(clickedLayers[0].region_id);
				break;
			default:
				// pop up menu time

				var content = '';
				$.each( clickedLayers, function( index, layer){
					console.log( layer);
					content += '<p onclick="showSitesFromRegion('+layer.region_id+');">'+ layer.region_name +'</p>';
				});

				var popup = L.popup()
					.setLatLng( point)
					.setContent( content)
					.openOn( thisMap);
				break;
			}
		});

	}
}
