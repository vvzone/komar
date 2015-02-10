/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree/tree_node_box',
    [
        'react'

    ],function(React){
        var TreeNodeBox = React.createClass({
            render: function(){
                var key='tree_box_name'+this.props.model.get('id');
                return(<span className="tree_box_node_name" key={key}>{this.props.model.get('name')}</span>)
            }
        });

        return TreeNodeBox;
    }
);


