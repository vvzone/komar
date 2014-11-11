/** @jsx React.DOM */

define(
    'views/react/prototypes/levels',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/prototypes/levels_drag_and_drop_mixin'
    ],function($, _, Backbone, React, DragAndDropClassMixin){

        var LevelNode = React.createClass({
            //Draggable
            mixins: [DragAndDropClassMixin],
            getInitialState: function(){
                return({
                   mouseDown: false,
                   dragging: false
                });
            },
            render: function() {
                var output;
                var r_type = this.props.node.get('recipient_type');
                var class_name= "level_node" + ((r_type.code==1 || r_type.code==2)? " node_real": " node_abstract") + (this.state.dragging? " dragging": "");
                var title = '';
                return(
                    <div className={class_name}
                        onMouseDown={this.onMouseDown}
                    >
                            <div className="node_title">Title</div>
                    </div>);
            },
            makeTitle: function(r_type){
                var title = r_type.name;
                var client;
                console.log('r_type.name='+r_type.name);
                if(r_type.code == 1 || r_type.code == 2){
                    if(r_type.code == 2){
                        title = this.cutTitle(client.full_name, client.short_name);
                    }
                    title = this.cutTitle(''+client.full_name, ''+client.family_name);
                }
                return title;
            },
            cutTitle: function(long, short){
                if(long.length>55){
                    if(short.length<55){ //очень мощное колдунство
                        return short;
                    }
                    return short;
                }
                return long;
            }
        });

        var LevelNodes = React.createClass({
            componentWillMount: function() {},
            render: function() {
                var output;
                output = this.props.level_nodes_collection.map(function(node) {
                    return (
                        <LevelNode node={node}
                            onDragStart={this.props.onDragStart}
                            onDragStop={this.props.onDragStop}
                            dragData={this.props.dragData}
                        />
                    );
                });
                return <div classNames="level_node_box">{output}</div>
            }
        });

        var Level = React.createClass({
            //DropTarget
            getInitialState: function(){
                return {
                    hover: false
                };
            },
            render: function() {
                return(
                    <div className="level">
                        <div className="level_name">{this.props.model.get('name')}</div>
                        <div className="level_nodes">
                            <LevelNodes
                                level_nodes_collection={this.props.model.get('nodes')}
                                onDragStart={this.props.onDragStart}
                                onDragStop={this.props.onDragStop}
                                dragData={this.props.dragData}
                            />
                        </div>
                    </div>
                );
            }
        });

        var ListLevels = React.createClass({
            render: function(){
                var output;
                /* too much recursion? why? - because my name is muzzy!
                output = _.each(this.props.levels_collection, function(model){
                    return <ListTableItem model={model} />;
                });
                */

                output = this.props.levels_collection.map(function(model) {
                    console.log('level-model');
                    console.log(model);
                    return <Level model={model} />;
                });


                return <div>{output}</div>;
            }
        });

        var ListLevelsTable = React.createClass({
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

        return ListLevelsTable;
    }
);