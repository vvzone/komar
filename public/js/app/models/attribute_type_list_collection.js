define(
    'models/attribute_type_list_collection',
        [
            'jquery',
            'underscore',
            'backbone',
            'react',
            'apiUrl',
            'models/attribute_type_list'
        ],function($, _, Backbone, React, apiUrl, Model){

            console.log('models/attribute_types_list_collection loaded');

            var Collection = Backbone.Collection.extend({
                model: Model,
                collection_rus_name: 'Список',
                collection_name: 'attribute_types',
                url: function() {
                    return apiUrl('attribute_types');
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