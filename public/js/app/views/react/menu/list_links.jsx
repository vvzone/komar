/** @jsx React.DOM */

define(
    'views/react/menu/list_links',
    [
        'jquery',
        'react',
        'event_bus',
        'jsx!views/react/menu/item_link_default'
    ],function($, React, EventBus, ItemLink){

        var LinkList = React. createClass({
            getInitialState: function() {
                return {
                    visible: true,
                    click: undefined,
                    model: []
                };
            },
            componentWillMount: function() {
                if(this.props.model.get('items')!=null){
                    this.setState({visible: false});
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
                    }
                    if(model.get('is_not_screen')!=null){
                        var simple_links = [];

                        var items = model.get('items');
                        var simple_links = items.map(function(model) {
                            return (
                                <li>
                                    <div><ItemLink model={model} onClick={this.whenClicked}/></div>
                                </li>
                            );
                        });
//
                        return(
                            <li>
                                <ItemNoLink model={model} callback={this.toggle} />
                                <div style={style}>
                                    <ul className="simple_menu_list">
                                        {simple_links}
                                    </ul>
                                </div>
                            </li>
                        );
                    }
                    //have child but also link
                    return(
                        <li>
                            <ItemLink model={model} callback={this.toggle} />
                            <div style={style}>
                                <ListLinks source={null} childs={model.get('items')}/>
                            </div>
                        </li>
                    );
                }

                //no child
                return(
                    <li style={style}>
                        <div>
                            <ItemLink model={model} onClick={this.whenClicked}/>
                            <span className="unread">2</span>
                        </div>
                    </li>
                );

            },
            toggle: function() {
                this.setState({visible: !this.state.visible});
            }
        });

        return LinkList;
    }
);


