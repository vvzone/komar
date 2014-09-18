define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'models/collections_router',
        //'views/menu_list'
    ],
    function($, _, Backbone, CollectionsRouter){

    //, Menu
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            ':view/:id(/:param)': 'itemView',
            ':view' : 'collectionView',
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