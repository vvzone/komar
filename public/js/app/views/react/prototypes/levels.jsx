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
                //<div className="node_title">Title</div>
                //
                return(
                    <div
                        style={this.style()}
                        className={class_name}
                        onMouseDown={this.onMouseDown}
                        onMouseUp={this.onMouseUp}
                    >TEST
                    </div>);
            },
            style: function(){
                if(this.state.dragging){
                    return {
                            position: 'absolute',
                            left: this.state.left,
                            top: this.state.top
                        };
                }
                return {};
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
            dragData: function(node){
                return {
                    node: node,
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
                /*$(this.getDOMNode()).mouseover(function(){
                    console.warn('onMouseOver JS');
                });*/
                return(
                    <div className={this.classes()}
                        onMouseOver={this.testOver}
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
                //console.info('classes= '+classes);
                return classes;
            },
            active: function(){
                //not current
                // may not work if this will not re-render for change in currentDragItem - always same disabled and active

                var current_id = (this.props.currentDragItem)? this.props.currentDragItem.node.get('id'):null;
                var level_nodes_collection = this.props.level_model.get('nodes');
                var level_nodes_array = level_nodes_collection.toJSON();
                var ids_array = _.pluck(level_nodes_array, 'id');
                return (_.indexOf(ids_array, current_id)==-1 && this.props.currentDragItem!= null)? true:false;
            },
            disabled: function(){
                //current
                var current_id = (this.props.currentDragItem)? this.props.currentDragItem.node.get('id'):null;
                var level_nodes_collection = this.props.level_model.get('nodes');
                var level_nodes_array = level_nodes_collection.toJSON();
                var ids_array = _.pluck(level_nodes_array, 'id');
                //console.info('_.indexOf('+ids_array+', '+current_id+')='+_.indexOf(ids_array, current_id));
                return (_.indexOf(ids_array, current_id)!=-1 && this.props.currentDragItem!= null)? true:false;
            },
            testOver: function(event){
                console.info('testOver, event.taget:');
                console.info(event.target);
                console.info('react Component= '+ this.props.level_model.get('name'))
            },
            hoverFalse: function(){
                console.info('hoverFalse '+ this.props.level_model.get('name'));
                this.setState({
                    hover: false
                });
            },
            hoverTrue: function(){
                console.info('Hover = ' + this.props.level_model.get('name'));
                this.setState({
                    hover: true
                });
            },
            onDrop: function(){
                //проверять был ли реальный дрег
                if(this.props.currentDragItem!=null){
                    console.info('onDrop -> ');
                    console.info('this level (who throw onDrop)=');
                    console.info(this.props.level_model);

                    var old_collection = this.props.currentDragItem.node.collection;
                    console.info('old_collection');
                    console.info(old_collection);

                    var current_nodes_collection = this.props.level_model.get('nodes');
                    console.info('Dragged on Level_model:'); //wrong level dragged on
                    console.info(this.props.level_model);
                    console.info('Dragged ON nodes_collection:');
                    console.info(current_nodes_collection);

                    var draggedNode = this.props.currentDragItem.node;
                    console.info('draggedNode');
                    console.info(draggedNode);

                    current_nodes_collection.add(draggedNode); //check this!
                    //old_collection.remove(draggedNode);

                    if(this.active()){
                        return({index: this.props.index + 1});
                    }
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
                console.info('onDragStart->setState->currentDragItem = details,');
                console.info(details);
                /*
                this.setState({
                    currentDragItem: details
                });
                */
            },
            onDragStop: function(){
                this.setState({
                    currentDragItem: null
                });
            },
            onDrop: function(target){
                console.info('onDrop->(target)=');
                console.info(target);
                this.setState({
                    lastDrop: {
                        source: this.state.currentDragItem.node,
                        target: target
                    }
                });
            }
        });

        return ListLevelsTable;
    }
);