define(
    'models/regions_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/region'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/regions_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Регионы',
            collection_name: 'regions',
            url: function() {
                return apiUrl('regions');
            }
        });

        return Collection;
    }
);

