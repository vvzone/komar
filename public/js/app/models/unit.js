define(
    'models/unit',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/unit loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                identification_number: null,
                short_name: null,
                own_numeration: null,
                is_legal: null,
                parent: null,
                commander: null,
                deputy: null,
                on_duty: null
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокращенное название',
                identification_number: 'Идентификационный номер',
                own_numeration: 'Собственная нумерация',
                is_legal: 'Юридическое лицо',
                parent: 'Родительское подразделение',
                commander: 'Руководитель',
                deputy: 'Заместитель',
                on_duty: 'Ответственный'
            },
            attr_dependencies: {
                commander: 'constant',
                deputy: 'constant',
                on_duty: 'constant'
            },
            model_name: 'unit',
            model_rus_name: 'Подразделение',
            url: function() {
                return apiUrl('unit', this.id);
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
