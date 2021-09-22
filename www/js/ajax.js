$(document).ready(function() {
    app.fetchFeed();
});

var app = {
	api_url: "https://diveapi.eofrom.space/v1/regions",
	// deviceready Event Handler
	onDeviceReady: function() {
		console.log('deviceready');
    },
	// API call
	fetchFeed: function() {
		$.ajax({
			type: "GET",
			dataType: 'json',
			contentType: "application/json", // always put this (??)
			url: app.api_url,
			success: app.onSuccess,
			error: app.onError
		});
    },
	// Update DOM on a Success Event
	onSuccess: function(data) {
		var items = [];
		var thisObj = this;
		$.each(data, function(key, val){

			//var thisItem = thisObj.createRegionCard(val);

			var thisItem =  '<div class="card mb-3">';
			thisItem += '<img class="card-img-top img-responsive">';
			thisItem += '<div class="card-block"> <h4 class="card-title">'+ val.name +'</h4>';
			thisItem += '<p class="card-text">'+ val.description +'</p>'
			pluralText = "s";
			if ( val.site_count == 1) {
				pluralText = "";
			}
			thisItem += '<p class="card-text"><small class="text-muted">Contains '+val.site_count+' site'+pluralText+'</small>';
			thisItem += '</p> </div> </div>';
			console.log( 'adding new region' );
			console.log( thisItem );
			items.push(thisItem);
		});
		$('#dive-sites').html(items.join(''));
	},
	onError: function(data, textStatus, errorThrown) {
        console.error('Data: ');
		console.error(data);
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },

};


var sites = {
	api_url: "https://diveapi.eofrom.space/v1/sites",
	// deviceready Event Handler
	onDeviceReady: function() {
		console.log('deviceready');
    },
	// API call
	fetchFeed: function() {
		$.ajax({
			type: "GET",
			dataType: 'json',
			contentType: "application/json", // always put this (??)
			url: app.api_url,
			success: app.onSuccess,
			error: app.onError
		});
    },
	// Update DOM on a Success Event
	onSuccess: function(data) {
		var items = [];
		$.each(data, function(key, val){

			var thisItem = createDiveSite( val);

			var thisItem =  '<div class="card mb-3">';
			thisItem += '<img class="card-img-top img-responsive">';
			thisItem += '<div class="card-block"> <h4 class="card-title">'+ val.name +'</h4>';
			thisItem += '<p class="card-text">'+ val.description +'</p>'
			thisItem += '<p class="card-text"> Current Score: '+ val.latest_score +'</p>'
			thisItem += '<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small>';
			thisItem += '</p> </div> </div>';
			console.log( 'adding new site' );
			console.log( thisItem );
			items.push(thisItem);
		});
		$('#dive-sites').html(items.join(''));
	},
	onError: function(data, textStatus, errorThrown) {
        console.error('Data: ');
		console.error(data);
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },
};

function createDiveSite( site) {
	var thisItem =  '<div class="card mb-3">';
	thisItem += '<img class="card-img-top img-responsive">';
	thisItem += '<div class="card-block">';
	thisItem += '<h4 class="card-title">'+ site.name +'</h4>';
	thisItem += '<p class="card-text">'+ site.description +'</p>'
	thisItem += '<p class="card-text"> Current Score: '+ site.latest_score +'</p>'
	thisItem += '<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small>';
	thisItem += '</p> </div> </div>';
}
