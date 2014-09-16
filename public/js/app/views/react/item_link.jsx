/** @jsx React.DOM */

define(
    'views/react/item_link',
    [
        'jquery',
        'react'
    ],function($, React){
        var ItemLink = React. createClass({
            /*
             * props: name, clicked(), id
             *
             * */

            handleClick: function(e){
                e.preventDefault();
                //this.props.onClick(this.props.model);
            },
            render: function(){
                var href= "#"+this.props.model.get('entity');
                return(<a draggable="false" href={href} onClick={this.handleClick}>{this.props.model.get('name')}</a>)
            }
        });

        return ItemLink;
    }
);


