define(
    'models/secrecy_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/secrecy_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null,
                single_numeration: false
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                single_numeration: 'Единая нумерация'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'secrecy_type',
            model_rus_name: 'Тип секретности',
            url: function() {
                return apiUrl('secrecy_type', this.id);
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
