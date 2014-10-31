/** @jsx React.DOM */

define(
    'views/react/prototypes/levels',
    [
        'jquery',
        'underscore',
        'react'
    ],function($, _, React){

        var test_array = [
            {}
        ];

        var ListTable, ListTableItem;

        ListTable = React.createClass({
            getInitialState: function() {
                return {
                    items: []
                };
            },
            componentWillMount: function() {
                return console.log('ListTable mounting...');
            },
            componentDidMount: function() {
                return _.extend(this, Events);
            },
            render: function() {
                var list, output;
                list = this.state.items;

                _.sortBy(list, function(item){
                    item.get('level'); 
                });



                output = list.map(function(item) {
                    return <ListTableItem item={item} />;
                });
                return '<div>' + output + '</div>';
            }
        });

        ListTableItem = React.createClass({
            render: function() {}

        });


        return ListTable;
    }
);