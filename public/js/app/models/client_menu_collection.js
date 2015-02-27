define(
    'models/client_menu_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'config',
        'models/client_menu_tree'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Config, Menu){
        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;
        console.log('models/client_menu_collection loaded');
        var MenuCollection = Backbone.PageableCollection.extend({
            model: Menu,
            url: function() {
                return apiUrl('client_menus');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                (debug)?console.warn('Multi-passport!'):null;
            }
        });

        return MenuCollection;
    }
);
