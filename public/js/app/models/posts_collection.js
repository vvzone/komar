define(
    'models/posts_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'backbone_paginator',
        'react',
        'apiUrl',
        'models/post'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Post){

        console.log('models/post_collection loaded');

        var Posts = Backbone.PageableCollection.extend({
            model: Post,
            collection_rus_name: 'Должности',
            collection_name: 'posts',
            url: function() {
                return apiUrl('posts');
            },
            initialize: function(){
                /*this.on('change', function(){
                    console.info('Collection Change! > fetch');
                    this.fetch();
                }, this);*/

                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Posts;
    }
);

