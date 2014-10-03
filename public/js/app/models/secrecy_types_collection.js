define(
    'models/secrecy_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/secrecy_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/secrecy_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            url: function() {
                return apiUrl('secrecy_types');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Collection;
    }
);
