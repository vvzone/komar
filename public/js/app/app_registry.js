define(['underscore', 'backbone', 'jquery', 'jCookie'], function(_, Backbone, $) {
    var app_registry = {};
    app_registry.global_event_obj = _.extend({}, Backbone.Events);
    app_registry.models = {};

    app_registry.router = {};

    app_registry.user_bar = {};

    app_registry.auth = {
        username: null,
        token: null
    };

    app_registry.test = 'Test!';

    app_registry.isAuth = function(){
        console.info(['app_registry.isAuth check app_registry.auth', app_registry.auth]);

        if(app_registry.auth.username!=null && app_registry.auth.token!=null){
            console.log('yes!');
            console.log(['app_registry.auth.username',app_registry.auth.username]);
            console.log(['app_registry.auth.token', app_registry.auth.token]);
            return true;
        }
        console.log('no!');
        return false;
    };

    app_registry.getAuth = function(){
        console.info(['app_registry -> getAuth', app_registry.auth]);
        if($.cookie('token') && $.cookie('username')){
            console.info('set app_auth from cookie');
            app_registry.auth.token = $.cookie('token');
            app_registry.auth.username = $.cookie('username');

            $.ajaxSetup({
                headers: { 'Authorization': 'TOKEN '+app_registry.auth.token},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'TOKEN '+app_registry.auth.token);
                }
            });
        }
    };

    app_registry.clearAuth = function(){
        console.log('app_registry -> cancelAuth');
        $.removeCookie('token');
        $.removeCookie('username');
        app_registry.auth.token = null;
        app_registry.auth.username = null;
        $('meta[name="csrf-token"]').attr('content', '');

        $.ajaxSetup({
            headers: { 'Authorization': ''},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', '');
            }
        });
    };

    app_registry.init = function(){
        console.info('app_registry -> init');
        app_registry.getAuth();
    };

    return app_registry;
});