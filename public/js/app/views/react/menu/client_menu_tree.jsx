/** @jsx React.DOM */

define(
    'views/react/menu/client_menu_tree',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/menu/item_link_default',
        'jsx!views/react/menu/item_link_type_layer',
        'jsx!views/react/menu/item_link_type_msg',
        'jsx!views/react/menu/item_no_link',
        'jsx!views/react/menu/list_links',
        'jsx!views/react/menu/list_layers'
    ],function($, React, ErrorMsg, ItemLink, ItemLinkLayer, ItemLinkMsg, ItemNoLink, ListLinks, ListLayers){

        var MenuTree = React. createClass({
            getInitialState: function() {
                return {
                    collection: [], //array!!
                    screens: '',
                    entities: ''
                };
            },
            componentDidMount: function() {
                if(this.props.childs!=null){
                    var collection = this.props.childs;
                    this.setState({collection: collection})
                }else{
                    this.setState({
                        collection: this.props.collection
                    });
                }
            },
            handleClick: function(event){
                event.preventDefault();
            },
            render: function(){
                var links_output = [];
                var collection = this.state.collection;
                var self = this;
                links_output = collection.map(function(model) {
                    if(model.get('type')){
                        if(model.get('type') == 'layers'){
                            return(<ListLinks model={model} key={model.get('id')} onClick={self.handleClick}/>);
                            //return (<ListLayers model={model} key={model.get('id')} onClick={self.handleClick} />);
                        }
                        if(model.get('type') == 'msg_box'){
                            return (<ItemLinkMsg  model={model} key={model.get('id')} onClick={self.handleClick}/>);
                        }
                    }else{
                        if (model.get('is_not_screen') == true && model.get('items') == null) {
                            return(<li>
                                <div className="tree_not_link">{model.get('name')}</div>
                            </li>);
                        }
                        if (model.get('isNonIndependent') != true) {
                            return(<ListLinks model={model} key={model.get('id')} onClick={self.handleClick}/>)
                        }
                    }
                });
                //nav nav-sidebar
                return(
                    <ul className="client_menu">{links_output}</ul>
                );
            }
        });

        return MenuTree;
    }
);
