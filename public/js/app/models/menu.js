define(
    'models/menu',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/menu loaded');

        var Menu = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                parent_id: null,
                rus_name: null,
                is_non_independent: false,
                is_not_screen: false,
                order: null,
                childNodes: null,
                items: null
            },
            attr_rus_names: {
                name: 'Адрес',
                rus_name: 'Русское имя',
                is_non_independent: 'Скрыт в меню',
                is_not_screen: 'Описательный'
            },
            attr_dependencies: null, //for recursive objects
            url: function() {
                return apiUrl('menu', this.id);
            },
            initialize: function(){
                console.info('Model init');
                if (Array.isArray(this.get('childNodes'))) {
                    console.log('model init -> has child\'s');
                    if(!MenuCollection){
                        console.log('loading sub-collection for child\'s');
                       var MenuCollection = require("models/menu_collection");
                    }
                    var ChildCollection = new MenuCollection(this.get('childNodes'));
                    this.set({items: ChildCollection});
                }
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Menu;
    }
);
