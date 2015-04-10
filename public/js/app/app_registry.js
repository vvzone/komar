define(['underscore', 'backbone', 'jquery', 'jCookie', 'config'], function(_, Backbone, $, Config) {
    var app_registry = {};
    app_registry.global_event_obj = _.extend({}, Backbone.Events);
    app_registry.models = {};

    app_registry.router = {};
    app_registry.router_helpers = {};

    app_registry.user_bar = {};

    var Config = {}; //Config;
    app_registry.config = Config;

    var debug = (Config['debug'] && Config['debug']['debug_app_registry'])? 1:null;

    app_registry.auth = {
        username: null,
        token: null
    };

    app_registry.test = 'Test!';

    app_registry.isAuth = function(){
        (debug)?console.info(['app_registry.isAuth check app_registry.auth', app_registry.auth]):null;
        return (app_registry.auth.username!=null && app_registry.auth.token!=null);
    };

    app_registry.getAuth = function(){
        (debug)?console.info(['app_registry -> getAuth', app_registry.auth]):null;
        if($.cookie('token') && $.cookie('username')){
            (debug)?console.info('set app_auth from cookie'):null;
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
        (debug)?console.log('app_registry -> cancelAuth'):null;
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

    app_registry.router_helpers.currentEntryPoint = function(){
        var current_url = Backbone.history.fragment;

        var where_sub_route_start = current_url.indexOf("/");
        console.info(current_url.indexOf("/"));
        if(where_sub_route_start == -1){
            where_sub_route_start = current_url.length;
        }
        var url ='#'+current_url.substring(0, where_sub_route_start);

        return url;
    };

    app_registry.router_helpers.refreshUrlTmstmp = function(url){
        var tmstmp = '&tmstmp=' + Math.floor(Math.random() * (Date.now() - 0 + 1)) + 0;

        if(url.indexOf("&tmstmp") != -1 ){
            var tmstmp_pos = url.indexOf("&tmstmp");
            url = url.substring(0, tmstmp_pos);
        }
        return url += tmstmp;
    };

    app_registry.router_helpers.currentUrlWithOutParams = function(){

        console.info('routeToCollection... ');

        return null;
    };

    app_registry.init = function(){
        (debug)?console.info('app_registry -> init'):null;
        app_registry.getAuth();
    };

    return app_registry;
});