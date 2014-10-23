define(
    'apiUrl',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'

    ],function($, _, Backbone, React){

        var local_server = true;

        var andrey_host_url = 'http://127.0.0.1:1337';
        var local_host_url = 'http://zend_test';
        var host = (local_server)? local_host_url: andrey_host_url;

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
                var local = host + prefix + "/urgencytypes";
                var production = host + prefix + "/urgency_types";

                return (local_server)? local: production;
            },
            urgency_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/urgencytypes/"+ id;
                var production = host + prefix + "/urgency_types/"+ id;

                return (local_server)? local: production;
            },
            /* Секретность */
            secrecy_types: function() {
                var local = host + prefix + "/secrecytypes";
                var production = host + prefix + "/secrecy_types";

                return (local_server)? local: production;
            },
            secrecy_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = + prefix + "/secrecytypes/"+ id;
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
                var production = host + prefix + "/attribute_types";

                return (local_server)? local: production;
            },
            document_attribute_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/docattributetypes/"+ id;
                var production = host + prefix + "/attribute_types/"+ id;

                return (local_server)? local: production;
            },
            /* Типы документов удостоверяющих личность*/
            person_document_types: function() {
                var local = host + prefix + "/persondoctypes";
                var production = host + prefix + "/person_document_type";

                return (local_server)? local: production;
            },
            person_document_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/persondoctypes/"+ id;
                var production = host + prefix + "/person_document_type/"+ id;

                return (local_server)? local: production;
            },
            /* Страны */
            countries: function() {
                var local = host + prefix + "/countries";
                var production = host + prefix + "/countryes";

                return (local_server)? local: production;
            },
            country: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/countries/"+ id;
                var production = host + prefix + "/countryes/"+ id;

                return (local_server)? local: production;
            },
            address_types: function() {
                var local = host + prefix + "/addresstypes";
                var production = host + prefix + "/address_types";

                return (local_server)? local: production;
            },
            address_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/addresstypes/"+ id;
                var production = host + prefix + "/address_types/"+ id;

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