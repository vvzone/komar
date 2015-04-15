define(
    'models/atc_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'config',
        'models/atc'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Config, Model){

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Коллекции Типов Атрибутов',
            collection_name: 'atc',
            url: function() {
                return apiUrl('atc');
            }
        });

        return Collection;
    }
);
