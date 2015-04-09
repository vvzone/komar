define(
    'models/base/rest_model',
    [
        'jquery',
        'underscore',
        'backbone'
    ],function($, _, Backbone){

        console.log('models/rest_model');
        
        var Model = Backbone.Model.extend({
            initialize: function(){
                this.on('change', function(){
                    /* -- set errors -- */
                    this.bind('validated:invalid', function(model, errors) {
                        this.validationErrors = errors;
                    });
                });
            },
            silentFetch: function(){
                console.info('Silent Fetch call');
                Backbone.Model.prototype.fetch.apply(this, arguments);
            }
        });

        return Model;
    }
);
