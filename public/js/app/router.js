define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'models/collections_router',
        'react',
        'event_bus'
    ],
    function($, _, Backbone, CollectionsRouter, React, EventBus){


    var AppRouter = Backbone.Router.extend({
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
        initialize: function(){
            console.info('Routter initialize...');
            if ($('#x-auth-token').val() == "") {
                window.location.replace("#login");
            }
            //this.navigate("login", true);
        },
        route: function(route, name, callback){
            console.info('Router -> route');

            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (!callback) callback = this[name]; // this is of interest
            _.wrap(callback, function(cb) {
                if ($('#x-auth-token').val() != "") {
                    console.info("#x-auth-token').val() NOT null");
                    cb();
                } else {
                    console.info("#x-auth-token').val() is null");
                    this.navigate("#login");
                }
            });
            Backbone.history.route(route, _.bind(function(fragment) {
                var args = this._extractParameters(route, fragment);
                callback && callback.apply(this, args);
                this.trigger.apply(this, ['route:' + name].concat(args));
                Backbone.history.trigger('route', this, name, args);
            }, this));
            return this;
        },
        home: function(){
            cleanUp();
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
            });

            $('#left_panel').html('');
        },
        no_route: function(){
          cleanUp();
          console.info('Router->no_route');
          console.warn('Route not found.');
          EventBus.trigger('error', 'Ошибка 404', 'Ошибка роутинга');
        },
        clientView: function(){
            cleanUp();
            console.info('Router->clientView');
            var ClientMenu =require(['views/client_menu_list'], function(ClientMenuList){
                return ClientMenuList;
            });
        },
        itemView : function(view, id, param){
            cleanUp();
            console.info('Router->itemView: view='+view+' , id='+id,+' , param='+param);
            console.info('view='+view+' id='+id+' param='+param);
        },
        clientCollectionView: function(view){
            cleanUp();
            console.info('Router->clientCollectionView: collection='+view);
            var ClientMenu =require(['views/client_menu_list'], function(ClientMenuList){
                return ClientMenuList;
            });
            CollectionsRouter.initialize(view, null, null);
        },
        collectionView: function(view){
            cleanUp();
            console.info('Router->collectionView: collection='+view);

            var Menu =require(['views/menu_list'], function(MenuList){
                return MenuList;
            });
            CollectionsRouter.initialize(view, null, null);
        },
        documentation: function(){
            cleanUp();
            console.info('Router->documentation');
            var Documentation = require(['service/documentate'], function(Documentation){
               return Documentation;
            });
        },
        react: function(){
            cleanUp();
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

    var cleanUp = function(){
        $('#main_top').html('');
        $('#main_main').html('');
    };

    var initialize = function(){
        console.log('router initialization...');
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});