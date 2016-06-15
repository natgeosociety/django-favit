$(document).ready(function() {


    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    $('.btn-favit-favorite').click(function() {
        var $obj = $(this);
        var target_id = $obj.attr('id').split('_')[1];
        $obj.prop('disabled', true);
        var has_count = $obj.attr('count');
        $.ajax({
            url: $obj.attr('href'),
            type: 'POST',
            beforeSend: function(xhr, settings){
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            },
            data: {
                target_model: $obj.attr('model'),
                target_object_id: target_id
            },
            success: function(response) {
                if (response.status == 'added') {
                    $obj.children().removeClass('fa-heart-o').addClass('fa-heart');}
                else {
                    $obj.children().removeClass('fa-heart').addClass('fa-heart-o');
                }
                if(has_count == 'True'){
                    $obj.parent('.favit').children('.fav-count').text(response.fav_count);
                    $obj.prop('disabled', false);
                }
            }
        });
    });

    $('.btn-favit-unfave').click(function() {
        var $obj = $(this);
        $obj.prop('disabled', true);
        $.ajax({
            url: $obj.attr('href'),
            type: 'POST',
            data: {
                target_model: $obj.data('model'),
                target_object_id: $obj.data('id')
            },
            beforeSend: function(xhr, settings){
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            },
            success: function(response) {
                if (response.status == 'deleted') {
                    // TODO: Add herarchy params on template tags, and represent here
                    $obj.parent().remove();
                }
            },
            complete: function(response) {
                $obj.prop('disabled', false);
            }
        });
    });
});
