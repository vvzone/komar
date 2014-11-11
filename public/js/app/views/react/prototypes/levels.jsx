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
            mixins: [DragAndDropMixin],
            cutTitle: function(long, short){
                if(long.length>55){
                    if(short.length<55){ //очень мощное колдунство
                        return short;
                    }
                    return short;
                }
                return long;
            },
            render: function() {
                var output;
                var r_type = this.props.node.get('recipient_type');
                var class_name = 'node_abstract';
                var title = r_type.name;
                console.log('r_type.name='+r_type.name);
                if(r_type.code == 1 || r_type.code == 2){
                    class_name = 'node_real';
                    var client = this.props.node.get('client');
                    if(r_type.code == 2){
                        title = this.cutTitle(client.full_name, client.short_name);
                    }
                    title = this.cutTitle(''+client.full_name, ''+client.family_name);
                }
                return(
                    <div className={class_name}
                         draggable="true"
                         onDrop={this.drop}
                         onDragEnd={this.dragEnd}
                         onDragStart={this.dragStart}
                         onDragOver={this.dragOver}
                         onDragLeave={this.dragLeave}>
                            <div className="node_title">{title}</div>
                    </div>);
            }
        });

        LevelNodes = React.createClass({
            componentWillMount: function() {},
            render: function() {
                var output;
                output = this.props.level_nodes_collection.map(function(node) {
                    return <LevelNode node={node} />;
                });
                return <div classNames="level_node_box">{output}</div>
            }
        });

        ListTableItem = React.createClass({
            render: function() {
                return(
                    <div className="level">
                        <div className="level_name">{this.props.model.get('name')}</div>
                        <div className="level_nodes"><LevelNodes level_nodes_collection={this.props.model.get('nodes')} /></div>
                    </div>
                );
            }
        });

        var ListLevels = React.createClass({
            render: function(){
                var output;
                /* too much recursion? why? because my name is muzzy!
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