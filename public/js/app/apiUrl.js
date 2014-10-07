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
                if(id){
                    return host + prefix + "/ranks/"+ id;
                }else{
                    return host + prefix + "/ranks";
                }
            },
            posts: function() {
                return host + prefix + "/posts";
            },
            post: function(id) {
                return host + prefix + "/posts/"+ id;
            },
            /* Типы док-ов */
            doc_types: function() {
                return host + prefix + "/doctypes";
                //return host + prefix + "/document_types";
            },
            doc_type: function(id) {
                return host + prefix + "/doctypes/"+ id;
                //return host + prefix + "/document_types/"+ id;
            },
            /* Срочность */
            urgency_types: function() {
                //return host + prefix + "/docurgencytypes";
                return host + prefix + "/urgencytypes";
            },
            urgency_type: function(id) {
                //return host + prefix + "/docurgencytypes/"+ id;
                return host + prefix + "/urgencytypes/"+ id;
            },
            /* Секретность */
            secrecy_types: function() {
                //return host + prefix + "/docsecrecytypes";
                return host + prefix + "/secrecy_types";
            },
            secrecy_type: function(id) {
                //return host + prefix + "/docsecrecytypes/"+ id;
                return host + prefix + "/secrecy_types/"+ id;
            },
            /* Группы типов док-ов */
            doc_type_groups: function() {
                return host + prefix + "/doctypegroups";
            },
            doc_type_group: function(id) {
                return host + prefix + "/doctypegroups/"+ id;
            },
            /* Типы атрибутов */
            attribute_types: function() {
                return host + prefix + "/attributetypes";
            },
            attribute_type: function(id) {
                return host + prefix + "/attribute_types/"+ id;
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