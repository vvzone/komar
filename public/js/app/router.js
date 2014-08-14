define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone){
    var AppRouter = Backbone.Router.extend({
        routes: {
            ":view/": "collectionView",
            ":view/:id": "itemView",
            ":view/:id/edit": "itemEdit", //throw event for modal?
            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(){
        console.log('router initialization...');

        var app_router = new AppRouter;
        app_router.on('route:itemView', function (view, id) {
            console.log('view='+view+'/id='+id);
            //var projectListView = new ProjectListView();
            //projectListView.render();
        });
        // As above, call render on our loaded module
        // 'views/users/list'
        app_router.on('defaultAction', function(actions){
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        });
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});