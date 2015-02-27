define(
    'models/person_document_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/person_document_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                is_full: null,
                is_main: null,
                series_mask: null,
                number_mask: null,
                valid_period: null
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                is_full: 'Полная идентификация',
                is_main: 'Основной документ',
                series_mask: 'Маска серии',
                number_mask: 'Маска номера',
                valid_period: 'Длительность действия'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'person_document_type',
            model_rus_name: 'Тип документа удостоверяющего личность',
            url: function() {
                return apiUrl('person_document_type', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return Model;
    }
);
