/** @jsx React.DOM */

define(
    'views/react/menu/list_layers',
    [
        'jquery',
        'react',
        'event_bus',
        'jsx!views/react/menu/item_link_default',
        'jsx!views/react/menu/item_no_link'
    ],function($, React, EventBus, ItemLink, ItemNoLink){

        var CategoryLayerList = React.createClass({
            getInitialState: function(){
                return {
                    visible: true
                }
            },
            componentWillMount: function() {
                if(this.props.model.get('items')!=null){
                    //this.setState({visible: false});
                }
            },
            whenClicked: function(link){
                link.preventDefault();
                var customEvent = new CustomEvent("catLinkClick",  {
                    detail: {screen_name: link.screen},
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            render: function(){
                var model = this.props.model;
                var src = './react/get/screen/'+model.get('name');

                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }

                var icon = '';
                if(model.get('icon')){
                    icon= <i className={model.get('icon')}></i>;
                }

                if(model.get('items')!=null){
                    className = "glyphicon togglable";
                    var listHead= "childs";
                    if (this.state.visible) {
                        className += " glyphicon-chevron-up";
                        listHead += " childs_open";
                    } else {
                        className += " glyphicon-chevron-down";
                        //listHead += " close";
                    }
                    if(model.get('is_not_screen')!=null){

                        var simple_links = [];

                        var items = model.get('items');
                        var simple_links = items.map(function(model) {
                            return <li><ItemLinkLayer model={model} onClick={this.whenClicked}/></li>;
                        });

                        return(
                            <li>
                                <ItemNoLink callback={this.toggle} model={model} visible={this.state.visible} />
                                <div style={style}>
                                    <ul className="simple_layer_menu_list">
                                        {simple_links}
                                    </ul>
                                </div>
                            </li>
                            );
                    }
                    return(
                        <li>
                            <ItemNoLink model={model} callback={this.toggle} />
                            <div style={style}>
                                <MenuTree source={null} childs={model.get('items')}/>
                            </div>
                        </li>
                        );
                }

                //only if empty and type
                return(
                    <li style={style}><ItemLink model={model} onClick={this.whenClicked}/><span className="unread">2</span></li>
                    );
            },
            toggle: function() {
                this.setState({visible: !this.state.visible});
            }
        });


        return CategoryLayerList;
    }
);


