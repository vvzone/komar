require.config({
    baseUrl: 'js/app',
    paths: {
        jquery: './libs/jquery/jquery.min',
        underscore: './libs/underscore/underscore-min',
        backbone: './libs/backbone/backbone',
        bootstrap: './libs/bootstrap/bootstrap.min',
        //jsx: './libs/jsx/JSXTransformer',
        jsx: './libs/jsx/jsx',
        JSXTransformer: './libs/jsx/JSXTransformer',
        text: './libs/text',
        react: './libs/react/react',
        apiUrl: 'apiUrl',
        event_bus: 'event_bus',
        route_filter: './libs/backbone.routefilter.min'
        //css: './libs/require-css/css.min'
    },
    jsx: {
        fileExtension: '.jsx'
    },/* ---- not working...
    css: {
        fileExtension: '.css'
    },*/
    urlArgs: "v=" +  (new Date()).getTime(), //remove for production
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            deps:["jquery"],
            exports: '_'
        },
        backbone: {
            deps:["jquery", "underscore"],
            exports: 'Backbone'
        },
        route_filter: {
            deps: ['backbone']
        }
    },
    catchError: true
});


require.onError = function (err) {
    console.log(err.requireType);
    console.log('modules: ' + err.requireModules);
    throw err;
};

require(["app"], function (App) {
    App.init();
});



/*
require([
    // Load our app module and pass it to our definition function
    'app'
], function(App){
    // The "app" dependency is passed in as "App"
    console.log('starting app..');
    App.init();
});

    */