class Config {

	constructor() {

		this.DEMO_MODE = true;
		this.DEMO_MODE_DELAY = 3000;

		this.SHOW_REGION_ALL = true;

		this.URL_BASE_API = 'https://diveapi.eofrom.space/v1/';
		this.URL_REGIONS  = this.URL_BASE_API + 'regions';
		this.URL_SITES    = this.URL_BASE_API + 'sites?region=';
		this.URL_SITE     = this.URL_BASE_API + 'sites/';

	}

}
