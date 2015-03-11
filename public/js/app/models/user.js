define(
    'models/user',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/user loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,                
                login: null,
                is_admin: null
            },
            attr_rus_names: {
                login: 'Логин',
                is_admin: 'Администратор'
            },
            model_name: 'user',
            model_rus_name: 'Пользователь',
            list_output: {
                name: 'login'
            },
            form: {
                login: 'tiny_text',
                is_admin: 'bool_select'
            },
            url: function() {
                return apiUrl('user', this.id);
            }
        });

        return Model;
    }
);
