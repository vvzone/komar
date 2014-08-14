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
    };
    return {
        init: init
    };
});
