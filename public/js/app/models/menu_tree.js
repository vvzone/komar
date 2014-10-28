define(
    'models/menu_tree',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/menu_tree loaded');

        var Menu = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                parent: null,
                rus_name: null,
                is_non_independent: false,
                is_not_screen: false,
                order: null,
                children: null,
                items: null
            },
            attr_description:{
                parent: 'Идентификатор родителя',
                is_not_screen: 'Признак того, что элемент не является ссылкой, а служит только для группировки',
                children: 'Дочерние элементы (Дерево)',
                items: 'Служебное поле клиентской части'
            },
            attr_rus_names: {
                name: 'Адрес',
                rus_name: 'Русское имя',
                is_non_independent: 'Скрыт в меню',
                is_not_screen: 'Описательный'
            },
            attr_dependencies: null, //for recursive objects
            model_description: 'Возвращается в виде дерева',
            model_name: 'menu_tree',
            model_rus_name: 'Меню админки',
            url: function() {
                return apiUrl('menu', this.id);
            },
            initialize: function(){
                console.info('Model init');
                if (Array.isArray(this.get('children'))) {
                    console.log('model init -> has children');
                    if(!MenuCollection){
                        console.log('loading sub-collection for childrens');
                       var MenuCollection = require("models/menu_collection");
                    }
                    var ChildCollection = new MenuCollection(this.get('children'));
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
