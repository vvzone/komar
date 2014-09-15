define(
    'models/menu_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/menu'
    ],function($, _, Backbone, React, apiUrl, Menu){

        console.log('models/menu_collection loaded');

        var MenuCollection = Backbone.Collection.extend({
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
