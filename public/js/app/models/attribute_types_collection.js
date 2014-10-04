define(
    'models/attribute_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/attribute_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/attribute_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            url: function() {
                return apiUrl('attribute_types');
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