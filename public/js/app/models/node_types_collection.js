define(
    'models/node_types_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/node_type'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/node_types_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Типы пункта маршрута',
            collection_name: 'node_types',
            url: function() {
                return apiUrl('node_types');
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

