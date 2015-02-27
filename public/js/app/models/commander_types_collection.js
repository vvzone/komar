define(
    'models/commander_types_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/commander_type'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/commander_types_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Типы руководства подразделения',
            collection_name: 'commander_types',
            url: function() {
                return apiUrl('commander_types');
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

