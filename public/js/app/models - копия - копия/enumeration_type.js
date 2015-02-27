define(
    'models/enumeration_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/enumeration_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                mask: null,
                is_draft: null,
                is_periodic: null,
                period_types: null,
                period_length: null,
                start_date: null,
                start_index: null
            },
            attr_rus_names: {
                name: 'Название',
                mask: 'Маска нумерации',
                is_draft: 'Черновик',
                is_periodic: 'Периодичен',
                period_types: 'Тип периода',
                period_length: 'Длительность периода',
                start_date: 'Начало периода',
                start_index: 'Начальный индекс'
            },
            attr_dependencies: {
                period_types: 'period_types'
            }, //for recursive objects
            hidden_fields:{
                /* rules to show hidden fields:
                 * field_name: {dependent_from_filed_name: value/array of values}
                 */
                period_types: {is_periodic: [true, 'true']}, //2-do: validate true value
                period_length: {is_periodic: [true, 'true']},
                start_date: {is_periodic: [true, 'true']},
                start_index: {is_periodic: [true, 'true']}
            },
            model_name: 'enumeration_type',
            model_rus_name: 'Тип нумерации',
            url: function() {
                return apiUrl('enumeration_type', this.id);
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
