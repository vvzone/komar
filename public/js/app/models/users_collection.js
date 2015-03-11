define(
    'models/users_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/user'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Model){

        console.log('models/users_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Пользователи',
            collection_name: 'users',
            url: function(){
                return apiUrl('users');
            }
        });

        return Collection;
    }
);
