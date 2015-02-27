define(
    'models/document_attribute_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/document_attribute_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/document_attribute_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Атрибуты документа',
            collection_name: 'document_attribute_types',
            url: function() {
                return apiUrl('document_attribute_types');
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
