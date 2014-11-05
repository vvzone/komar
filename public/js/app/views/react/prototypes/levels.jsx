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

        ListTableItem = React.createClass({
            mixins: [DragAndDropMixin],
            render: function() {
                return(
                    <div className="level"
                    draggable="true"
                    onDrop={this.drop}
                    onDragEnd={this.dragEnd}
                    onDragStart={this.dragStart}
                    onDragOver={this.dragOver}
                    onDragLeave={this.dragLeave}
                    >{this.props.item.name}</div>
                );
            }
        });

        ListTable = React.createClass({
            getInitialState: function() {
                return {
                    items: []
                };
            },
            componentWillMount: function() {
                console.log('ListTable mounting...');
                //test only
                this.setState({
                    items: node_levels
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
                var list, output;
                list = this.state.items;

                list = _.sortBy(list, function(item){
                    //item.get('level');
                    return item.level; //MODEL.GET!
                });

                console.info('list');
                console.log(list);

                output = list.map(function(item) {
                    return <ListTableItem item={item} />;
                });

                return <div>{output}</div>;
            }
        });

        return ListTable;
    }
);