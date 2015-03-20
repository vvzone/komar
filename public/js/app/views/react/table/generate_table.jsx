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
                    <table className="table table-striped table-bordered table-hover">
                        <tbody>
                            <tr>{this.getTableHeader()}</tr>
                            {this.getTable()}
                        </tbody>
                    </table>
                );
            },
            getTable: function(){
                var table = [];
                var self = this;
                _.each(this.props.collection.models, function(model){
                    table.push(
                        <tr>{self.getTableRow(model)}</tr>
                    );
                });
                return table;
            },
            getTableRow: function(model){
                var row = [];
                console.info(['model', model]);
                _.each(this.props.collection.model.prototype.table.columns, function(rule, prop){
                    var value = model.get(prop);
                    console.log(['model.get('+prop+')', value]);
                    if(_.has(rule, 'value') && value){
                        row.push(
                            <td>{rule.value(value)}</td>
                        );
                        console.warn(['rule.draw(value)', rule.value(value)]);
                    }else{
                        row.push(
                            <td>{value}</td>
                        );
                        console.log('normal value', value);
                    }
                });

                return row;
            },
            getTableHeader: function(){
                var header = [];
                var self = this;
                (debug)?console.info(['this.props.collection', this.props.collection]):null;
                _.each(this.props.collection.model.prototype.table.columns, function(rule, prop){
                    (debug)?console.log(['rule, prop', rule, prop]):null;
                    header.push(<th>{self.getColumnHeader(rule, prop)}</th>);
                });
                return header;
            },
            getColumnHeader: function(rule, prop){
                var header ='';
                if(_.has(rule, 'header')){
                    header = rule.header;
                }else{
                    header = this.props.collection.model.prototype.attr_rus_names[prop];
                }
                return header;
            }
        });

        return Table;
    }
);