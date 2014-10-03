define(
    'views/react/controls/main_list',
    [
        'jquery',
        'react',
        'jsx!views/react/search',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'jsx!views/react/base/error_msg',
        //'models/rank',
        'event_bus'
    ],function($, React, InstantSearch, ButtonAdd, ButtonEdit, ButtonDelete, ErrorMsg, EventBus){

        var MainList = React.createClass({
            componentWillMount: function(){
                console.log('MainList WillMount');
            },
            //2-do:
            // * search
            // * filter
            addItem: function(){
                var new_model = this.props.collection.create();
                EventBus.trigger('item-add', new_model);
            },
            render: function(){
                var collection = this.props.collection;
                var items = collection.map(function(model){
                    console.log('MainList -> collection.map, model:');
                    console.log(model);

                    return <ListItem model={model} />
                });
                return(
                    <div className="MainList">
                        <ButtonAdd clicked={this.addItem} />
                        <ul>{items}</ul>
                    </div>
                    );
            }
        });

        var ListItem = React.createClass({
            getInitialState: function(){
                return {
                    open: false,
                    edited: false,
                    action_error: null
                }
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
            },
            componentWillMount: function(){
                /*console.log('ListItem WillMount, model:');
                console.log(this.props.model);*/
                //this.setState({model: this.props.model});
            },
            whenClickedCP: function(action){
                console.log('whenClickedCP, action -'+action);
                if(action){
                    if(action == 'delete'){
                        EventBus.trigger('item-delete', this.props.model);
                        /*
                        console.log('ListItem -> delete -> id = '+this.props.model.get('id'));
                        var self = this;
                        this.props.model.destroy({
                            wait: true,
                            success: function(){
                                var name = self.props.model.attributes['name'];
                                EventBus.trigger('success', 'Обьект «'+name+'» удален.');
                            },
                            error:
                                function(model, response) {
                                    self.setState({
                                        action_error: {
                                            response: response,
                                            model: model
                                        }
                                     });
                                }
                        });*/

                    }

                    if(action == 'edit'){

                        //this.el = $(document).find('global_modal');
                        EventBus.trigger('item-edit', this.props.model);

                        /*
                        this.setState({
                            edited: this.state.edited==true? false: true,
                            open: false
                        });*/
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
                    //EventBus.trigger('error', 'Ошибка вида', 'Произошла ошиба вывода. Обратитесь к администратору.');
                    EventBus.trigger('error', 'Ошибка', this.state.action_error.response);
                    //error_box = <ErrorMsg msg={this.state.action_error.response}/>;
                }
                return(
                    <div className="item" key={'item'+this.props.model.get('id')}>
                        <div className="item_name" clicked={this.whenClicked}>{this.props.model.get('name')}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'edit' +this.props.model.get('id')} mini="false" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'delete'+this.props.model.get('id')} mini="false" />
                        </div>
                    {error_box}
                    {edit_form}
                    </div>
                );
            }
        });
        return MainList;
    }
);
