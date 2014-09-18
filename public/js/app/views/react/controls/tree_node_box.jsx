/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree_node_box',
    [
        'react'

    ],function(React){
        var TreeNodeBox = React.createClass({
            render: function(){
                var key='tree_box_name'+this.props.item.id;
                return(<span className="tree_box_node_name" key={key}>{this.props.item.name}</span>)
            }
        });

        return TreeNodeBox;
    }
);


