define(
    'models/document_attributes_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/document_attribute'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/document_attribute_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Атрибуты документа',
            collection_name: 'document_attributes',
            url: function() {
                return apiUrl('document_attributes');
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
