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
        var local_server = true;
        var prefix = '/api/catalogs';
        var URLs = {
            menus: function(){
                var local = host + prefix + "/menus";
                var production = host + prefix + "/menus";

                return (local_server)? local: production;
            },
            menu: function(trash_id){
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/menus/"+id;
                var production = host + prefix + "/menus/"+id;

                return (local_server)? local: production;
            },
            ranks: function() {
                var local = host + prefix + "/ranks";
                var production = host + prefix + "/ranks";

                return (local_server)? local: production;
            },
            rank: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/ranks/"+ id;
                var production = host + prefix + "/ranks/"+ id; // проверку не Null ли id

                return (local_server)? local: production;
            },
            posts: function() {
                var local = host + prefix + "/posts";
                var production = host + prefix + "/posts";

                return (local_server)? local: production;
            },
            post: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/posts/"+ id;
                var production = host + prefix + "/posts/"+ id;

                return (local_server)? local: production;
            },
            /* Типы док-ов */
            doc_types: function() {
                var local = host + prefix + "/doctypes";
                var production = host + prefix + "/document_types";

                return (local_server)? local: production;
            },
            doc_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/doctypes/"+ id;
                var production = host + prefix + "/document_types/"+ id;

                return (local_server)? local: production;
            },
            /* Срочность */
            urgency_types: function() {
                var local = host + prefix + "/docurgencytypes";
                var production = host + prefix + "/urgency_types";

                return (local_server)? local: production;
            },
            urgency_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/docurgencytypes/"+ id;
                var production = host + prefix + "/urgency_types/"+ id;

                return (local_server)? local: production;
            },
            /* Секретность */
            secrecy_types: function() {
                var local = host + prefix + "/docsecrecytypes";
                var production = host + prefix + "/secrecy_types";

                return (local_server)? local: production;
            },
            secrecy_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = + prefix + "/docsecrecytypes/"+ id;
                var production = host + prefix + "/secrecy_types/"+ id;

                return (local_server)? local: production;
            },
            /* Группы типов док-ов */
            doc_type_groups: function() {
                var local = host + prefix + "/doctypegroups";
                var production = host + prefix + "/document_type_groups";

                return (local_server)? local: production;
            },
            doc_type_group: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/doctypegroups/"+ id;
                var production = host + prefix + "/document_type_groups/"+ id;

                return (local_server)? local: production;
            },
            /* Типы атрибутов */
            attribute_types: function() {
                var local = host + prefix + "/attributetypes";
                var production = host + prefix + "/attribute_types";

                return (local_server)? local: production;
            },
            attribute_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/attributetypes/"+ id;
                var production = host + prefix + "/attribute_types/"+ id;

                return (local_server)? local: production;
            },
            /* Типы атрибутов документа*/
            document_attribute_types: function() {
                var local = host + prefix + "/docattributetypes";
                var production = host + prefix + "/document_attribute_types";

                return (local_server)? local: production;
            },
            document_attribute_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/docattributetypes/"+ id;
                var production = host + prefix + "/document_attribute_types/"+ id;

                return (local_server)? local: production;
            }
            /*subscriptions: function(userId, id) {
             return "/api/users/"+ userId +"/subscriptions/" + id;
             }*/
        };

        //apiUrl добавить
        return function(type){
            var id = [].slice.call(arguments, 1);
            console.log('id = [].slice.call(arguments, 1)');
            console.log(id);
            return URLs[type] ?
                URLs[type].apply(this, [].slice.call(arguments, 1)) :
                undefined;

        };
    }
);