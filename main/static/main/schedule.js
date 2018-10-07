$(document).ready(function() {
    const mymap = L.map('mapid');
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>. Icon made by <a href="https://roundicons.com/">Roundicons</a> from www.flaticon.com',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mymap);

    var numberedIcons = [];
    for (var i = 0; i < 10; i++) {
    	numberedIcons.push(L.icon({
		    iconUrl: 'static/main/numberedIcons/'+i+'.png',
		    iconSize: [30, 30], // size of the icon
		}));
    }

    let latlngs = [];
    let lats = [];
    let lngs = [];
    console.log(numberedIcons);
    $(".stop").each(function(i, e) {
    	let lat = $(e).data('lat');
    	let lon = $(e).data('lon');

    	latlngs.push([lat, lon]);
    	lats.push(lat);
    	lngs.push(lon);
    	console.log(i);
    	L.marker([lat, lon], {icon: numberedIcons[i+1]}).addTo(mymap);
    });
    L.polyline(latlngs, {color: 'blue'}).addTo(mymap);

    // calc the min and max lng and lat
	var minlat = Math.min.apply(null, lats),
	    maxlat = Math.max.apply(null, lats);
	var minlng = Math.min.apply(null, lngs),
	    maxlng = Math.max.apply(null, lngs);

	// create a bounding rectangle that can be used in leaflet
	bbox = [[minlat,minlng],[maxlat,maxlng]];

	// add the bounding box to the map, and set the map extent to it
	// L.rectangle(bbox).addTo(map);
	mymap.fitBounds(bbox, {padding: [33, 33]});
});
