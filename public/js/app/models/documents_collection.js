define(
    'models/documents_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/document'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/documents_collection loaded');

        var Collection = Backbone.Collection.extend({
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
