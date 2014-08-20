define(
    'views/ranks_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'models/ranks_collection',
        'views/rank'
    ],function($, _, Backbone, React, RanksCollection, RankView){

        console.log('module views/ranks_list loaded');

        var RanksListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class
            tagName: 'ul',
            initialize: function() {
                console.log('RanksListView initialization...');
                /*
                 var response = Positions.fetch();
                 this.collection = response; //['responseJSON'];
                 */
                _.bindAll(this, 'render');
                this.collection.bind('reset', this.render);
            },
            render: function(){
                console.log('trying render Ranks collection...');
                console.log(this.collection.toJSON());
                console.log('trying render Ranks collection object...');
                console.log(this.collection);
                this.collection.each(function(rank){
                    console.log('current model:');
                    console.log(rank);
                    var rankView = new RankView({ model: rank });
                });

            }
        });

        var test_collection = [
            {id:1, is_officer:false, name:"Рядовой", short_name:null, description:null, created_at:1408439617871, deleted_at:null}
        ];

        var test_collection2 = [{"id": "1233","name": "Karen","grade": "C"},{"id": "1234","name": "Susan", "grade": "F"}];
        //var Ranks = new RanksCollection({collection: test_collection});

        var Ranks = new RanksCollection;

        //Ranks.fetch();

        console.log('trying fetch collection...');

        /*var p = Ranks.fetch({
            complete: function(){
                console.info('complete & Current collection:');
                console.info(Ranks.toJSON());

                var RanksList = new RanksListView({collection: Ranks.toJSON()});
            },
            done: function(){
                console.info('done & Current collection:');
                console.info(Ranks.toJSON());
            },
            success: function(){
                console.info('success & Current collection:');
                console.info(Ranks.toJSON());
            }
        });*/


        //console.log('fetch obj:');
        //console.log(p);


        function sleep(millis, callback) {
            setTimeout(function()
                { callback(); }
                , millis);
        }

        function foobar_cont(){
            console.log("after 3000ms, collection:");
            console.log(Ranks.toJSON());
        };

        sleep(3000, foobar_cont);

        //var PositionsList = new PositionsListView;

        /*
        p.complete(function () {
            console.log('Ranks fetch complete, collection:');
            console.log(Ranks.toJSON());
            var RanksList = new RanksListView({collection: Ranks.toJSON()});
        });*/
    }
);