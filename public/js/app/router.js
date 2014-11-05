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
            var collection_name = 'views/react/prototypes/test_collection';

            var node_state_four = {
                node_state_code: 4,
                node_state_name: 'Согласовано'
            };
            var node_state_five = {
                node_state_code: 5,
                node_state_name: 'Исполнено'
            };
            var level_type_two = {
                id: 945,
                level_type_name: 'Согласование'
                //, node_state_on_success: node_state_five
            };
            var level_type_one = {
                id: 943,
                level_type_name: 'Согласование'
                //, node_state_on_success: node_state_four
            };
            var level_type_three = {
                id: 944,
                level_type_name: 'Подпись'
                //, node_state_on_success: node_state_four
            };
            var node_levels = [
                {id: 1, route: 1, level: 1, level_type: level_type_one, name: 'Согласование 1'},
                {id: 3, route: 1, level: 3, level_type: level_type_two, name: 'Исполняющие'},
                {id: 2, route: 1, level: 2, level_type: level_type_three, name: 'Согласование 2'}
            ];

            var TestCollection = require([collection_name], function(Collection){
                return new Collection;
            });

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