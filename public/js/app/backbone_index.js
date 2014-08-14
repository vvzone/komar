require.config({
    baseUrl: 'js/app',
    paths: {
        jquery: './libs/jquery/jquery.min',
        underscore: './libs/underscore/underscore-min',
        backbone: './libs/backbone/backbone',
        bootstrap: './libs/bootstrap/bootstrap.min',
        jsx: './libs/jsx/JSXTransformer',
        react: './libs/react/react'
    },
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
        }
    }
});

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