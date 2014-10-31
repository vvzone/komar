define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'models/collections_router',
        'react'
        //'views/menu_list'
    ],
    function($, _, Backbone, CollectionsRouter, React
       //Menu
        ){


    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'documentation': 'documentation',
            'react': 'react',
            'admin/:view/:id(/:param)': 'itemView',
            'admin/:view' : 'collectionView',
            '*action': 'no_route'
        },
        home: function(){
            console.log('home');
        },
        no_route: function(){
          console.warn('Route not found.');
        },
        itemView : function(view, id, param){
            console.info('view='+view+' id='+id+' param='+param);
            //Collections.initialize(view, id, param);
        },
        collectionView: function(view){
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

            require(['jsx!'+component_name], function(Component){
                React.renderComponent(
                    new Component({
                        collection: null
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