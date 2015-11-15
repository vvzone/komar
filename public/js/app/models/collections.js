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
                   console.log('getting module views/'+view);
                   require(['views/'+view], function(ViewItem){
                       console.log('module returned ViewItem-obj:');
                       console.log(ViewItem);

                       //ViewItem.initialize();
                   });
               }else{
                   console.log('getting module views/'+view+'_list (collection)');
                   require(['views/'+view+'_list'], function(ViewCollection){
                       console.log('module returns ViewCollection-obj:');
                       console.log(ViewCollection);

                       //ViewCollection.initialize(); //-second time init (auto)
                   });
               }
           }

        };
        return {
            initialize: initialize
        };
    });