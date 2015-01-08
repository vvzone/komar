define(
    'views/menu_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'models/menu_collection', //грузим коллекцию
        'jsx!views/react/cat_tree',
        'event_bus'

    ],function($, _, Backbone, React, Config, MenusCollection, CatScreen, EventBus){

        console.log('module views/menu loaded');
        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;

        var MenuView = Backbone.View.extend({
            //el: $('div#left_panel'), // 2-do: extend from base-class
            /*tagName: 'ul',*/
            template: '<div id="main_list_header"></div>' +
                '<div id="menu_view"></div>',
            initialize: function() {
                (debug)?console.log('MenuView initialization...'):null;
                _.bindAll(this, 'render');
                (debug)? console.log(['init, this.collection:', this.collection]):null;

                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            render: function(){
                (debug)?console.log(['render, this.collection:', this.collection]):null;
                var self = this;
                $(document).ready(function(){
                     require(['jsx!views/react/cat_tree'], function(CatTree){
                         (debug)?console.log(['trying set collection 2 obj:', self.collection]):null;
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
            console.log('admin menu initialization...');
            var Menus = new MenusCollection;
            (debug)?console.log('trying fetch collection...'):null;
            var p = Menus.fetch({
                error: function(obj, response){
                    (debug)?console.warn('error, response: '+response):null;
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить меню', response);
                },
                success: function(){
                    (debug)?console.info(['success & menu-collection:', Menus.toJSON()]):null;
                    var View = new MenuView({collection: Menus});
                }
            });
        }

        return {
            initialize: initialize
        }
    }
);