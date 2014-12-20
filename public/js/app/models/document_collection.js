define(
    'models/document_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/document'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/document_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Атрибуты документа',
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
