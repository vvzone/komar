define(
    'app',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/modals/error',
        'jsx!views/react/modals/success',
        'jsx!views/react/modals/edit',
        'jsx!views/react/modals/delete_confirmation',
        'jsx!views/react/modals/add',
        'router', // Request router.js
        'event_bus'
        , 'views/menu_list'
    ],
    function($, _, Backbone, React, ModalWindowError, ModalWindowSuccess, ModalWindowEdit, ModalWindowDeleteConfirmation, ModalWindowAdd, Router, EventBus, Menu){ //, Menu
    var init = function(){
        // Pass in our Router module and call it's initialize function
        console.log('app initialization...');
        Router.initialize();

        EventBus.on('error', function(header, msg, response){
            EventBus.trigger('windows-close');

            React.renderComponent(
                 ModalWindowError({
                     header: header,
                     msg: msg,
                     response: response
                 }), document.getElementById("global_modal")
             );
        });

        EventBus.on('item-add', function(model){
            console.info('EventBus -> item-add, model:');
            console.log(model);

            React.renderComponent(
                ModalWindowEdit({
                    model: model
                }), $('.modal_window').filter(':last')[0] //document.getElementById("global_modal")
            );


        });

        EventBus.on('item-edit', function(model){
            console.info('EventBus -> item-edit, model:');
            console.log(model);

            console.info('$(.modal_window).filter(:last)');
            console.info($('.modal_window').filter(':last'));
            React.renderComponent(
                ModalWindowEdit({
                    model: model
                }), $('.modal_window').filter(':last')[0]  //document.getElementById("global_modal")
            );
        });

        EventBus.on('item-delete', function(model){
            console.info('EventBus -> item-delete, model:');
            console.log(model);
            EventBus.trigger('windows-close');

            var unmount = React.unmountComponentAtNode($('#global_modal')[0]);
            console.log('unmount='+unmount);
            $('#global_modal').html('');

            React.renderComponent(
                ModalWindowDeleteConfirmation({
                    model: model
                }), document.getElementById("global_modal")
            );
        });

        EventBus.on('success', function(header, msg){
            console.info('EventBus -> success');

            //EventBus.trigger('windows-close');
            //var last_window = $('.modal_window').filter(':last')[0];
            var last_window = $('.modal_window').filter(function(index){

                /*var length = $('.modal_window').length;
                var previous_window_index = length-2; //because index starts from 0
                console.log('$(.modal_window).filter().length='+length);
                //console.log('$(.modal_window).filter().length -1 ='+length);
                console.log('previous_window_index = '+previous_window_index+', index:');
                console.log(index);
                if(index = previous_window_index){
                   return index;
                }*/
                return $('.modal_window', this).length-2;
            })[0];
            console.info('last_window');
            console.info(last_window);
            //last_window.trigger('windows-close');

            /*var unmount = React.unmountComponentAtNode($('.modal_window').filter(':last')[0]);
            console.log('unmount='+unmount);
            $('.modal_window').filter(':last')[0].html('');*/

            React.renderComponent(
                ModalWindowSuccess({
                    header: header,
                    msg: msg
                }), $('.modal_window').filter(':last')[0] //document.getElementById("global_modal")
            );
        });

        //EventBus.trigger('error', 'test error');

    };
    return {
        init: init
    };
});
