const updateCartView = function(cart) {
    const numberOfItems = Object.keys(cart).length;
    if (numberOfItems === 0) {
        $("#cart").hide();
        $("#schedule-btn").prop('disabled', true);
    } else {
        $("#cart").show();
        $("#cart span#numberOfItems").text(numberOfItems);
        $("#schedule-btn").prop('disabled', false);
        $("#schedule-btn").css("background-color", "#ff4440");
        $("#schedule-btn").css("color", "#fff");
    }
}

$(document).ready(function() {
    const mymap = L.map('mapid').setView([18.4655, -66.1057], 13);
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

    $("#schedule-btn").click(function() {
        $.ajax({
            url : '/plan',
            type: "POST",
            dataType : "json",
            data: cart,
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
    var time = Math.random() * 100;
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
