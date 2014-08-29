define(
    'app',
    [
        'jquery',
        'underscore',
        'backbone',
        'router' // Request router.js
    ],
    function($, _, Backbone, Router){
    var init = function(){
        // Pass in our Router module and call it's initialize function
        console.log('app initialization...');
        Router.initialize();

        EventBus.on('error', function(msg, header){
            React.renderComponent(
                new ErrorMsg({
                    header: header,
                    msg: msg
                }), document.getElementById("global_modal")
            );
        });
    };
    return {
        init: init
    };
});
