var config      = new Config();
var siteList    = new SiteList();
var regionList  = new RegionList();
var menuBar     = new MenuBar();
var siteDetails = new SiteDetails();

$(document).ready(function() {
	if ( config.DEMO_MODE) {
		setTimeout( initialiseApp, config.DEMO_MODE_DELAY);
	} else {
		initialseApp();
	}
});

function initialiseApp() {
	menuBar.drawMenuBar( "#header-bar");
	$('#main-app-div').hide();
	// run favorites call then get the regions
	app.sortRegionList();
}

var app = {
	api_url: config.URL_REGIONS,
	// deviceready Event Handler
	onDeviceReady: function() {
		console.log('deviceready');
    },
	sortRegionList: function() {
		config.populateFavorites().then(app.fetchFeed);
	},
	fetchFeedChained: function( data, textStatus, jqXHR) {
		app.fetchFeed();
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
		regionList.runSecondaryJavascript();
	},
	onError: function(data, textStatus, errorThrown) {
        console.error('Data: ');
		console.error(data);
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },
};
