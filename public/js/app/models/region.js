define(
    'models/region',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/region loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                code: null,
                region_type: null,
                description: null
            },
            attr_description:{
                region_type: 'Объект типа региона'
            },
            attr_rus_names: {
                name: 'Название',
                code: 'Код',
                region_type: 'Тип региона',
                description: 'Описание'
            },
            attr_dependencies: {
                region_type: 'region_types'
            }, //for recursive objects
            model_name: 'region',
            model_rus_name: 'Регион',
            url: function() {
                return apiUrl('region', this.id);
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
