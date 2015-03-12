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

                if(id && id !='new'){
                    var model = new Model({id: id});
                    model.fetch({
                        success: function(){
                            console.info(['model', model]);
                            React.renderComponent(
                                new Form({
                                    model: model
                                }), document.getElementById("main_main")
                            );
                        }
                    });
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