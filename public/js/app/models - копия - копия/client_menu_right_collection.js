define(
    'models/client_menu_right_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config',
        'models/client_menu_tree'
    ],function($, _, Backbone, React, apiUrl, Config, Menu){
        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;
        console.log('models/client_menu_collection loaded');
        var MenuCollection = Backbone.Collection.extend({
            model: Menu,
            url: function() {
                return apiUrl('client_menus_right');
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
