define(
    'views/react/base/item_link',
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
                this.props.onClick(this.props.item);
            },
            render: function(){
                return(<a draggable="false" href={this.props.item.id} onClick={this.handleClick}>{this.props.item.name}</a>)
            }
        });

        return ItemLink;
    }
);    