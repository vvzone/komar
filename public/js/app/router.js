define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'config',
        'models/collections_router',
        'react',
        'event_bus',
        'route_filter'
    ],
    function($, _, Backbone, Config, CollectionsRouter, React, EventBus, RouteFilter){


        var debug = (Config['debug'] && Config['debug']['debug_router'])? 1:null;
            // Set up a a Router.
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'home',
                    'documentation': 'documentation',
                    'react': 'react',
                    'login': 'login',
                    'admin/:view/:id(/:param)': 'itemView',
                    'admin/:view' : 'collectionView',
                    'client/:view': 'clientCollectionView',
                    'client': 'clientView',
                    '*action': 'no_route'
                },
                before: function( route ) {

                    // Do something with every route before it's routed. "route" is a string
                    // containing the route fragment just like regular Backbone route
                    // handlers. If the url has more fragments, the before callback will
                    // also get them, eg: before: function( frag1, frag2, frag3 )
                    // (just like regular Backbone route handlers).
                    (debug)?console.log(['Router -> before, route:', route]):null;
                    if(route != 'login'){
                        var token = $('meta[name="csrf-token"]').attr('content');
                        if(!token) {
                            (debug)?console.info(['token=',token]):null;
                            this.navigate('login', true);
                            return false;
                        }else{
                            console.info(['token=',token]);
                        }

                    }
                    // Returning false from inside of the before filter will prevent the
                    // current route's callback from running, and will prevent the after
                    // filter's callback from running.
                    //

                },
                after: {
                    // define a specific callback for a certain route.
                    "page/:id" : function( route ) {
                        console.log("After callback for page/:id was run!");
                    }
                },
                home: function(){
                    console.info('Router->home');
                    var Menu =require(['views/menu_list'], function(MenuList){
                        return MenuList;
                    });
                },
                login: function(){
                    cleanUp();
                    console.info('Router->login');
                    require(['jsx!views/react/login'], function(LoginComponent){
                        React.renderComponent(
                            new LoginComponent, document.getElementById("main_main")
                        );
                        clearScreen();
                    });

                   // $('#left_panel').html('');
                },
                logout: function(){
                    console.info('Route->logout');
                    require(['jsx!views/react/logout'], function(LogoutComponent){
                        React.renderComponent(
                            new LogoutComponent, document.getElementById("main_main")
                        );
                    });
                },
                no_route: function(){
                    console.info('Router->no_route');
                    EventBus.trigger('error', 'Ошибка 404', 'Ошибка роутинга');
                },
                clientView: function(){
                    console.info('Router->clientView');
                    var ClientMenu =require(['views/client_menu_list'], function(ClientMenuList){
                        return ClientMenuList;
                    });
                },
                itemView : function(view, id, param){
                    console.info('Router->itemView: view='+view+' , id='+id,+' , param='+param);
                    console.info('view='+view+' id='+id+' param='+param);
                },
                clientCollectionView: function(view){
                    console.info('Router->clientCollectionView: collection='+view);
                    var ClientMenu =require(['views/client_menu_list'], function(ClientMenuList){
                        return ClientMenuList;
                    });
                    CollectionsRouter.initialize(view, null, null);
                },
                collectionView: function(view){
                    console.info('Router->collectionView: collection='+view);

                    var Menu =require(['views/menu_list'], function(MenuList){
                        return MenuList;
                    });
                    CollectionsRouter.initialize(view, null, null);
                },
                documentation: function(){
                    console.info('Router->documentation');
                    var Documentation = require(['service/documentate'], function(Documentation){
                        return Documentation;
                    });
                },
                react: function(){
                    console.info('Router->react');
                    var component_name = 'views/react/prototypes/levels';
                    var collection_name = 'views/react/prototypes/node_levels_collection';
                    require([collection_name, 'jsx!'+component_name], function(TestCollectionOne, Component){
                        React.renderComponent(
                            new Component({
                                collection: TestCollectionOne //new LevelCollection(data)
                            }), document.getElementById("main_main")
                        );
                    });
                }
            });


    var clearScreen = function(){
        (debug)?console.info('clearScreen'):null;
        $('#main_top').html('');
        $('#left_panel').html('');
        console.info(['#left_panel',$('#left_panel')]);
        //$('#main_main').html('');
    };

    var cleanUp = function(){
        (debug)?console.info('cleanUp'):null;
        $('#main_top').html('');
        $('#left_panel').html('');
        $('#main_main').html('');
    };

    var initialize = function(){
        console.log('router initialization...');
        //var app_router = new AppRouter;
        var app_router = new Router;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});