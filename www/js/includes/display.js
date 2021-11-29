/**
 * Class for handling display of the current page when given the html
 */
var display_object = null;

const DISPLAY_DIV_PREFIX = 'dive-display-div-';

class DisplayController {

	constructor() {
		this.divOptions     = [ "first", "second"];
		this.currentDivName = this.divOptions[ 0];
	}

	getNextDiv() {
		/* swap between the two options */
		var currentIndex = this.divOptions.indexOf( this.currentDivName);
		var nextDivIndex = Math.abs( currentIndex - 1);
		var nextDiv      = this.divOptions[ nextDivIndex];
		return nextDiv;
	}

	display( html, object=null) {
		var currentDivName = '#' + DISPLAY_DIV_PREFIX + this.currentDivName;
		var currentDiv     = $( currentDivName);
		var nextDivSuffix  = this.getNextDiv();
		var nextDivName    = '#' + DISPLAY_DIV_PREFIX + nextDivSuffix;
		var nextDiv        = $( nextDivName);
		display_object = nextDiv;
		nextDiv.html( html);
		currentDiv.hide();
		nextDiv.show();
		currentDiv.empty();
		if ( null != object) {
			object.runSecondaryJavascript();
		}
		this.currentDivName = nextDivSuffix;
	}
}
