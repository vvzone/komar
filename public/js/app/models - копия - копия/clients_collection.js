define(
    'models/clients_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/client'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/clients_collection loaded');

        var Collection = Backbone.Collection.extend({
            model: Model,
            collection_rus_name: 'Клиенты',
            collection_name: 'clients',
            url: function() {
                return apiUrl('clients');
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

