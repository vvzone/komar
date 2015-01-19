define(
    'apiUrl',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config'
    ],function($, _, Backbone, React, Config){

        var debug = (Config['debug'] && Config['debug']['apiUrl'])? 1:null;

        var local_server = (Config['local_server'])? true: null;
        (debug)?console.log('local_server='+local_server):null;

        var andrey_host_url = 'http://127.0.0.1:1337';
        var local_host_url = 'http://zend_test:9080';
        var host = (local_server)? local_host_url: andrey_host_url;

        var prefix = '/admin/api/object';
        var production_prefix = '/admin/api/object';
        var sys_prefix ='/admin/sys';
        var production_sys_prefix = '/admin/api/object';

        prefix = (local_server)? prefix:production_prefix;
        sys_prefix = (local_server)? sys_prefix:production_sys_prefix;

        var URLs = {
            client_menus: function(){
                var local = host + sys_prefix + "/client_menu";
                var production = host + sys_prefix + "/client_menu_tree/0";

                return (local_server)? local: production;
            },
            client_menu: function(trash_id){
                var id = (trash_id)? trash_id:'';
                var local = host + sys_prefix + "/client_menu/"+id;
                var production = host + sys_prefix + "/client_menu_tree/"+id;

                return (local_server)? local: production;
            },
            menus: function(){
                var local = host + sys_prefix + "/menu";
                var production = host + sys_prefix + "/admin_menu_tree/0";

                return (local_server)? local: production;
            },
            menu: function(trash_id){
                var id = (trash_id)? trash_id:'';
                var local = host + sys_prefix + "/menu/"+id;
                var production = host + sys_prefix + "/admin_menu_tree/"+id;

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
                var production = host + prefix + "/rank/"+ id; // проверку не Null ли id

                return (local_server)? local: production;
            },
            posts: function() {
                var local = host + prefix + "/post";
                var production = host + prefix + "/posts";

                return (local_server)? local: production;
            },
            post: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/post/"+ id;
                var production = host + prefix + "/posts/"+ id;

                return (local_server)? local: production;
            },
            /* Типы док-ов */
            document_types: function() {
                var local = host + prefix + "/document_type";
                var production = host + prefix + "/document_types";

                return (local_server)? local: production;
            },
            document_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/document_type/"+ id;
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
                var local = host + prefix + "/urgency_type";
                var production = host + prefix + "/urgency_types";

                return (local_server)? local: production;
            },
            urgency_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/urgency_type/"+ id;
                var production = host + prefix + "/urgency_types/"+ id;

                return (local_server)? local: production;
            },
            /* Секретность */
            secrecy_types: function() {
                var local = host + prefix + "/secrecy_type";
                var production = host + prefix + "/secrecy_types";

                return (local_server)? local: production;
            },
            secrecy_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = + prefix + "/secrecy_type/"+ id;
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
                var local = host + prefix + "/attribute_type";
                var production = host + prefix + "/attribute_types";

                return (local_server)? local: production;
            },
            attribute_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/attribute_type/"+ id;
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
                var local = host + prefix + "/period_type";
                var production = host + prefix + "/period_type";

                return (local_server)? local: production;
            },
            period_type: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/period_type/"+ id;
                var production = host + prefix + "/period_type/"+ id;

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
            },
            routes: function() {
                var local = host + prefix + "/route";
                var production = host + prefix + "/route";

                return (local_server)? local: production;
            },
            route: function(trash_id) {
                var id = (trash_id)? trash_id:'';
                var local = host + prefix + "/route/"+ id;
                var production = host + prefix + "/route/"+ id;

                return (local_server)? local: production;
            }
        };

        //apiUrl добавить
        return function(type){
            var id = [].slice.call(arguments, 1);
            return URLs[type] ?
                URLs[type].apply(this, [].slice.call(arguments, 1)) :
                undefined;

        };
    }
);