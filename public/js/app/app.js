define(
    'app',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/base/error_msg',
        'router', // Request router.js
        'event_bus'
    ],
    function($, _, Backbone, React, ErrorMsg, Router, EventBus){
    var init = function(){
        // Pass in our Router module and call it's initialize function
        console.log('app initialization...');
        Router.initialize();

        EventBus.on('error', function(msg, header){
            console.warn('EventBus <on.error>');
            console.warn('msg');
            console.warn(msg);
            console.warn('header');
            console.warn(header);

            React.renderComponent(
                 new ErrorMsg({
                 header: header,
                 msg: msg
                 }), document.getElementById("global_modal")
             );
        });


        //EventBus.trigger('error', 'test error');

    };
    return {
        init: init
    };
});
