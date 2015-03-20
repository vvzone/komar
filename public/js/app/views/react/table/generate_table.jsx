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

        'jsx!views/react/controls/paginator/paginator'
    ],function(
            $, _, Backbone, React, Config, EventBus,
            Paginator
        ){
        var debug = (Config['debug'] && Config['debug']['debug_table'])? 1:null;

        var Table = React.createClass({
            //mixins: [Test],
            getPaginator: function(){
                var pagination_request = this.props.pagination;
                if(this.props.pagination){
                    return <Paginator pagination={pagination_request} callback={this.collectionRePaginate} />;
                }
                return null;
            },
            collectionRePaginate: function(event){
                console.info(['collectionPaginate', event]);
            },
            render: function(){
                return(
                    <div className="table_component">
                        <table className="table table-striped table-bordered table-hover">
                            <tbody>
                                <tr>{this.getTableHeader()}</tr>
                                {this.getTable()}
                            </tbody>
                        </table>
                        <div>{this.getPaginator()}</div>
                    </div>

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
                    var url = 'url';
                    var new_url= self.getCurrentUrl(prop);
                    header.push(<th><a href={new_url}>{self.getColumnHeader(rule, prop)}</a></th>);
                });
                return header;
            },
            getHeaderLink: function(){

            },
            getCurrentUrl: function(sort_by_name){
                (debug)?console.info(['calculating current_url']):null;
                var current_url = Backbone.history.fragment;
                var where_params_start = current_url.indexOf("?");
                (debug)?console.info(current_url.indexOf("?")):null;
                where_params_start = where_params_start +'';
                if(where_params_start == -1){
                    where_params_start = current_url.length;
                }
                var url_params = current_url.substring(where_params_start);
                (debug)?console.info(['params', url_params]):null;
                var url = 'admin#'+current_url.substring(0, where_params_start);
                (debug)?console.info(['current_url, w/o params', url]):null;


                return url+'?sort_by='+sort_by_name;
            },
            getParameters: function(url_params){
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