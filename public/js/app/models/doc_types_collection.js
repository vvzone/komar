define(
    'models/doc_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/doc_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/doc_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_name: 'doc_types',
            url: function() {
                return apiUrl('doc_types');
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

