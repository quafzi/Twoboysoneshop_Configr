

var configrController = new Class.create();

var getOriginalTarget = function (event) {
    if (event.explicitOriginalTarget) { // Firefox
        return event.explicitOriginalTarget;
    }
    if (event.originalTarget) { // Firefox
        return event.originalTarget;
    } else {
        if (event.target) {     // Firefox, Opera, Google Chrome and Safari
            return event.target;
        } else if (event.srcElement.tagName) {  // Internet Explorer
            return event.srcElement.tagName;
        } else {
            return false;
        }
    }
}

configrController.prototype = {
    initialize: function(params) {
        $$('tr[data-field]').each(function(item) {
            var key = item.readAttribute('data-field');
            item.observe('click', function(event) {
                var eot = getOriginalTarget(event);
                if (eot === false) {
                    console.log('weird browser, something is fucked up');
                    return;
                }
                if (eot.tagName == 'DIV') {
                    eot = eot.up();
                }
                var storeId = eot.readAttribute('data-store-id');            

                if (!eot.hasClassName('default')) {
                    new Ajax.Request(params.editConfigUri, {
                        parameters: {
                            'configKey': key,
                            'storeId': storeId
                        },
                        evalJS: true,
                        onSuccess: function(transport) {
                            $('config-detail-dynamic-area').update(transport.responseText);
                            $('config-detail').show();
                        },
                        onFailure: function(transport) {
                            //$('config-detail').update(transport.responseText).show();
                        }                
                    });                
                }
            });
        });
        
        $$('#config-detail .close-button')[0].observe('click', function(event) {
            $('config-detail').hide();
            
            event.preventDefault();
        });

        $('select-all').observe('click', function() {
            $$('.store-select').each(function(item) {
                item.checked = 1;
            });
        });

        $('select-none').observe('click', function() {
            $$('.store-select').each(function(item) {
                item.checked = 0;
            });
        });

        $$('.configr-wrapper > h1').each(function(item) {
            item.observe('click', function() {

                var tabId = item.readAttribute('rel');

                $('div-tab-' + tabId).toggle();
            });
        });

        $$('.configr-wrapper h2').each(function(item) {
            item.observe('click', function() {

                var sectionId = item.readAttribute('rel');

                $('table-section-' + sectionId).toggle();
            });
        });

        $('typeadhead').observe('keyup', function(event) {
            $$('tr[data-field]').invoke('hide');
            $$('div.div-tab').invoke('hide');
            $$('table.table-section').invoke('hide');

            var searchValue = $F('typeadhead');

            var foundFields = $$('tr[data-field*=' + searchValue + ']');

            foundFields.invoke('show');
            foundFields.each(function(item) {
                item.up(1).show();
                item.up(2).show();
            });

        });
    }
};
