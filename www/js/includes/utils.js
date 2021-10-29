function humanTimeSince(isoDate) {

	var then = new Date( isoDate);
	var timeStamp = then.getTime();
	//console.log( then.getTime());

	var ago = " ago"

	var now = new Date(),
		secondsPast = (now.getTime() - timeStamp) / 1000;
	//console.log( now.getTime());
	if (secondsPast < 60) {
		return parseInt(secondsPast) + 's' + ago;
	}
	if (secondsPast < 3600) {
		return parseInt(secondsPast / 60) + 'm' + ago;
	}
	if (secondsPast <= 86400) {
		return parseInt(secondsPast / 3600) + 'h' + ago;
	}
	if (secondsPast > 86400) {
		day   = then.getDate();
		month = then.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
		year  = then.getFullYear() == now.getFullYear() ? "" : " " + then.getFullYear();
		return day + " " + month + year;
	}
}

class AreaFinder {
	constructor() {
		this.minLat =  Infinity;
		this.maxLat = -Infinity;
		this.minLon =  Infinity;
		this.maxLon = -Infinity;
	}

	considerThis( lat, lon) {
		if ( lat < this.minLat) {
			this.minLat = lat;
		}
		if ( lat > this.maxLat) {
			this.maxLat = lat;
		}
		if ( lon < this.minLon) {
			this.minLon = lon;
		}
		if ( lon > this.maxLon) {
			this.maxLon = lon;
		}
	}

	pad( padding) {
		this.maxLat += padding;
		this.maxLon += padding;
		this.minLat -= padding;
		this.minLon -= padding;
	}

	getCentrePoint() {
		return ([
			this.minLat + (this.maxLat - this.minLat) / 2,
			this.minLon + (this.maxLon - this.minLon) / 2]);
	}
}

function getAreaFinder() {
	return new AreaFinder();
}
