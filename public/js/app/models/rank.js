define(
    'models/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config'
    ],function($, _, Backbone, React, apiUrl, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        (debug)?console.log('models/rank loaded'):null;

        var Rank = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null,
                is_officer: false,
                description: 'Без описания'
            },
            validation: {
                name: {
                    required: true,
                    msg: "Обязательное поле"
                },
                short_name: {
                    minLength: 3,
                    msg: "Не может быть короче 3 символов"
                }
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                description: 'Описание',
                is_officer: 'Офицер'
            },
            form: {
                name: 'tiny_text',
                is_officer: 'simple_select',
            },
            model_name: 'rank',
            model_rus_name: 'Звание',
            attr_dependencies: [], //for recursive objects
            url: function() {
                return apiUrl('rank', this.id);
            },
            initialize: function(){
                this.on('change', function(){
                    console.info('change');
                    console.info(['validate', this.validate()]);
                    console.info(['isValid', this.isValid()]);
                    console.info(['this', this]);
                    this.bind('validated:invalid', function(model, errors) {
                        this.validationErrors = errors;
                    });
                })
            }
        });

        return Rank;
    }
);
