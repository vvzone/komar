define(
    'apiUrl',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'

    ],function($, _, Backbone, React){

        //var host = 'http://127.0.0.1:1337';
        var host = 'http://zend_test';
        var prefix = '/api/catalogs';
        var URLs = {
            ranks: function() {
                return host + prefix + "/ranks";
            },
            rank: function(id) {
                return host + prefix + "/ranks/"+ id;
            },
            positions: function() {
                return host + prefix + "/positions";
            },
            position: function(id) {
                return host + prefix + "/positions/"+ id;
            }
            /*subscriptions: function(userId, id) {
             return "/api/users/"+ userId +"/subscriptions/" + id;
             }*/
        };

        //apiUrl добавить
        var apiUrl = function(type) {
            return URLs[type] ?
                URLs[type].apply(this, [].slice.call(arguments, 1)) :
                undefined;
        };

        return apiUrl;
    }
);