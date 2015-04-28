var controls = $('#controls')
    .append(
        $('<button></button>')
            .addClass('btn btn-primary form-control')
            .text('Add')
            .click(function(evt) {
                $("#controls-form").validate({
                  errorClass: 'has-error',
                  rules: {
                    url: {
                      required: true,
                      url: true
                    }
                  },
                  invalidHandler: function(event, validator) {
                      $('#controls-form input').each(function(i, v) {
                            var $elm = $(v);
                            if ($elm.hasClass('has-error') && !$elm.parent('.form-group').hasClass('has-error')) {
                                $elm.parent('.form-group').addClass('has-error');
                                $elm.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
                            }
                            else if (!$elm.hasClass('has-error') && $elm.parent('.form-group').hasClass('has-error')) {
                                $elm.parent('.form-group').removeClass('has-error');
                                $elm.parent().find('.glyphicon').remove();
                            }
                      });
                  }
                });

                if (!$('#controls-form').valid()) {
                    return;
                }

                evt.preventDefault();
                $('.success-message').show('slow');

                var bang = $('input[name="bang"]').val();
                var url = $('input[name="url"]').val();

                if (url.substr(-1) == '/') {
                    url = url.slice(0, -1);
                }

                chrome.storage.sync.get('bangsearch.settings.bangs', function(items) {
                    if (items['bangsearch.settings.bangs'] === undefined) {
                        items = {'bangsearch.settings.bangs': []};
                    }

                    items['bangsearch.settings.bangs'].push({'bang': bang, 'url': url});
                    chrome.storage.sync.set(items, function() { 
                        $('input[name="bang"], input[name="url"]').val('');
                        bangSearch.updateBangRules();
                        showPrefs();
                    });
                });
            })
    );

function deletePref(index) {
    chrome.storage.sync.get('bangsearch.settings.bangs', function(items) {
        var item = items['bangsearch.settings.bangs'].splice(index, 1);
        chrome.storage.sync.set(items, function() {
            $('#bang-' + index).hide('slow', function() {
                $('#bang-' + index).remove();
            });
            $('.success-message').hide('slow');
            chrome.declarativeWebRequest.onRequest.removeRules(item.bang);
        });
    });
}

function showPrefs() {
    $('#preferences tr').slice(1).remove();

    chrome.storage.sync.get('bangsearch.settings.bangs', function(items) {
        if (items['bangsearch.settings.bangs'] === undefined) {
            items = {'bangsearch.settings.bangs': []};
        }

        $.each(items['bangsearch.settings.bangs'], function(i, v) {
            var bang = $('<tr></tr>')
                .attr('id', 'bang-' + i)
                .append('<td>' + v.bang + '</td>')
                .append('<td>' + v.url + '</td>')
                .append(
                    $('<td></td>')
                        .append(
                            $('<button></button>').addClass('btn btn-danger').attr('data-index', i).text('Delete').click(function() { deletePref($(this).attr('data-index')); })
                        )
                    );
            $('#preferences').append(bang);
        });
    });
}

showPrefs();
