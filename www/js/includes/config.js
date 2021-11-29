class Config {

	constructor() {

		this.DEMO_MODE = true;
		this.DEMO_MODE_DELAY = 2000;

		this.SHOW_REGION_ALL = false;

		this.URL_BASE_API = 'https://diveapi.eofrom.space/v1/';
		this.URL_REGIONS  = this.URL_BASE_API + 'regions';
		this.URL_SITES    = this.URL_BASE_API + 'sites?region=';
		this.URL_SITES_SPECIFIC = this.URL_BASE_API + 'sites?site_list='
		this.URL_SITE     = this.URL_BASE_API + 'sites/';

		this.LOG_LEVEL_ERROR   = 1;
		this.LOG_LEVEL_WARNING = 2;
		this.LOG_LEVEL_INFO    = 4;
		this.LOG_LEVEL_DEBUG   = 8;

		this.current_log_level = 1;

		// check favorites
		this.favorites = [];
		var storedFavorites = window.localStorage.getItem( 'dive-favorites');
		if ( null != storedFavorites){
			this.favorites = JSON.parse( storedFavorites);
		}
		this.favoriteData = []
	}

	_writeFavorites( arrFavorites){
		window.localStorage.setItem(
			'dive-favorites',
			JSON.stringify(arrFavorites));
	}

	populateFavorites() {
		if ( this.favorites.length > 0 ) {
			var url = this.URL_SITES_SPECIFIC + this.favorites.join()
			return $.ajax({
				type:     "GET",
				dataType: 'json',
				//contentType: 'application/json',
				url: url,
				success: function(data) {
					config.favoriteData = data;
				},
				error: app.onError
			});
		} else {
			return {
				then: function( thing) {
					thing();
				}
			}
		}
	}

	// add a site to the favorites
	// returns whether it did anything or not
	addFavorite( idSite) {
		if ( !this.favorites.includes( idSite)){
			this.favorites.push( idSite);
			this._writeFavorites( this.favorites);
			return true
		}
		return false;
	}

	// returns true if removed
	removeFavorite( idSite) {
		if ( this.isFavorite( idSite)) {
			var position = this.favorites.indexOf( idSite);
			if ( position > -1) {
				this.favorites.splice( position, 1);
				this._writeFavorites( this.favorites);
				return true; // removed
			}
		}
		return false; // did nothing
	}

	isFavorite( idSite) {
		return this.favorites.includes( idSite);
	}

	getFavorites() {
		return this.favorites;
	}

	// returns true if added or false if removed
	toggleFavorites( idSite) {
		if ( this.isFavorite( idSite)) {
			this.removeFavorite( idSite);
			return false;
		} else {
			this.addFavorite( idSite);
			return true;
		}
	}
}
