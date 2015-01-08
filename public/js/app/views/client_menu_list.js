define(
    'views/client_menu_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'config',
        'models/client_menu_collection', //грузим коллекцию
        'jsx!views/react/client_cat_tree'

    ],function($, _, Backbone, React, EventBus, Config, MenusCollection, CatScreen){

        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;
        (debug)?console.info('module views/client_menu loaded'):null;

        var MenuView = Backbone.View.extend({
            //el: $('div#left_panel'), // 2-do: extend from base-class
            /*tagName: 'ul',*/
            template: '<div id="main_list_header"></div>' +
                '<div id="menu_view"></div>',
            initialize: function() {
                (debug)?console.log('ClientMenuView initialization...'):null;
                _.bindAll(this, 'render');
                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            render: function(){
                var self = this;

                $(document).ready(function(){
                     require(['jsx!views/react/client_cat_tree'], function(CatTree){
                         React.renderComponent(
                             new CatTree({
                                    collection: self.collection
                                }), document.getElementById("left_panel")
                         );
                     });
                });
            }
        });

        var initialize = function(){
            console.log('client menu initialization...');
            var Menus = new MenusCollection;
            var p = Menus.fetch({
                error: function(obj, response){
                    console.warn('error, response: '+response);
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить меню', response);
                },
                success: function(){
                    var View = new MenuView({collection: Menus});
                }
            });
        };
        return {
            initialize: initialize
        };
    }
);