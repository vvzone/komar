define(
    'models/inbox_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/document'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/inbox_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Документы',
            collection_name: 'inbox',
            url: function() {
                return apiUrl('inbox');
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
