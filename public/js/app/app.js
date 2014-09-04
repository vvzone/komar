define(
    'app',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/modals/error',
        'jsx!views/react/modals/edit',
        'router', // Request router.js
        'event_bus'
    ],
    function($, _, Backbone, React, ModalWindowError, ModalWindowEdit, Router, EventBus){
    var init = function(){
        // Pass in our Router module and call it's initialize function
        console.log('app initialization...');
        Router.initialize();

        EventBus.on('error', function(header, msg, response){
            React.renderComponent(
                 ModalWindowError({
                     header: header,
                     msg: msg,
                     response: response
                 }), document.getElementById("global_modal")
             );
        });

        EventBus.on('item-edit', function(model){
            console.info('EventBus -> item-edit, model:');
            console.log(model);
            $('#global_modal').html(''); //remove faded 
            React.renderComponent(
                ModalWindowEdit({
                    model: model
                }), document.getElementById("global_modal")
            );
        });


        //EventBus.trigger('error', 'test error');

    };
    return {
        init: init
    };
});
