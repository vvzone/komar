define(
    'models/enumeration',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/enumeration loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                unit: null,
                enumeration_type: null,
                current_index: null,
                last_drop: null,
                next_drop: null
            },
            attr_rus_names: {
                unit: 'Подразделение',
                enumeration_type: 'Тип нумерации',
                current_index: 'Текущий индекс',
                last_drop: 'Метка последнего сброса',
                next_drop: 'Время следующего сброса'
            },
            attr_dependencies: {
                unit: 'unit' //???fix this
            }, //for recursive objects
            model_name: 'enumeration',
            model_rus_name: 'Нумерации',
            url: function() {
                return apiUrl('enumeration', this.id);
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
