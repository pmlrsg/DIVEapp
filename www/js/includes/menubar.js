function showAbout() {

	display.display( getAboutContent());

	menuBar.setBackButton( "showHomePage();");
}

function getAboutContent() {
	return `
<div class="container listColours">
  <div class="row" style="height:200px;">
     <div class="col-12"><h1>The Dive visibilty app</h1></div>
     <div class="col-12">Brought to you by Plymouth Marine Laboratory</div>
     <div class="col-12"><p>Powered by: Leaflet, frappe-charts, CreoDIAS, OpenStreetMap and PML</div>
  </div>
</div>
`;
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
		html +=  '<div class="col-6 title" onclick="showHomePage();" style="text-align:left">';
		html +=   '<div class="row">';
		html +=    '<div class="col-1">';
		html +=     '<img class="dive-logo-small" src="img/dive-app-22.png" />';
		html +=    '</div>';
		html +=    '<div class="col-2">';
		html +=    'DIVE</div></div></div>';
		html +=  '<div class="col-6">';
		html +=   '<div class="row justify-content-end">';
		html +=    '<div id="back-button" class="col-2"></div>';
		html +=    '<div class="col-1" style="padding-right:25px;"><input type="checkbox" id="nav-check" />';
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
