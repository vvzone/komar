/** @jsx React.DOM */

define(
    'views/react/cat_link',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/item_link',
        'jsx!views/react/cat_tree_links_list'
    ],function($, React, ErrorMsg, ItemLink, CatTreeLinksList){

        var CatLink = React. createClass({
            getInitialState: function() {
                return {
                    visible: true,
                    click: undefined,
                    screen: []
                };
            },
            componentWillMount: function() {
                console.log('CatLink mount');
                if(this.props.screen.childNodes!=null){
                    this.setState({visible: false});
                }
            },
            whenClicked: function(link){
                var customEvent = new CustomEvent("catLinkClick",  {
                    detail: {screen_name: link.screen},
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            render: function(){
                var link = this.props.screen;
                var src = './react/get/screen/'+link.screen;

                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }

                if(link.childNodes!=null){
                    className = "glyphicon togglable";
                    if (this.state.visible) {
                        className += " glyphicon-minus";
                    } else {
                        className += " glyphicon-plus";
                    }

                    if(link.is_not_screen!=null){
                        return(
                            <li>
                                <span onClick={this.toggle} className={className}></span>
                                <div className="childs" onClick={this.toggle}>{link.name}</div>
                                <div style={style}><CatTreeLinksList source={null} childs={link.childNodes}/></div>
                            </li>
                            );
                    }
                    return(
                        <li><span onClick={this.toggle} className={className}></span>
                            <a className="childs" href={src}>{link.name}</a>
                            <div style={style}>
                                <CatTreeLinksList source={null} childs={link.childNodes}/>
                            </div>
                        </li>
                        );
                }

                return(
                    <li style={style}><ItemLink item={link} onClick={this.whenClicked}/></li>
                    );

            },
            toggle: function() {
                this.setState({visible: !this.state.visible});
            }
        });

        return CatLink;
    }
);
