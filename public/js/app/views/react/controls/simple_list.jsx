/** @jsx React.DOM */

define(
    'views/react/controls/simple_list',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'jsx!views/react/base/info_msg',
        'event_bus'
    ],function($, React, ControlsMixin, InfoMsg, EventBus){

        /* Select */

        var SimpleList = React.createClass({
            componentWillMount: function(){
                console.log('SimpleList WillMount');
            },
            addItem: function(){
                var new_model = this.props.collection.create(null, {silent: true}); //!silent - don't force re-render before save model to server
                EventBus.trigger('item-add', new_model);
            },
            render: function(){
                var collection = this.props.collection;

                var items = collection.map(function(model){
                    console.log('MainList -> collection.map, model:');
                    console.log(model);

                    return <SimpleListItem model={model} />
                });
                if(items.length<1){
                    items = <li><InfoMsg msg="Нет записей." /></li>;
                }

                return(
                    <div className="List">
                        <div className="SimpleList">
                            <div className="btn_add"><ButtonAdd clicked={this.addItem} /></div>
                            <ul>{items}</ul>
                        </div>
                    </div>
                    );
            }
        });

        var SimpleListItem = React.createClass({
            getInitialState: function(){
                return {
                    edited: false,
                    action_error: null
                }
            },
            componentWillMount: function(){
                console.log('SimpleListItem WillMount');
            },
            whenClickedCP: function(action){
                console.log('whenClickedCP, action -'+action);
                if(action){
                    if(action == 'delete'){
                        EventBus.trigger('item-delete', this.props.model);
                    }
                    if(action == 'edit'){
                        EventBus.trigger('item-edit', this.props.model);
                    }
                }
            },
            render: function(){
                console.log('ListItem render, item');
                console.log(this.props.model);

                var editable = this.props.model.get('attr_rus_names');
                var editable_controls = [];
                if(this.state.edited == true){
                    for(var attr in editable){
                        editable_controls.push(
                            <div className="Edit_Form">
                                <div className="control_name">{editable[attr]}</div>
                                <div className="control">{this.props.model.get(attr)}</div>
                            </div>
                        );
                    }
                }

                var edit_form = <div className="EditItemForm">{editable_controls}</div>;

                var error_box = '';
                if(this.state.action_error){
                    EventBus.trigger('error', 'Ошибка', this.state.action_error.response);
                }
                return(
                    <li className="item" key={'item'+this.props.model.get('id')}>
                        <div className="item_name" clicked={this.whenClicked}>{this.props.model.get('name')}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'edit' +this.props.model.get('id')} mini="true" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'delete'+this.props.model.get('id')} mini="true" />
                        </div>
                    {error_box}
                    {edit_form}
                    </li>
                    );
            }
        });

        return SimpleList;
    }
);