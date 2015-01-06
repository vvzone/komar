define(['underscore', 'backbone'], function(_, Backbone) {
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
    return app_registry;
});