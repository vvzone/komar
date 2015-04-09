define(
    'views/item_edit',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'event_bus',
        'jsx!views/react/item_edit/generate_form'

    ],function($, _, Backbone, React, Config, EventBus, Form){
        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        var initialize = function(view, id, params){
            console.info(['ItemEdit view, id, params', view, id, params]);

            //model load
            require(['models/'+view], function(Model){
                if(id && id !='new' && id!='add'){
                    var model = new Model({id: id});
                    (debug)?console.log('fetch existing model'):null;
                    //var model_old = model;
                    //model = model.clone();
                    model.silentFetch({
                        success: function(){
                            console.info(['model', model]);
                            $('#main_main').html(''); //clean previous

                            React.renderComponent(
                                new Form({
                                    model: model,
                                    interface: true
                                }), document.getElementById("main_main")
                            );
                        }
                    });
                }else{
                    (debug)?console.log('create new'):null;
                    var model = new Model({id: id});

                    console.info(['model', model]);
                    $('#main_main').html(''); //clean previous

                    React.renderComponent(
                        new Form({
                            model: model,
                            interface: true
                        }), document.getElementById("main_main")
                    );
                }

            }, function(err){
                console.info(['err', err]);
                EventBus.trigger('error', 'Ошибка клиента', 'Ошибка при обработке models/'+view, err);
            });
        };

        return {
            initialize: initialize
        }
    }
);