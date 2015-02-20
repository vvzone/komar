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
        'route_filter',

        'app_registry',
        'jsx!views/react/user_bar',
        'jsx!views/react/select_entry',

        'views/menu_client',
        'views/menu_client_right',
        'views/menu_admin',

        'views/map'
    ],
    function($, _, Backbone, Config, CollectionsRouter, React, EventBus, RouteFilter,
             app_registry, UserBarComponent, SelectEntry,
             ClientMenuList, ClientMenuListRight, AdminMenuList,
             MapView){ //2-do: to many components loaded by default!

        var debug = (Config['debug'] && Config['debug']['debug_router'])? 1:null;
            // Set up a a Router.
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'home',
                    'documentation': 'documentation',
                    'react': 'react',
                    'login': 'login',
                    'enter': 'enter',
                    'admin/:view/:id': 'adminItemView',
                    'admin/:view' : 'adminCollectionView',
                    //'admin/:view(?page=:page)(/&imit=:limit)' : 'adminCollectionView',
                    'admin': 'admin',
                    'client/:view': 'clientCollectionView',
                    'client/:view/new': 'clientItemNew',
                    'client': 'client',
                    '*action': 'no_route'
                },
                before: function( route ) {
                    (debug)?console.log(['Router -> before, route:', route]):null;
                    if(route != 'login'){
                        if(Config['cfsr_token']){
                            var token = $('meta[name="csrf-token"]').attr('content');
                            if(!token) {
                                //something else...
                            }
                        }
                        else{
                            (debug)?console.info('cfsr token not found...'):null;
                            if(app_registry.isAuth()){
                                (debug)?console.info('app_registry -> isAuth: yes..'):null;
                                UserBarComponent.initialize();
                            }else{
                                (debug)?console.info('app_registry: is not auth...'):null;
                                this.navigate('login', true);
                                return false;
                            }
                        }
                    }else{
                        removeUserBar();
                    }
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
                enter: function () {
                    console.info('Router->enter');
                    require(['jsx!views/react/select_entry'], function (SelectEntry) {
                        React.renderComponent(
                            new SelectEntry, document.getElementById("main_main")
                        );
                        clearScreen();
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
                /* ==== ADMIN ==== */
                admin: function(){
                    console.info('Router->admin');
                    AdminMenuList.initialize();
                    cleanMainScreen();
                },
                adminItemView : function(view, id, param){
                    console.info('Router->itemView: view='+view+' , id='+id,+' , param='+param);
                    console.info('view='+view+' id='+id+' param='+param);
                    AdminMenuList.initialize();
                },
                adminCollectionView: function(view, parameters){
                    console.info('Router->collectionView: collection='+view);
                    console.warn(['view, parameters', view, parameters]);
                    AdminMenuList.initialize();
                    CollectionsRouter.initialize(view, parameters, null);
                },
                /* ==== CLIENT ==== */
                client: function(){
                    console.info('Router->client');
                    ClientMenuList.initialize();
                    //ClientMenuListRight.initialize();
                    cleanMainScreen();

                    //MapView.initialize();

                    //MapView.show();

                },
                clientCollectionView: function(view, parameters){
                    console.info('Router->clientCollectionView: collection='+view);
                    var ClientMenu =require(['views/client_menu_list'], function(ClientMenuList){
                        return ClientMenuList;
                    });
                    CollectionsRouter.initialize(view, null, null);
                },
                clientItemNew: function(view){
                    console.info('Router->clientItemNew, view='+view);
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


    var cleanMainScreen = function(){
        (debug)?console.info("cleanMainScreen"):null;
        //$('#main_main').html('');
        React.unmountComponentAtNode($('#main_main')[0]);
    };

    var clearScreen = function(){
        (debug)?console.info('clearScreen'):null;
        //React.unmountComponentAtNode($('#main_top')[0]);
        React.unmountComponentAtNode($('#left_panel')[0]);
        React.unmountComponentAtNode($('#right_panel')[0]);

        //$('#main_top').html('');  //2-do: all trash clean-up on componentUnmount
        console.info(['#left_panel',$('#left_panel')]);
        //$('#main_main').html('');
    };

    var removeUserBar = function(){
        (debug)?console.info('removeUserBar'):null;
        React.unmountComponentAtNode($('#header_login')[0]);
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
        //var app_router = new Router;
        app_registry.router = new Router;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});