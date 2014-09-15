define(
    'models/menu',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/menu loaded');

        var Menu = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                rus_name: null,
                is_non_independent: false,
                is_not_screen: false,
                order: null
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
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Menu;
    }
);
