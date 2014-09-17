define(
    'models/collections_router',
    [
        'jquery',
        'underscore',
        'backbone',
        'event_bus'
    ],
    function($, _, Backbone, EventBus){
        var initialize = function(view, id, param){
            console.log('collection_router initialization...');
            var ViewCollection = 'undefined';

            switch(view){
                case('ranks'):
                    if(!RanksCollection){
                        console.log('!RanksCollection -> require loading');
                        var RanksCollection =require(['views/ranks_list'], function(RanksCollection){
                            return RanksCollection;
                        });
                    }
                    RanksCollection.initialize;
                break;
                case('positions'):
                    if(!PositionsCollection){
                        console.log('!PositionsCollection -> require loading');
                        var PositionsCollection =require(['views/ranks_list'], function(PositionsCollection){
                            return PositionsCollection;
                        });
                    }
                    PositionsCollection.initialize;
                break;
                default:
                    var msg = 'Вид для коллекции '+view+' не найден.';
                    EventBus.trigger('error', '404', msg);
                break;
            }
            /*
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
           }*/

        };
        return {
            initialize: initialize
        };
    });