var siteList    = new SiteList();
var regionList  = new RegionList();
var menuBar     = new MenuBar();
var siteDetails = new SiteDetails();

$(document).ready(function() {
	menuBar.drawMenuBar( "#header-bar");
	$('#main-app-div').hide();
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
			//contentType: 'application/json',
			url: app.api_url,
			success: app.onSuccess,
			error: app.onError
		});
    },
	// Update DOM on a Success Event
	onSuccess: function(data) {
		$('#dive-regions').html(regionList.compileListMarkup(data));
		$('#dive-sites').hide();
		$('#dive-regions').show();
		$('#dive-site-detail').hide();
		menuBar.clearBackButton();
		},
	onError: function(data, textStatus, errorThrown) {
        console.error('Data: ');
		console.error(data);
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },
};
