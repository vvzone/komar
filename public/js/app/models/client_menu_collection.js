define(
    'models/client_menu_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/client_menu_tree'
    ],function($, _, Backbone, React, apiUrl, Menu){

        console.log('models/client_menu_collection loaded');

        var MenuCollection = Backbone.Collection.extend({
            model: Menu,
            url: function() {
                return apiUrl('client_menus');
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
