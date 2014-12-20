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

        var prefix = '/admin/api/object';
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
                var local = host + prefix + "/rank";
                var production = host + prefix + "/rank";

                return (local_server)? local: production;
            },
            rank: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/rank/"+ id;
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
            /* Документы */
            documents: function() {
                var local = host + prefix + "/document";
                var production = host + prefix + "/documents";

                return (local_server)? local: production;
            },
            document: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/document/"+ id;
                var production = host + prefix + "/documents/"+ id;

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
            },
            region_types: function() {
                var local = host + prefix + "/regiontypes";
                var production = host + prefix + "/region_types";

                return (local_server)? local: production;
            },
            region_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/regiontypes/"+ id;
                var production = host + prefix + "/region_types/"+ id;

                return (local_server)? local: production;
            },
            regions: function() {
                var local = host + prefix + "/regions";
                var production = host + prefix + "/regions";

                return (local_server)? local: production;
            },
            region: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/regions/"+ id;
                var production = host + prefix + "/regions/"+ id;

                return (local_server)? local: production;
            },
            location_types: function() {
                var local = host + prefix + "/locationtypes";
                var production = host + prefix + "/location_types";

                return (local_server)? local: production;
            },
            location_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/locationtypes/"+ id;
                var production = host + prefix + "/location_types/"+ id;

                return (local_server)? local: production;
            },
            street_types: function() {
                var local = host + prefix + "/streettypes";
                var production = host + prefix + "/street_types";

                return (local_server)? local: production;
            },
            street_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/streettypes/"+ id;
                var production = host + prefix + "/street_types/"+ id;

                return (local_server)? local: production;
            },
            sex_types: function() {
                var local = host + prefix + "/sex";
                var production = host + prefix + "/sex_types";

                return (local_server)? local: production;
            },
            sex_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/sex/"+ id;
                var production = host + prefix + "/sex_types/"+ id;

                return (local_server)? local: production;
            },
            /* Тип руководства подразделения*/
            commander_types: function() {
                var local = host + prefix + "/commandertypes";
                var production = host + prefix + "/commander_types";

                return (local_server)? local: production;
            },
            commander_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/commandertypes/"+ id;
                var production = host + prefix + "/commander_types/"+ id;

                return (local_server)? local: production;
            },
            /* ============ Настройки документов============= */

            /* типы периодов */
            period_types: function() {
                var local = host + prefix + "/periodtypes";
                var production = host + prefix + "/period_types";

                return (local_server)? local: production;
            },
            period_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/periodtypes/"+ id;
                var production = host + prefix + "/period_types/"+ id;

                return (local_server)? local: production;
            },
            enumeration_types: function() {
                var local = host + prefix + "/enumerationtypes";
                var production = host + prefix + "/enumeration_types";

                return (local_server)? local: production;
            },
            enumeration_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/enumerationtypes/"+ id;
                var production = host + prefix + "/enumeration_types/"+ id;

                return (local_server)? local: production;
            },
            /* Фактическая E-нумерация */
            enumerations: function() {
                var local = host + prefix + "/enumerations";
                var production = host + prefix + "/enumerations";

                return (local_server)? local: production;
            },
            enumeration: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/enumerations/"+ id;
                var production = host + prefix + "/enumerations/"+ id;

                return (local_server)? local: production;
            },
            /* Node Types */
            node_types: function() {
                var local = host + prefix + "/nodetypes";
                var production = host + prefix + "/node_types";

                return (local_server)? local: production;
            },
            node_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/nodetypes/"+ id;
                var production = host + prefix + "/node_types/"+ id;

                return (local_server)? local: production;
            },
            /* Client */
            persons: function() {
                var local = host + prefix + "/person";
                var production = host + prefix + "/persons_list";

                return (local_server)? local: production;
            },
            person: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/person/"+ id;
                var production = host + prefix + "/person/"+ id;

                return (local_server)? local: production;
            },
            units: function() {
                var local = host + prefix + "/unit";
                var production = host + prefix + "/units_list";

                return (local_server)? local: production;
            },
            unit: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/unit/"+ id;
                var production = host + prefix + "/unit/"+ id;

                return (local_server)? local: production;
            },
            clients: function() {
                var local = host + prefix + "/client";
                var production = host + prefix + "/clients_list";

                return (local_server)? local: production;
            },
            client: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/client/"+ id;
                var production = host + prefix + "/client/"+ id;

                return (local_server)? local: production;
            }




            //commander_types
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