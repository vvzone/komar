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
                var self = this;
                output = this.props.level_nodes_collection.map(function(node) {
                    return (
                        <LevelNode node={node}
                            onDragStart={self.props.onDragStart}
                            onDragStop={self.props.onDragStop}
                            dragData={self.dragData}
                        />
                    );
                });
                return <div classNames="level_node_box">{output}</div>
            },
            dragData: function(){
                return {
                    type: null,
                    index: null
                };
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
                    <div className={this.classes()}
                        onMouseEnter={this.hoverTrue}
                        onMouseLeave={this.hoverFalse}
                        onMouseUp={this.onDrop}
                    >
                        <div className="level_name">{this.props.level_model.get('name')}</div>
                        <div className="level_nodes">
                            <LevelNodes
                                level_nodes_collection={this.props.level_model.get('nodes')}
                                onDragStart={this.props.onDragStart}
                                onDragStop={this.props.onDragStop}
                            />
                        </div>
                    </div>
                );
            },
            classes: function(){
                var classes =
                  [
                      'level drop-target',
                      //"" + (this.props.target.accepts.join(' ')),
                      this.active()? 'active' : '',
                      //this.active() && this.props.currentDragItem.type === 'green' ? 'active-green' : '',
                      //this.active() && this.props.currentDragItem.type === 'blue' ? 'active-blue' : '',
                      this.disabled()? 'disabled' : '',
                      this.state.hover ? 'hover' : ''
                  ].join(' ');
                console.info('classes= '+classes);
                return classes;
            },
            active: function(){
                //not current
                // may not work if this will not re-render for change in currentDragItem - always same disabled and active

                var current_id = (this.props.currentDragItem)? this.props.currentDragItem.get('id'):null;
                var level_nodes_collection = this.props.level_model.get('nodes');
                var level_nodes_array = level_nodes_collection.toJSON();
                var ids_array = _.pluck(level_nodes_array, 'id');
                return (_.indexOf(ids_array, current_id)==-1 && this.props.currentDragItem!= null)? true:false;
            },
            disabled: function(){
                //current
                var current_id = (this.props.currentDragItem)? this.props.currentDragItem.get('id'):null;
                var level_nodes_collection = this.props.level_model.get('nodes');
                var level_nodes_array = level_nodes_collection.toJSON();
                var ids_array = _.pluck(level_nodes_array, 'id');
                console.info('_.indexOf('+ids_array+', '+current_id+')='+_.indexOf(ids_array, current_id));
                return (_.indexOf(ids_array, current_id)!=-1 && this.props.currentDragItem!= null)? true:false;
            },
            hoverFalse: function(){
                this.setState({
                    hover: false
                });
            },
            hoverTrue: function(){
                this.setState({
                    hover: true
                });
            },
            onDrop: function(){
                if(this.active()){
                    return({index: this.props.index + 1});
                }
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

                var self = this;
                var _i = 0; // ?
                output = this.props.levels_collection.map(function(level_model) {
                    console.log('level-model');
                    console.log(level_model);
                    return (
                        <Level
                            level_model={level_model}
                            index={++_i}
                            onDragStart={self.props.onDragStart}
                            onDragStop={self.props.onDragStop}
                            onDrop={self.props.onDrop}
                            currentDragItem={self.props.currentDragItem}
                        />
                    );
                    //this.props.currentDragItem


                });

                return <div>{output}</div>;
            }
        });

        var ListLevelsTable = React.createClass({
            //MainComponent
            getInitialState: function() {
                return {
                    levels_collection: [],
                    currentDragItem: null
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

                return (
                    <div>
                        <ListLevels
                            levels_collection={this.state.levels_collection}
                            onDragStart={this.onDragStart}
                            onDragStop={this.onDragStop}
                            onDrop={this.onDrop}
                            currentDragItem={this.state.currentDragItem}
                        />
                        <div>Добавить</div>
                    </div>
                );
            },
            onDragStart: function(details){
                this.setState({
                    currentDragItem: details
                });
            },
            onDragStop: function(){
                this.setState({
                    currentDragItem: null
                });
            },
            onDrop: function(target){
                this.setState({
                    lastDrop: {
                        source: this.state.currentDragItem,
                        target: target
                    }
                });
            }
        });

        return ListLevelsTable;
    }
);