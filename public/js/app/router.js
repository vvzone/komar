define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'models/collections_router',
        'react',
        'event_bus',
        'models/client_menu_collection'
        //'views/menu_list'
    ],
    function($, _, Backbone, CollectionsRouter, React, EventBus, ClientMenuCollection
       //Menu
        ){


    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'documentation': 'documentation',
            'react': 'react',
            'admin/:view/:id(/:param)': 'itemView',
            'admin/:view' : 'collectionView',
            'client/:view': 'clientCollectionView',
            'client': 'clientView',
            '*action': 'no_route'
        },
        home: function(){
            console.log('home');
        },
        no_route: function(){
          EventBus.trigger('error', 'Ошибка 404', 'Ошибка роутинга');
          console.warn('Route not found.');
        },
        clientView: function(){

            var Menus = new ClientMenuCollection;
            console.log('trying fetch collection...');
            var p = Menus.fetch({
                error: function(obj, response){
                    console.warn('error, response: '+response);
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить меню', response);
                },
                success: function(){
                    console.info('success & menu-collection:');
                    console.info(Menus.toJSON());

                    $(document).ready(function(){
                        require(['jsx!views/react/client_cat_tree'], function(CatTree){
                            console.log('trying set collection 2 obj:');
                            console.info(self.collection);
                            React.renderComponent(
                                new CatTree({
                                    collection: Menus
                                }), document.getElementById("left_panel")
                            );
                        });
                    });
                }
            });

            //Yandex
            /*
            require(['jsx!views/react/client'], function(Client){
                React.renderComponent(
                    new Client({
                        collection: null
                    }), document.getElementById("main_main")
                );
            });
            */
        },
        itemView : function(view, id, param){
            console.info('view='+view+' id='+id+' param='+param);
            //Collections.initialize(view, id, param);
        },
        clientCollectionView: function(view){
            var Menus = new ClientMenuCollection;
            console.log('trying fetch collection...');
            var p = Menus.fetch({
                error: function(obj, response){
                    console.warn('error, response: '+response);
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить меню', response);
                },
                success: function(){
                    console.info('success & menu-collection:');
                    console.info(Menus.toJSON());

                    $(document).ready(function(){
                        require(['jsx!views/react/client_cat_tree'], function(CatTree){
                            console.log('trying set collection 2 obj:');
                            console.info(self.collection);
                            React.renderComponent(
                                new CatTree({
                                    collection: Menus
                                }), document.getElementById("left_panel")
                            );
                        });
                    });
                }
            });

            console.info('Router->collectionView: collection='+view);
            //var MenuOutput = new Menu;
            CollectionsRouter.initialize(view, null, null);
        },
        collectionView: function(view){

            var Menu =require(['views/menu_list'], function(MenuList){
                return MenuList;
            });

            console.info('Router->collectionView: collection='+view);
            //var MenuOutput = new Menu;
            CollectionsRouter.initialize(view, null, null);
        },
        documentation: function(){
            console.log('trying to documentate...');
            var Documentation = require(['service/documentate'], function(Documentation){
               return Documentation;
            });

        },
        react: function(){
            console.log('route to react test module...');
            var component_name = 'views/react/prototypes/levels';
            //var component_name = 'views/react/prototypes/example';
            var collection_name = 'views/react/prototypes/node_levels_collection';

            //'jsx!'+
            //var test_style = '<link href="js/app/views/react/prototypes/test_style.css" rel="stylesheet" media="all"/>';
            //$('head').html(''); //clear all styles
            //$('head').append(test_style);

            require([collection_name, 'jsx!'+component_name], function(TestCollectionOne, Component){
                React.renderComponent(
                    new Component({
                        collection: TestCollectionOne //new LevelCollection(data)
                    }), document.getElementById("main_main")
                );
            });


            /*
            require(['css!views/react/prototypes/test_style'], function(StyleSHIT){
                console.info('CSS TEST OUTPUT:');
                console.info(StyleSHIT);
            });*/

        }
    });

    var initialize = function(){
        console.log('router initialization...');
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});