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
