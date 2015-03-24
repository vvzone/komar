/** @jsx React.DOM */

define(
    'views/react/table/header_link',
    [
        'jquery',
        'bootstrap',
        'react'
    ], function($, Bootstrap, React){


        var HeaderLink = React.createClass({
            render: function(){
                return (
                    <th onClick={this.callBack}><a href={this.props.current_url}>{this.props.column_rus_name}</a>{this.getSorting()}</th>
                );
            },
            callBack: function(){
                var sorted_by = false ;
                if(this.props.sort_order){
                    sorted_by = this.props.sort_order;
                }
                this.props.callback(this.props.column_name, sorted_by);
            },
            getSorting: function(){
                if(this.props.sort_order){
                    var icon = "fa fa-sort-";
                    icon += this.props.sort_order;

                    return <i className={icon}></i>;
                }
            }
        });

        return HeaderLink;
    }
);