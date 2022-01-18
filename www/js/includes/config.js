class Config {

	constructor() {

		this.DEMO_MODE = true;
		this.DEMO_MODE_DELAY = 2000;

		this.SHOW_REGION_ALL = false;

		this.URL_BASE_API = 'https://diveapi.eofrom.space/v1/';
		this.URL_REGION   = this.URL_BASE_API + 'regions/';
		this.URL_REGION_WITH_SITES_SUFFIX     = '?with_sites=true';
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
		this.darkMode = true;
		var storedDarkmode = window.localStorage.getItem( 'dive-dark-mode');
		if ( null != storedDarkmode){
			this.darkMode = JSON.parse( storedDarkmode);
		}
		this.denseMode = false;
		var storedDensemode = window.localStorage.getItem( 'dive-dense-mode');
		if ( null != storedDensemode){
			this.denseMode = JSON.parse( storedDensemode);
		}
		this.favoriteData = []
		this.homePage = null;
	}

	_writeLocalStorage( key, value) {
		window.localStorage.setItem(
			key,
			JSON.stringify(value));
	}

	_writeFavorites( arrFavorites){
		this._writeLocalStorage(
			'dive-favorites',
			arrFavorites);
	}

	_writeHomePage( homePage){
		this._writeLocalStorage(
			'dive-home-page',
			homePage);
		this.homePage = homePage;
	}

	_writeDarkMode( isDark) {
		this._writeLocalStorage(
			'dive-dark-mode',
			isDark);
		this.darkMode = isDark;
	}

	_writeDenseMode( isDense) {
		this._writeLocalStorage(
			'dive-dense-mode',
			isDense);
		this.denseMode = isDense;
	}

	getHomePage() {
		if ( null == this.homePage){
			this.homePage = window.localStorage.getItem( 'dive-home-page');
			if ( null == this.homePage){
				this.homePage = -1;
			} else {
				this.homePage = JSON.parse( this.homePage);
				if ( ! $.isNumeric( this.homePage)) {
					this.homePage = -1;
				}
			}
		}
		return this.homePage;
	}

	setHomePage( homePage) {
		if ( $.isNumeric(homePage) && (homePage > -2)) {
			if ( homePage != this.homePage){
				this.homePage = homePage;
				this._writeHomePage( homePage);
			}
			return true;
		}
		return false;
	}

	getDarkMode() {
		return this.darkMode;
	}

	setDarkMode( mode) {
		if ( mode != this.mode) {
			this._writeDarkMode( mode);
			this.darkMode = mode;
		}
		return true;
	}

	getDenseMode() {
		return this.denseMode;
	}

	setDenseMode( mode) {
		if ( mode != this.mode) {
			this._writeDenseMode( mode);
			this.denseMode = mode;
		}
		return true;
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
					console.log( data);
				},
				error: diveError.getErrorHandler( diveError.AREA_FAVORITES)
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
	addFavorite( site) {
		if ( !this.favorites.includes( site.id)){
			this.favorites.push( site.id);
			this._writeFavorites( this.favorites);
			this.favoriteData.push( site);
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
				var dataPoint = -1;
				$.each( this.favoriteData, function( key, d) {
					if ( d.id == idSite) {
						dataPoint = key;
					}
				});
				if (dataPoint > -1) {
					delete this.favoriteData.splice( dataPoint, 1);
				}

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
	toggleFavorites( site) {
		if ( this.isFavorite( site.id)) {
			this.removeFavorite( site.id);
			return false;
		} else {
			this.addFavorite( site);
			return true;
		}
	}
}
