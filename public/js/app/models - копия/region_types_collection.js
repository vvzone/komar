define(
    'models/region_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/region_type'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/region_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Типы регионов',
            collection_name: 'region_types',
            url: function() {
                return apiUrl('region_types');
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

