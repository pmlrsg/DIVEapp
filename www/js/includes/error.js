

class Error {

	constructor() {

		this.ERROR_NETWORK    = 'plankton';
		this.ERROR_SERVER     = 'cave fish';
		this.ERROR_TIMEOUT    = 'manatee';
		this.ERROR_API        = 'anemone';
		this.ERROR_JSON       = 'piranha';
		this.ERROR_ABORTED    = 'puffer fish';
		this.ERROR_JAVASCRIPT = 'dolphin';
		this.ERROR_UNKNOWN    = 'ocean sunfish';
		this.ERROR_LOCAL_STORAGE = 'penguin';

		this.AREA_REGION      = 'mysterious';
		this.AREA_SITE_LIST   = 'intangible';
		this.AREA_SITE        = 'uncanny';
		this.AREA_FAVORITES   = 'ambiguous';
		this.AREA_SETTINGS    = 'blatant';
		this.AREA_ABOUT       = 'incomprehensible';
		this.AREA_UNKNOWN     = 'clandestine';

		this.section          = this.AREA_UNKNOWN;

		this.errorMessages = {
			[this.ERROR_NETWORK]:    'Unable to contact server, check your network connection',
			[this.ERROR_API]:        'Unable to contact API',
			[this.ERROR_TIMEOUT]:    'Unable to contact API',
			[this.ERROR_SERVER]:     'Unable to contact server, check your network connection',
			[this.ERROR_ABORTED]:    'Connection aborted',
			[this.ERROR_JAVASCRIPT]: 'Internal Error',
			[this.ERROR_UNKNOWN]:    'An Unknown Error has occured'
		}
	}

	getErrorCode( jqXHR, exception) {
		var returnCode = null;
		if (jqXHR.status === 0) {
			returnCode = this.ERROR_NETWORK;
		} else if (jqXHR.status == 404) {
			returnCode = this.ERROR_API;
		} else if (jqXHR.status == 500) {
			returnCode = this.ERROR_SERVER;
		} else if (exception === 'parsererror') {
			returnCode = this.ERROR_JSON;
		} else if (exception === 'timeout') {
			returnCode = this.ERROR_TIMEOUT;
		} else if (exception === 'abort') {
			returnCode = this.ERROR_ABORTED;
		} else {
			returnCode = this.ERROR_UNKNOWN;
		}
		console.log( "AJAX ERROR: "+ returnCode + ' ' + jqXHR.responseText);
		console.log( jqXHR);
		return returnCode;
	}

	setSection( section) {
		this.section = section;
	}

	getErrorHandler( section){
		this.setSection( section);
		return this.handleAjaxError
	}

	handleAjaxError( jqXHR, exception, errorThrown) {
		var code = diveError.getErrorCode( jqXHR, exception);
		display.display( diveError.compileListMarkup( code), diveError);
	}

	compileListMarkup( errorCode) {

		var humanMessage = diveError.errorMessages[errorCode];
		var humanSection = diveError.section;

		var fullErrorCode = `${humanSection} ${errorCode}`;

		var html = `
<div class="container listColours">
<div class="row">
  <div class="col">
     <h1> An error has occured </h1>
     <p> ${humanMessage}</p>
     <p> Error code: ${fullErrorCode}</p>
     <p> To restart the app and try again click <a onclick="location.reload();" class="reload-link">reload</a> </p>
     <p> For more information, check our help pages at <a href="https://dive.eofrom.space/help">dive.eofrom.space/help</a></p>
     <p> or contact us by email on <a href="mailto:eurogeoss@pml.ac.uk?subject=App error: ${fullErrorCode}">eurogeoss@pml.ac.uk</a></p>
  </div>
</div>
</div>
`;

		return html;

	}

	runSecondaryJavascript() {
		return;
	}
}
