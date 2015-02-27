define(
    'models/address_types_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/address_type',
        'config'
    ],function($, _, Backbone, React, apiUrl, Model, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/address_types_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Типы адреса',
            collection_name: 'address_types',
            url: function() {
                return apiUrl('address_types');
            },
            initialize: function(){

                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                (debug)?console.warn('Multi-passport!'):null;
            }
        });

        return Collection;
    }
);

