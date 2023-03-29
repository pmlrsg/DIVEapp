function showAbout() {
	display.display( getAboutContent());
	menuBar.setBackButton( "showHomePage();");
}

function showHelp() {
	display.display( getHelpContent());
	menuBar.setBackButton( "showHomePage();");
}

function getAboutContent() {
	return `
<div class="container listColours">
  <div class="row" style="min-height:200px;">
     <div class="col-12"><h1>DIVE - Simple water visibility information for dive planning</h1>
     <p>DIVE uses data from the EU Copernicus Marine Service to create a simple water visibility score for a dive site.</p><p>The DIVE app is currently in beta release and should not be used as the sole indicator of the suitability of a dive site.</p></p>DIVE is developed by the Centre for Geospatial Applications at <a href="https://pml.ac.uk">Plymouth Marine Laboratory</a> and we would welcome comments and suggestions for the improvement of the app. Please email us at <a href="mailto:eurogeoss@pml.ac.uk">eurogeoss@pml.ac.uk</a>.</p>
     <p>If you would like a specific dive site added to our system, feel free to email its details, along with it's latitude and longitude, to <a href="mailto:eurogeoss@pml.ac.uk?subject=Dive site addition request">eurogeoss@pml.ac.uk</a> for our consideration. Be aware that sites too close to the shore might not be suitable candidates due to land proximity confusing satellite sea surface observations.</p>
     <p>The DIVE app is built using these open source packages and services:
<table><tr><td>Leaflet</td><td><a href="https://leafletjs.com">https://leafletjs.com</a></td></tr>
<tr><td>Chart.js</td><td><a href="https://chartjs.org">https://chartjs.org</a></td></tr>
<tr><td>OpenStreetMap</td><td><a href="https://www.openstreetmap.org/about">https://www.openstreetmap.org/about</a></td></tr>
</table></p>
     <p>Funded by</p>
<div class="e-shape-logo-container"><a href="https://e-shape.eu/"><img class="dive-about-eshape-logo" src="img/e-shape-logo.png"></a></div>
  </div>
</div>
`;
}

function getHelpContent() {

	var thisHtml = `
<div class="container listColours">
  <div class="row" style="min-height:200px;">
     <div class="col-12"><h1>DIVE - Help</h1>
     <p>DIVE uses a scale from 1 to 5 to describe water visibilty, where 5 is high visibility for your area and 1 is poor visibility.</p>
     <p>We visibly represent these with icons in the following way.</p>
     <table class="table-header-centered">
        <tr><th>Score</th><th>Icon</th><th>Visibility</th></tr>
     `;
	for ( const n of [...Array(5).keys()].reverse()) {
		var imgNum = n + 1;
		thisHtml += `<tr><td>${imgNum}</td><td><img src="img/goggle-0${imgNum}-128x64.png"></td><td class="text-center">`;
		if ( 5 == imgNum) {
			thisHtml += 'High';
		} else if ( 1 == imgNum) {
			thisHtml += 'Poor';
		}
		thisHtml += '</td></tr>';
	}
	thisHtml += `
</table></p>
  </div>
</div>
`;
	return thisHtml;
}

class MenuBar {

	constructor() {
		this.back   = null;
		this.lastId = null;
	}

	drawMenuBar( divId) {
		var html = '';
		this.lastId = "#back-button";
		html += '<div class="row justify-content-end header-colours">';
		html +=  '<div class="col-6" onclick="showHomePage();" style="text-align:left">';
		html +=   '<div class="row no-gutters">';
		html +=    '<div class="col-1 col-header-logo">';
		html +=     '<img class="dive-logo-small" src="img/dive-app-22.png" />';
		html +=    '</div>';
		html +=    '<div class="col-2">';
		html +=    'DIVE</div></div></div>';
		html +=  '<div class="col-6">';
		html +=   '<div class="row justify-content-end no-gutters">';
		html +=    '<div id="back-button" class="col-3 col-sm-2"></div>';
		html +=    '<div class="col-1 col-header-menu"><input type="checkbox" id="nav-check" />';
		html +=     `<div class="nav-btn">
<label for="nav-check">
      <span></span>
      <span></span>
      <span></span>
    </label>
</div>`;
		// add drop down menu items
		html +=     `<div class="row header-bar-nav-items header-colours">
<div class="col col-xs-12" onclick="showSettings();menuBar.closeMenu();"> Settings </div>
<div class="col col-xs-12" onclick="showHelp();menuBar.closeMenu();"> Help </div>
<div class="col col-xs-12" onclick="showAbout();menuBar.closeMenu();"> About </div>`;
		html +=     '</div></div></div></div>';
		$(divId).html(html);
	}

	setBackButton( onclick) {
		var html = '';
		html = '<a style="text-decoration:none;color:inherit" onclick="'+onclick+'">Back</button>';
		$("#back-button").html(html);
		this.back = onclick;
	}

	clearBackButton() {
		if ( this.lastId && this.lastId != null ) {
			$(this.lastId).html("");
		}
		this.back = null;
	}

	goBack() {
		if ( null != this.back ) {
			$("#nav-check").prop("checked", false);
			$("#back-button").find( 'a')[0].click()
		}
	}

	closeMenu() {
		$( '#nav-check').prop( "checked",false); // close menu
	}
}
