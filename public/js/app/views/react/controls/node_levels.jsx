/** @jsx React.DOM */

define(
    'views/react/controls/node_levels',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        //'models/node_level',
        'models/node_levels_collection'
    ],function($, React, ControlsMixin, NodeLevelsCollection){

        var Node = React.createClass({
            render: function(){
                var client = this.props.node.get('client');
                var full_name = client.full_name;
                return(
                    <div className="node">{full_name}</div>
                );
            }
        });

        var NodeLevel = React.createClass({
            render: function(){
                var level = this.props.level;
                //var level = new NodeLevelModel(level);
                var nodes_collection = level.get('nodes');
                console.info('level:');
                console.info(level);

                console.info('nodes_collection');
                console.info(nodes_collection);
                var nodes = nodes_collection.map(function(node){
                    return <div><Node node={node} /></div>;
                });
                return(
                    <div className="node_level">{nodes}</div>
                );
            }
        });

        var NodeLevels = React.createClass({
            mixins: [ControlsMixin],
            getInitialState: function() {
                return {
                    value: false,
                    discard: undefined
                };
            },
            render: function(){
                var NodeLevels = [];

                var levels = new NodeLevelsCollection(this.props.collection);
                NodeLevels = levels.map(function(level){
                   return(
                        <NodeLevel level={level} />
                   );
                });
                return (
                    <div>{NodeLevels}</div>
                );
            }
        });

        return NodeLevels;
    }
);