define(
    'models/collections',
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone){
        /*
        var AbstractCollection = Backbone.Collection.extend({
        });*/

        /*
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
                console.warn('no route');
            },
            itemView : function(view, id, param){
                console.info('view='+view+' id='+id+' param='+param);
            },
            collectionView: function(view){

                console.info('collection='+view);
            }
        });*/

        var initialize = function(view, id, param){
            console.log('view initialization...');

           if(view){
               if(id){
                   require(['view/'+view], function(ViewItem){
                   });
               }else{
                   require(['view/'+view+'_collection'], function(ViewCollection){

                   });
               }
           }

        };
        return {
            initialize: initialize
        };
    });