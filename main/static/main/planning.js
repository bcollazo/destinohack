// San Juan
DEFAULT_LAT = 18.4655
DEFAULT_LON = -66.1057

const timesCart = [];

const updateCartView = function(cart) {
    const numberOfItems = Object.keys(cart).length;
    if (numberOfItems === 0) {
        $("#cart").hide();
        $("#schedule-btn").prop('disabled', true);
        $("#estimate").text('');
    } else {
        $("#cart").show();
        $("#cart span#numberOfItems").text(numberOfItems);
        $("#schedule-btn").prop('disabled', false);
        $("#schedule-btn").css("background-color", "#ff4440");
        $("#schedule-btn").css("color", "#fff");

        var sum = timesCart.reduce((a, b) => a + b, 0);
        var h = Math.trunc(sum / 60);
        var m = Math.floor(sum % 60);
        var maybeHours = h === 0 ? '' : h + 'h ' ;
        $("#estimate").text('~ ' + maybeHours + m + 'mins')
    }
}

$(document).ready(function() {
    const startLat = $("aside").data('slat') || DEFAULT_LAT;
    const startLng = $("aside").data('slon') || DEFAULT_LON;
    const mymap = L.map('mapid').setView([startLat, startLng], 15);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mymap);

    var hoverMarker = undefined;
    const cart = {};
    const markerCart = {};
    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    $(".card").hover(function() {
        let element = $(this);
        let lat = element.data('lat');
        let lon = element.data('lon');

        hoverMarker = L.marker([lat, lon]).addTo(mymap);
        mymap.flyTo(new L.LatLng(lat, lon));
    }, function() {
        if (hoverMarker) {
            hoverMarker.remove();
        }
    });

    $(".card").click(function() {
        let element = $(this);
        let id = element.data('id');
        let lat = element.data('lat');
        let lon = element.data('lon');

        // Update model
        if (id in cart) { // then remove
            delete cart[id];
            markerCart[id].remove()
            timesCart.pop();
        } else {
            markerCart[id] = L.marker([lat, lon], {icon: greenIcon}).addTo(mymap);
            cart[id] = {'id': id, 'name': name, 'lat': lat, 'lon': lon};
            timesCart.push(Math.random() * 60 + 30);
        }

        // Update view
        updateCartView(cart);
        element.toggleClass('selected');
        console.log(timesCart);
        var sum = timesCart.reduce((a, b) => a + b, 0);
        console.log(sum);
    });

    $("#schedule-btn").click(function() {
        $.ajax({
            url : '/plan',
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(cart),
            success: function(data){
                url = data['url'];
                navigateToSchedule();
            }
        });

        $("#mapid").hide();
        $("#loading").css('top', '0');
        incrementLoading(0, function() {
            loadingDone = true;
            navigateToSchedule();
        });
    });
});

let url = '';
let loadingDone = false;

const navigateToSchedule = function() {
    if (loadingDone && url !== '') {
        window.location.href = url;
    }
};


const incrementLoading = function(value, callback) {
    var time = Math.random() * 50;
    var timeout = setTimeout(function() {
        var bar1 = new ldBar("#loading .ldBar");
        bar1.set(value);
        $("#loading .ldBar").data('value', value);
        if (value < 100) {
            incrementLoading(value + 1, callback);
        } else {
            callback();
        }
    }, time);
};

// ========= Boiler plate code... ignore
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
