/** @jsx React.DOM */

define(
    'views/react/table/generate_table',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'event_bus',

        'jsx!views/react/table/test'
    ],function(
            $, _, Backbone, React, Config, EventBus,
            Test
        ){
        var debug = (Config['debug'] && Config['debug']['debug_table'])? 1:null;

        var Table = React.createClass({
            mixins: [Test],
            render: function(){
                return(
                    <div className="table">Table</div>
                );
            },
            getTableHeader: function(){
                var header = [];
                _.each(this.props.model.table.header, function(num, key){
                    console.log(['num, key', num, key]);
                });

                /*
                for(var i=0; i<this.props.model.table.length; i++){
                    header.push(
                        <td>{this.props.model.attr_rus_names[]}</td>
                    );
                }
                */

            }
        });

        return Table;
    }
);