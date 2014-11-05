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
                    >{this.props.model.get('name')}</div>
                );
            }
        });

        ListTable = React.createClass({
            getInitialState: function() {
                return {
                    collection: []
                };
            },
            componentWillMount: function() {
                console.log('ListTable mounting...');
                //test only
            },
            componentDidMount: function() {
                //var componentNode = this.getDOMNode();
                _.extend(this, Backbone.Events);
                this.on('test_event', function(data){
                    console.log('data='+data);
                });

                    this.setState({
                        collection: this.props.collection
                    });
            },
            render: function() {
                var list, output;
                //list = this.state.items;

                console.info('this.state.collection');
                console.log(this.state.collection);

                output = this.state.collection.map(function(model) {
                    return <ListTableItem model={model} />;
                });

                return <div>{output}</div>;
            }
        });

        return ListTable;
    }
);