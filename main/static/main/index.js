$(document).ready(function() {
    var selections = [];

    $(".categories div").click(function(event) {
        let key = $(this).data('key');

        var index = selections.indexOf(key);
        if (index > -1) {  // Then remove
            selections.splice(index, 1);
        } else { // else add.
            selections.push(key);
        }
        $(this).toggleClass('selected');
    });

    $('button').click(function() {
        const lat = $("#data").data('lat');
        const lon = $("#data").data('lon');
        window.location.href = '/planning?categories=' + selections.join(',') + "&lat=" + lat + "&lon=" + lon;
    });
});
