

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

		thisMarkup += '<div class="col-md-6 col-12" class="dive-map-side">';
		thisMarkup += '<div class="row dive-map-container-row">';
		thisMarkup += '<div class="col dive-map-container">';
		thisMarkup += '<div id="dive-regions-map" class="dive-map-actual"></div></div></div>';
		thisMarkup += '<div class="row">';
		thisMarkup += '<div class="dive-side-placeholder"></div></div></div>'
		thisMarkup += '<div class="col-md-6 col-12 dive-list">';

		// display favorites at the top of the list
		$.each(config.favoriteData, function( key,val) {
			thisArea.considerThis( val.latitude, val.longitude);
			var thisItem = SiteList.getSiteMarkup( val, val.region, true);
			items.push( thisItem);
		});
		$.each(regions, function(key, val){

			if ( !config.SHOW_REGION_ALL && val.id == 0 ) {
				// nothing here
			} else {
				var thisItem = sl.getRegionMarkup( val);
				if ( val.maxy && val.maxx && val.miny && val.minx ) {
					thisArea.considerThis( val.maxy, val.maxx );
					thisArea.considerThis( val.miny, val.minx );
				}
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
		thisItem += '<div class="card col-12 listColours"'
		if ( siteCount > 0) {
			thisItem += ' onclick="showSitesFromRegion('+region.id+')"';
		}
		thisItem += '>';
		thisItem += '<img class="card-img-top img-responsive">';
		thisItem += '<div class="card-block">';
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
			if ( region.maxy && region.maxx && region.miny && region.minx ) {
				var shape = L.rectangle(
					[[ region.maxy||0, region.maxx||0 ], [ region.miny||0, region.minx||0 ]],
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
			}

		});

		// handle region overlap with selector popup
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
