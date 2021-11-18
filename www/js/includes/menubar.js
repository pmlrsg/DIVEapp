class MenuBar {

	constructor() {
		this.back   = null;
		this.lastId = null;
	}

	drawMenuBar( divId) {
		var html = '';
		this.lastId = "#back-button";
		html += '<div class="row justify-content-end" style="background-color:#016676;color:white">';
		html += '<div class="col col-xs-2 title" onclick="app.sortRegionList();" style="text-align:left">';
		html += '<div class="row"><div class="col col-xs-2">';
		html += '<img class="dive-logo-small" src="img/dive-app-22.png" />';
		html += '</div><div class="col col-xs-2">';
		html += 'DIVE</div></div></div>';
		html += '<div id="back-button" class="col col-xs-2 float-right" style="text-align:right;float:right"></div>';
		html += '</div>';
		$(divId).html(html);
	}

	setBackButton( onclick) {
		var html = '';
		html = '<a style="text-decoration:none;color:inherit" onclick="'+onclick+'">Back</button>';
		$("#back-button").html(html);
	}

	clearBackButton() {
		if ( this.lastId && this.lastId != null ) {
			$(this.lastId).html("");
		}
	}
}
