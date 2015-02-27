define(
    'models/menu_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/menu_tree'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Menu){

        console.log('models/menu_collection loaded');

        var MenuCollection = Backbone.PageableCollection.extend({
            model: Menu,
            url: function() {
                return apiUrl('menus');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return MenuCollection;
    }
);
