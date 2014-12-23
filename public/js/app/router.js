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
            'admin/:view/:id(/:param)': 'itemView',
            'admin/:view' : 'collectionView',
            'client/:view': 'clientCollectionView',
            'client': 'clientView',
            '*action': 'no_route'
        },
        home: function(){
            console.info('Router->home');
        },
        no_route: function(){
          console.info('Router->no_route');
          console.warn('Route not found.');
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

    var initialize = function(){
        console.log('router initialization...');
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});