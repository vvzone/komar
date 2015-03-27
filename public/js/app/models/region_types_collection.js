define(
    'models/region_types_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/region_type'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/region_types_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Типы регионов',
            collection_name: 'region_type',
            url: function() {
                return apiUrl('region_type');
            }
        });

        return Collection;
    }
);

