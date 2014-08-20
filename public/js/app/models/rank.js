define(
    'models/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/rank loaded');
        /*
        * id:1, is_officer:false, name:"Рядовой", short_name:null, description:null, created_at:1408439617871, deleted_at:null
        * */
        var Rank = Backbone.Model.extend({
            /*defaults: {
                id: null,
                name: null,
                order: null
            },*/
            pole_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                description: 'Описание',
                order: 'Порядок',
                is_officer: 'Офицер'
            },
            url: function() {
                return apiUrl('rank', this.id);
            }
        });

        return Rank;
    }
);
