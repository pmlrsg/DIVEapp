/** hander to show sites for a specific regions
    bound to the onclick event for each region **/
function showSitesFromRegion( region) {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: "https://diveapi.eofrom.space/v1/sites?region="+region,
		success: function (data) {
			$('#dive-sites').html(siteList.compileListMarkup(data, region));
			$('#dive-regions').hide();
			$('#dive-sites').show();
			$('#dive-site-detail').hide();
			menuBar.setBackButton( "app.fetchFeed();")
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
	}

	compileListMarkup( sites) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */
		var count = 1;
		$.each(sites, function(key, val){

			var thisItem = sl.getRegionMarkup( val, (count % 2 ) == 0);
			console.log( 'adding new region' );
			console.log( thisItem );
			items.push(  thisItem);
			count++;
		});
		return items.join( '');
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
		/* replaced by smart css
		if ( odd ) {
			console.log( "this one is odd");
			thisItem += " dive-list-odd";
		} else {
			console.log( "this one is even");
			thisItem += " dive-list-even";
		} */
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
}
