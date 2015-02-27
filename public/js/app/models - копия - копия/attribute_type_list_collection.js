define(
    'models/attribute_type_list_collection',
        [
            'jquery',
            'underscore',
            'backbone',
            'react',
            'apiUrl',
            'config',
            'models/attribute_type_list'
        ],function($, _, Backbone, React, apiUrl, Config, Model){

            var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
            console.log('models/attribute_types_list_collection loaded');

            var Collection = Backbone.Collection.extend({
                model: Model,
                collection_rus_name: 'Варианты значений спискового атрибута',
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