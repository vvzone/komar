/** @jsx React.DOM */

define(
    'views/react/client_item_link',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var ItemLink = React. createClass({
            /*
             * props: name, clicked(), id
             *
             * */

            handleClick: function(e){
                /*e.preventDefault();*/
                EventBus.trigger(this.props.model.get('entity'));
                //this.props.onClick(this.props.model);
            },
            render: function(){
                var href= "#client/"+this.props.model.get('entity');
                return(<a draggable="false" href={href} onClick={this.handleClick}>{this.props.model.get('name')}</a>)
            }
        });

        return ItemLink;
    }
);


