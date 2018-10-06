const updateCartView = function(cart) {
    const numberOfItems = Object.keys(cart).length;
    if (numberOfItems === 0) {
        $("#cart").hide();
    } else {
        $("#cart").show();
        $("#cart span#numberOfItems").text(numberOfItems);
    }
}

$(document).ready(function() {
    const mymap = L.map('mapid').setView([18.2208, -66.4301], 9);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mymap);

    var hoverMarker = undefined;
    const cart = {};

    $(".card").hover(function() {
        let element = $(this);
        let lat = element.data('lat');
        let lon = element.data('lon');

        if (hoverMarker) {
            hoverMarker.remove();
        }
        hoverMarker = L.marker([lat, lon]).addTo(mymap);
        mymap.panTo(new L.LatLng(lat, lon));
    });

    $(".card").click(function() {
        let element = $(this);
        let id = element.data('id');
        let lat = element.data('lat');
        let lon = element.data('lon');
        
        // Update model
        if (id in cart) { // then remove
            delete cart[id];
        } else {
            cart[id] = {'id': id, 'name': name, 'lat': lat, 'lon': lon};
        }

        // Update view
        updateCartView(cart);
        element.toggleClass('selected');
        console.log(cart);
    });
});
