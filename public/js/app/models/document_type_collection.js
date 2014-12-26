define(
    'models/document_type_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/document_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/doc_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Типы документов',
            collection_name: 'document_type',
            url: function() {
                return apiUrl('document_types');
            },

            initialize: function(){
                /*this.on('change', function(){
                    console.info('Collection Change! > fetch');
                    this.fetch();
                }, this);*/

                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Collection;
    }
);
