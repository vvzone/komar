/** @jsx React.DOM */

define(
    'views/react/menu/list_links',
    [
        'jquery',
        'react',
        'event_bus',
        'jsx!views/react/menu/item_link_default',
        'jsx!views/react/menu/item_no_link'
    ],function($, React, EventBus, ItemLink, ItemNoLink){

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
            layerLinkClicked: function(event){
                console.info('layerLinkClicked'); //Remove THIS!
            },
            linkClicked: function(link){
                link.preventDefault();
                var customEvent = new CustomEvent("catLinkClick",  {
                    detail: {screen_name: link.screen},
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            render: function(){
                var model = this.props.model;

                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }
                if(model.get('items')!=null){
                    if(model.get('is_not_screen')!=null){
                        var simple_links = [];

                        var items = model.get('items');
                        var simple_links = items.map(function(model) {
                            return (
                                <li>
                                    <div><ItemLink model={model} onClick={this.linkClicked}/></div>
                                </li>
                            );
                        });

                        return(
                            <li>
                                <ItemNoLink model={model} callback={this.toggle} visible={this.state.visible} />
                                <div style={style}>
                                    <ul className="simple_menu_list">
                                        {simple_links}
                                    </ul>
                                </div>
                            </li>
                        );
                    }
                    //have child but also link
                    /*
                    return(
                        <li>
                            <ItemLink model={model} callback={this.toggle} />
                            <div style={style}>
                                <ListLinks source={null} childs={model.get('items')}/>
                            </div>
                        </li>
                        );
                    */
                    //
                }

                //no child
                return(
                    <li style={style}>
                        <div>
                            <ItemLink model={model} onClick={this.linkClicked}/>
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


