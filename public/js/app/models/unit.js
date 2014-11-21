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
                short_name: null,
                own_numeration: null,
                is_legal: null,
                parent: null,
            },
            attr_rus_names: {
                short_name: 'Сокращенное название',
                own_numeration: 'Собственная нумерация',
                is_legal: 'Юридическое лицо',
                parent: 'Родительское подразделение'

            },
            attr_dependencies: [], //for recursive objects
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
