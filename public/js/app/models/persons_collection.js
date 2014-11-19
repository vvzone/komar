define(
    'models/persons_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/person'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/persons_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Физ лица',
            collection_name: 'persons',
            url: function() {
                return apiUrl('persons');
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
