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
            menus: function(){
                return host + prefix + "/menus";
            },
            menu: function(id){
                return host + prefix + "/menus/"+id;
            },
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
            },
            doc_type_groups: function() {
                return host + prefix + "/doctypegroups";
            },
            doc_type_group: function(id) {
                return host + prefix + "/doctypegroups/"+ id;
            }
            /*subscriptions: function(userId, id) {
             return "/api/users/"+ userId +"/subscriptions/" + id;
             }*/
        };

        //apiUrl добавить
        return function(type) {
            return URLs[type] ?
                URLs[type].apply(this, [].slice.call(arguments, 1)) :
                undefined;
        };
    }
);