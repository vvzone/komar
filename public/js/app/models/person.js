define(
    'models/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/person loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,                
                name: null,
                patronymic: null,
                family: null,
                birth_date: null,
                birth_place: null,
                sex: null,
                inn: null,
                citizenship: null,
                deputy: null
            },
            attr_rus_names: {
                name: 'Имя',
                patronymic: 'Отчество',
                family_name: 'Фамилия',
                birth_date: 'Дата рождения',
                birth_place: 'Место рождения',
                sex: 'Пол',
                inn: 'ИНН',
                citizenship: 'Гражданство',
                deputy: 'Заместитель'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'person',
            model_rus_name: 'Физлицо',
            url: function() {
                return apiUrl('person', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
