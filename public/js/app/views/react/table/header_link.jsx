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
                    <th onClick={this.callBack}>{this.getSorting}<a href={this.props.current_url}>{this.props.column_rus_name}</a></th>
                );
            },
            callBack: function(){
                console.log('clicked!');
                this.props.callback(this.props.column_name);
            },
            getSorting: function(){
                if(this.props.sort_order){
                    console.log('have sort_order');
                    return this.props.sort_order.sort_order;
                }
            }
        });

        return HeaderLink;
    }
);