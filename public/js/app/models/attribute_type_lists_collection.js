define(
    'models/attribute_type_lists_collection',
        [
            'jquery',
            'underscore',
            'backbone', 'backbone_paginator',
            'react',
            'apiUrl',
            'config',
            'models/attribute_type_list'
        ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Config, Model){

            var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
            console.log('models/attribute_types_lists_collection loaded');

            var Collection = Backbone.PageableCollection.extend({
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