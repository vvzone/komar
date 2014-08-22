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
        apiUrl: 'apiUrl'
    },
    jsx: {
        fileExtension: '.jsx'
    },
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