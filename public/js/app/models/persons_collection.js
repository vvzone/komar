define(
    'models/persons_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/person'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/persons_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Физлица',
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
