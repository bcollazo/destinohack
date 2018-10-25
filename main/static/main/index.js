$(document).ready(function() {
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(17.823942, -68.121335),
        new google.maps.LatLng(18.802253, -65.181211));

    var input = document.getElementById('searchTextField');
    var options = {
        bounds: defaultBounds,
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    // TODO: Set Fields for billing...

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        console.log(place);
        if (place.geometry) {
            var position = place.geometry.location;
            var lat = position.lat();
            var lng = position.lng();
            window.location.href = "/planning?lat=" + lat + "&lon=" + lng;
        }
    });


// var selections = [];
// $(".categories div").click(function(event) {
//     let key = $(this).data('key');

//     var index = selections.indexOf(key);
//     if (index > -1) {  // Then remove
//         selections.splice(index, 1);
//     } else { // else add.
//         selections.push(key);
//     }
//     $(this).toggleClass('selected');
// });

// $('button').click(function() {
//     const lat = $("#data").data('lat');
//     const lon = $("#data").data('lon');
//     window.location.href = '/planning?categories=' + selections.join(',') + "&lat=" + lat + "&lon=" + lon;
// });
});
