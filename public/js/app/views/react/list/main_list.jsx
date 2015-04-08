define(
    'views/react/list/main_list',
    [
        'jquery',
        'react',
        'config',

        'jsx!views/react/search',
        'jsx!views/react/search',
        'jsx!views/react/controls/paginator/paginator',

        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/info_msg',
        'jsx!views/react/list/list_item',
        'event_bus'
    ],function($, React, Config,
               InstantSearch, Search, Paginator,
               ButtonAdd,InfoMsg, ListItem, EventBus){
        var debug = (Config['debug'] && Config['debug']['debug_main_list'])? 1:null;
        console.log('module views/react/controls/main_list loaded');

        var MainList = React.createClass({
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
            collectionUpdate: function(data){
                console.log(['collectionUpdate', data.requested_data]);
                this.props.collection.reset(data.requested_data);
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
                        <Search source={collection.url()} searchReceived={this.collectionUpdate} />
                        <div className="btn_add"><ButtonAdd clicked={this.addItem} /></div>
                        <ul>{items}</ul>
                        {this.getPaginator()}
                    </div>
                    </div>
                    );
            }
        });

        return MainList;
    }
);
