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
            var ViewCollection = 'undefined';
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

                   console.info('dynamic variable stat');
                   console.info(window['views/'+view+'_list']);

                   if(window['views/'+view+'_list']!='undefined'){
                       console.log('NO registered variable '+'views/'+view+'_list');
                       require(['views/'+view+'_list'], function(ViewCollection){
                           console.log('module returns ViewCollection-obj:');
                           console.log(ViewCollection);

                           //ViewCollection.initialize(); //-second time init (auto)
                       });
                   }else{
                       console.log('already HAVE registered variable '+'views/'+view+'_list');
                   }
               }
           }

        };
        return {
            initialize: initialize
        };
    });