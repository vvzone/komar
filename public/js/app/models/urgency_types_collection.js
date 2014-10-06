define(
    'models/urgency_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/urgency_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/urgency_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Типы срочности',
            collection_name: 'urgency_types',
            url: function() {
                return apiUrl('urgency_types');
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
