class MenuBar {

	constructor() {
		this.back   = null;
		this.lastId = null;
	}

	drawMenuBar( divId) {
		var html = '';
		this.lastId = "#back-button";
		html += '<div class="row" style="background-color:#016676;color:white">';
		html += '<div class="col col-md-2 title" style="text-align:left">DIVE</div>';
		html += '<div id="back-button" class="col col-md-10" style="text-align:right"></div>';
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
