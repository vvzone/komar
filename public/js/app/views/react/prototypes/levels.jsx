/** @jsx React.DOM */

define(
    'views/react/prototypes/levels',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/prototypes/levels_drag_and_drop_mixin',
        ''
    ],function($, _, Backbone, React, DragAndDropMixin){

        var ListTable, ListTableItem;

        var LevelNode, LevelNodes;

        LevelNode = React.createClass({
            render: function() {
                var output;
                return output =
                    <div className="node"
                         draggable="true"
                         onDrop={this.drop}
                         onDragEnd={this.dragEnd}
                         onDragStart={this.dragStart}
                         onDragOver={this.dragOver}
                         onDragLeave={this.dragLeave}></div>;
            }
        });

        LevelNodes = React.createClass({
            componentWillMount: function() {},
            render: function() {
                var output;
                output = this.props.nodes.map(function(node) {
                    return <LevelNode nope={node} />;
                });
                return <div classNames="level_node_box">{output}</div>
            }
        });

        ListTableItem = React.createClass({
            mixins: [DragAndDropMixin],
            render: function() {
                return(
                    <div className="level">
                        <div className="level_name">{this.props.model.get('name')}</div>
                        <div className="level_nodes"><LevelNodes nodes={this.props.model.get('nodes')} /></div>
                    </div>
                );
            }
        });

        var ListLevels = React.createClass({
            render: function(){
                var output;
                /* too much recursion? why?
                output = _.each(this.props.levels_collection, function(model){
                    return <ListTableItem model={model} />;
                });
                */

                output = this.props.levels_collection.map(function(model) {
                    console.log('level-model');
                    console.log(model);
                    return <ListTableItem model={model} />;
                });


                return <div>{output}</div>;
            }

        });

        ListTable = React.createClass({
            getInitialState: function() {
                return {
                    levels_collection: []
                };
            },
            componentWillMount: function() {
                console.log('ListTable mounting...');
                //test only
                this.setState({
                    levels_collection: this.props.collection
                });
            },

            componentDidMount: function() {
                //var componentNode = this.getDOMNode();
                _.extend(this, Backbone.Events);
                this.on('test_event', function(data){
                    console.log('data='+data);
                });
            },
            render: function() {
                var levels_list_output;
                //list = this.state.items;
                console.info('this.state.levels_collection');
                console.log(this.state.levels_collection);
                //return <div><List levels_collection={this.state.levels_collection} /><div>Добавить</div></div>;

                return <div><ListLevels levels_collection={this.state.levels_collection} /><div>Добавить</div></div>;
            }
        });

        return ListTable;
    }
);