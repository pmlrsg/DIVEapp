/**
 *       Settings page
 *
 * requires config to be loaded first
 */

function showSettings() {
	$.ajax({
		type: "GET",
		dataType: 'json',
		//contentType: 'application/json',
		url: app.api_url, // region list
		success: function(regions) {
			display.display(
				settingsPage.compileListMarkup(regions));
			menuBar.setBackButton( "showHomePage();");
		},
		error: app.onError });
}

class SettingsPage {

	constructor() {
		this.showLeftOvers = false;
	}

	compileListMarkup( regions) {
		var html       = '';
		var currentRegion = config.getHomePage();
		var defaultChecked = '';
		if ( -1 == currentRegion){
			defaultChecked = ' selected'
		}
		var homeSelect = `<select id="dive-settings-homepage" onchange="settingsPage.updateDefaultRegion();"><option value="-1"${defaultChecked}>All</option>`;
		$.each( regions, function( key, region) {
			var thisOption = `<option value="${region.id}"`;
			if ( region.id == currentRegion){
				thisOption += ' selected';
			}
			thisOption += `>${region.name}</option>`;
			homeSelect += thisOption;
		});
		homeSelect    += '</select>';
		html          += `
<div class="container listColours">
<div class="row" style="height:200px;">
     <div class="col-12"><h1>Settings</h1></div>
     <div class="col-12">Configure your options below</div>`;
		var darkModeCheck = " checked";
		if ( ! config.getDarkMode()) {
			darkModeCheck = "";
		}
		html += `<div class="col-12">Dark mode: <input id="dive-settings-darkmode" type="checkbox"${darkModeCheck} onchange="settingsPage.updateDarkMode();" /></div>`;

		if ( this.showLeftOvers) {
			html += `<div class="col-12">Show catch all region <input type="checkbox" /></div>`;
		}
		html += `<div class="col-12">Display home region: ${homeSelect}</div>
</div>
</div>
`;

		return html;
	}

	updateDarkMode() {
		var darkModeChecked = $('#dive-settings-darkmode').is(':checked');
		config.setDarkMode(  darkModeChecked);
		display.setDarkMode( darkModeChecked);
	}

	updateDefaultRegion() {
		var selectedRegion = $('#dive-settings-homepage').val();
		config.setHomePage( selectedRegion);
	}
}

var settingsPage = new SettingsPage();
