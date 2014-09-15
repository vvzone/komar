/** @jsx React.DOM */

define(
    'views/react/cat_tree_links_list',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/item_link'
    ],function($, React, ErrorMsg, ItemLink){

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

        var CatTreeLinksList = React. createClass({
            getInitialState: function() {
                return {
                    links: [], //array!!
                    screens: '',
                    entities: ''
                };
            },
            componentDidMount: function() {
                console.log('views/react/cat_tree_links_list loaded');
                if(this.props.childs!=null){
                    //array
                    console.log('childrens');
                    var links = [];
                    var links = this.props.childs;
                    this.setState({links: links})
                }else{
                    this.setState({
                        links: this.props.collection.models
                    });
                }
            },
            handleClick: function(){
                console.log('handle click');
            },
            render: function(){
                var links_output = [];
                var links = this.state.links;

                //if(Object.prototype.toString.call(this.state.links) == '[object Array]'){
                    console.info(Object.prototype.toString.call(this.state.links));
                    var self = this;
                    links_output = this.state.links.map(function(l){
                        console.log('l');
                        console.log(l);
                        if(l.is_not_screen==true && l.childNodes==null){
                            console.log('cat_tree > render > not_link');
                            return(<li><div className="tree_not_link">{l.rus_name}</div></li>);
                        }
                        if(l.attributes.is_non_independent!=true){
                            console.log('cat_tree > render > link');
                            return(<CatLink screen={l} key={l.id} onClick={self.handleClick}/>)
                        }
                    });
                    return(
                        <ul className="nav nav-sidebar cattree">{links_output}</ul>
                        );
                //}
                /*
                return(
                    <ErrorMsg msg="Неправильный формат ответа сервера" />
                    )
                    */
            }
        });

        return CatTreeLinksList;
    }
);
