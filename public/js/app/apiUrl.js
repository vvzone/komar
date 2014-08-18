define(
    'apiUrl',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'

    ],function($, _, Backbone, React){

        var URLs = {
            ranks: function() {
                return "/api/ranks";
            },
            rank: function(id) {
                return "/api/ranks/"+ id;
            },
            positions: function() {
                return "/api/positions";
            },
            position: function(id) {
                return "/api/positions/"+ id;
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