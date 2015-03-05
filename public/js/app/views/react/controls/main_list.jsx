define(
    'views/react/controls/main_list',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/search',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/base/info_msg',
        'jsx!views/react/search',
        'jsx!views/react/controls/paginator/paginator',

        //'models/rank',
        'event_bus'
    ],function($, React, Config, InstantSearch, ButtonAdd, ButtonEdit, ButtonDelete, ErrorMsg, InfoMsg, Search, Paginator, EventBus){
        var debug = (Config['debug'] && Config['debug']['debug_main_list'])? 1:null;
        console.log('module views/react/controls/main_list loaded');

        var MainList = React.createClass({
            componentWillMount: function(){
                (debug)?console.log('MainList WillMount'):null;
            },
            componentDidMount: function(){
                //window.addEventListener('fetch', this.collectionFetch());
                window.addEventListener('my_fetch', this.collectionFetch);
                //EventBus.on('fetch', this.collectionFetch());
            },
            collectionFetch: function(){
                alert('catch!');
                console.warn('catch! event');
                this.props.collection.fetch();
            },
            getPaginator: function(){
                var pagination_request = this.props.pagination;
                if(this.props.pagination){
                    return <Paginator pagination={pagination_request} callback={this.collectionRePaginate} />;
                }
                return null;
            },
            componentWillUnmount: function(){
                $('#main_top').html('');
            },
            collectionRePaginate: function(event){
                console.info(['collectionPaginate', event]);
            },
            //2-do:
            // * search
            // * filter
            addItem: function(){
                console.info(['this.props.collection', this.props.collection]);
                //var new_model = this.props.collection.model.prototype.clone();
                var collection = this.props.collection.add({});
                var new_model = collection.last();
                //var new_model = this.props.collection.create(null);
                //new_model.collection = this.props.collection;
                console.info(['new_model', new_model]);
                var model = this.props.collection.add();
                console.info(['model', model]);
                EventBus.trigger('item-add', new_model);

            },
            render: function(){
                console.info('MainList->render');
                var collection = this.props.collection;
                if(collection.collection_rus_name){
                    $('#main_top').html('<h2>Каталог &laquo;'+collection.collection_rus_name+'&raquo;</h2>');
                }else{
                    $('#main_top').html('<h2>Название каталога не задано.</h2>');
                }

                var items = collection.map(function(model){
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
                        {this.getPaginator()}
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
                (debug)?console.log('whenClickedCP, action -'+action):null;
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
