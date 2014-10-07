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
        'jsx!views/react/base/info_msg',
        'jsx!views/react/search',
        //'models/rank',
        'event_bus'
    ],function($, React, InstantSearch, ButtonAdd, ButtonEdit, ButtonDelete, ErrorMsg, InfoMsg, Search, EventBus){

        var MainList = React.createClass({
            componentWillMount: function(){
                console.log('MainList WillMount');
            },
            //2-do:
            // * search
            // * filter
            addItem: function(){
                var new_model = this.props.collection.create(null, {silent: true}); //!silent - don't force re-render before save model to server
                EventBus.trigger('item-add', new_model);
            },
            render: function(){
                var collection = this.props.collection;
                if(collection.collection_rus_name){
                    $('#main_top').html('<h2>Каталог &laquo;'+collection.collection_rus_name+'&raquo;</h2>');
                }else{
                    $('#main_top').html('<h2>Название каталога не задано.</h2>');
                }

                var items = collection.map(function(model){
                    console.log('MainList -> collection.map, model:');
                    console.log(model);

                    return <ListItem model={model} />
                });
                if(items.length<1){
                    items = <li><InfoMsg msg="Нет записей." /></li>;
                }

                var switch_view = '';
                if(collection.may_tree){
                    var view_as_plain_url ='#'+collection.collection_name;
                    switch_view = <div className="switch_view">Отображать: [ Списком / <a href={view_as_plain_url} className="underline">Деревом</a> ]</div>;
                }

                return(
                    <div className="List">
                    <div className="MainList">
                        {switch_view}
                        <Search />
                        <div className="btn_add"><ButtonAdd clicked={this.addItem} /></div>
                        <ul>{items}</ul>
                    </div>
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
                    <li className="item" key={'item'+this.props.model.get('id')}>
                        <div className="item_name" clicked={this.whenClicked}>{this.props.model.get('name')}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'edit' +this.props.model.get('id')} mini="false" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'delete'+this.props.model.get('id')} mini="false" />
                        </div>
                    {error_box}
                    {edit_form}
                    </li>
                );
            }
        });
        return MainList;
    }
);
