define(
    'models/regions_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/region'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/regions_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
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

