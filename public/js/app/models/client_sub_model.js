define(
    'models/client_sub_model',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'

    ],function($, _, Backbone, React, apiUrl){

        console.log('models/client_sub_model loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                is_external: null,
                identification_number: null,
                full_name: null
            },
            attr_description:{
                is_external: 'Внешний корреспондент',
                identification_number: 'Идентификационный номер',
                full_name: 'Полное название'
            },
            attr_rus_names: {
                is_external: 'Внешний корреспондент',
                identification_number: 'Идентификационный номер',
                full_name: 'Полное название'
            },
            model_name: 'client',
            model_rus_name: 'Клиент',
            is_sub_model: true,
            attr_dependencies: {
                //тут может быть только коллекция для соответвующего id элемента
                //base_attr_type: 'constant',
                //attribute_type_childs: 'attribute_type_childs' //запрашиваем коллекцию
            }, //for recursive objects
            url: function() {
                return apiUrl('client', this.id);
            },
            initialize: function(){
                console.info('CLIENT-Model init');
                console.info(this);
                /* remove on production!!! */
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
