define(
    'models/attribute_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config',
        'models/attribute_type'
    ],function($, _, Backbone, React, apiUrl, Config, Model){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/attribute_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Типы атрибутов',
            collection_name: 'attribute_types',
            url: function() {
                return apiUrl('attribute_types');
            },
            initialize: function(){

                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                (debug)?console.warn('Multi-passport!'):null;
            }
        });

        return Collection;
    }
);
