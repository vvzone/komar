define(
    'models/documents_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/document'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/documents_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Документы',
            collection_name: 'documents',
            url: function() {
                return apiUrl('documents');
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
