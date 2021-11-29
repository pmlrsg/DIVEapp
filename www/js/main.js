var config      = new Config();
var siteList    = new SiteList();
var regionList  = new RegionList();
var menuBar     = new MenuBar();
var siteDetails = new SiteDetails();
var display     = new DisplayController();

$(document).ready(function() {

	// "break" history
	var counter = 0;
	history.pushState("page"+counter, null, null);
    window.onpopstate = function () {
		counter++;
        history.pushState('page'+counter, null, null);
        // Handle the back (or forward) buttons here
        // Will NOT handle refresh, use onbeforeunload for this.
		menuBar.goBack();
    };
	/** old method, swear this worked once
	window.history.pushState('forward', null, null);
	$(window).on('popstate', function() {

		//window.history.pushState('forward', null, null);
		console.log( "back event firing");
		menuBar.goBack();
	}); /* */


	// start app
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
		display.display(
			regionList.compileListMarkup(data),
			regionList
		);
		menuBar.clearBackButton();
	},
	onError: function(data, textStatus, errorThrown) {
        console.error('Data: ');
		console.error(data);
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },
};
