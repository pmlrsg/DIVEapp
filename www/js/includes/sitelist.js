/** hander to show sites for a specific regions
    bound to the onclick event for each region **/
function showSiteDetail( site, region) {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: "https://diveapi.eofrom.space/v1/sites/"+site,
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
	}

	compileListMarkup( sites, region) {
		var items = [];
		var sl = this; /* provide reference to this object from inside of each */
		$.each(sites, function(key, val){

			var thisItem = sl.getSiteMarkup( val, region);
			console.log( 'adding new site' );
			console.log( thisItem );
			items.push(  thisItem);
		});
		return items.join( '');
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
}
