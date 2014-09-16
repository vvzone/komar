define(
    'views/menu_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'models/menu_collection',
        'jsx!views/react/cat_tree',
        'event_bus'

    ],function($, _, Backbone, React, MenusCollection, CatScreen, EventBus){

        console.log('module views/menu loaded');

        var MenuView = Backbone.View.extend({
            //el: $('div#left_panel'), // 2-do: extend from base-class
            /*tagName: 'ul',*/
            template: '<div id="main_list_header"></div>' +
                '<div id="menu_view"></div>',
            initialize: function() {
                console.log('MenuView initialization...');
                _.bindAll(this, 'render');
                console.log('init, this.collection:');
                console.log(this.collection);

                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            render: function(){
                console.log('render, this.collection:');
                console.log(this.collection);
                var self = this;
                $(document).ready(function(){
                     require(['jsx!views/react/cat_tree'], function(CatTree){
                         console.log('trying set collection 2 obj:');
                         console.info(self.collection);

                         React.renderComponent(
                             new CatTree({
                                    collection: self.collection
                                }), document.getElementById("left_panel")
                         );
                     });
                });
            }
        });

        var Menus = new MenusCollection;
        console.log('trying fetch collection...');
        var p = Menus.fetch({
            error: function(obj, response){
                console.warn('error, response: '+response);
                EventBus.trigger('error', 'Ошибка', 'Невозможно получить меню', response);
            },
            success: function(){
                console.info('success & menu-collection:');
                console.info(Menus.toJSON());
                var View = new MenuView({collection: Menus});
            }
        });
    }
);