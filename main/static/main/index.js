var navigateToGooglePlace = function(place) {
    var position = place.geometry.location;
    var lat = position.lat();
    var lng = position.lng();
    window.location.href = "/planning?lat=" + lat + "&lon=" + lng;
};

$(document).ready(function() {
    var input = document.getElementById('searchTextField');
    var options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'pr'},
        strictBounds: true,
    };

    var sessionToken = new google.maps.places.AutocompleteSessionToken();
    var service = new google.maps.places.AutocompleteService();  // For if the user doesn't select from autocomplete
    var placesService = new google.maps.places.PlacesService(document.createElement('div'));
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.setFields(['geometry']);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        if (place.geometry) {
            navigateToGooglePlace(place);
        } else {
            service.getPlacePredictions({
                input: place.name,
                sessionToken: sessionToken,
                ...options,
            }, function(predictions, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                     alert(status);
                    return;
                }

                placesService.getDetails({ placeId: predictions[0].place_id, fields: ['geometry'] }, function(place2, status2) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        navigateToGooglePlace(place2);
                    }
                });
            });
        }
    });
});
