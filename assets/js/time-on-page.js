// Time on page → GoatCounter events.
//
// GoatCounter only stores totals, never individual visits, and has no
// "time on page" feature. So when the visitor leaves a page (closes the tab,
// navigates away, switches tabs/apps) we send ONE event whose name is the
// page plus a time bracket, e.g. "time: /about/ · 30s–1m". In the dashboard
// each bracket becomes its own row with a count per hour/day.
//
// Notes:
// - Only time while the tab is visible counts. A page opened in a background
//   tab starts its clock when it is first shown.
// - Sent once per page view, on the first time the page is hidden.
//   Coming back and leaving again doesn't send a second event.
// - Uses navigator.sendBeacon so the request survives the page closing.
//   goatcounter.url() returns nothing on localhost or when this browser
//   was excluded with #toggle-goatcounter, so those visits aren't logged.
// - Phones sometimes kill tabs without warning, so some visits never report.
(function () {
	var BRACKETS = [
		[10, '0–10s'],
		[30, '10–30s'],
		[60, '30s–1m'],
		[180, '1–3m'],
		[600, '3–10m'],
		[Infinity, '10m+']
	];

	var start = document.visibilityState === 'visible' ? performance.now() : null;
	var sent = false;

	function bracket(seconds) {
		for (var i = 0; i < BRACKETS.length; i++) {
			if (seconds < BRACKETS[i][0]) return BRACKETS[i][1];
		}
	}

	function send() {
		if (sent || start === null || !window.goatcounter) return;
		sent = true;
		var seconds = (performance.now() - start) / 1000;
		var label = bracket(seconds);
		var vars = {
			path: 'time: ' + location.pathname + ' · ' + label,
			title: label + ' on ' + document.title,
			event: true
		};
		var url = window.goatcounter.url && window.goatcounter.url(vars);
		if (url && navigator.sendBeacon) {
			navigator.sendBeacon(url);
		} else if (url) {
			window.goatcounter.count(vars);
		}
	}

	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'visible') {
			if (start === null) start = performance.now();
		} else {
			send();
		}
	});
	// Fallback for browsers that skip visibilitychange on unload.
	window.addEventListener('pagehide', send);
})();
