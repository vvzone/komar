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
                    model: []
                };
            },
            componentWillMount: function() {
                console.log('CatLink mount');
                if(this.props.model.get('childNodes')!=null){
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
                var model = this.props.model;
                var src = './react/get/screen/'+model.get('name');

                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }

                if(model.get('childNodes')!=null){
                    className = "glyphicon togglable";
                    if (this.state.visible) {
                        className += " glyphicon-minus";
                    } else {
                        className += " glyphicon-plus";
                    }
                    if(model.get('is_not_screen')!=null){
                        return(
                            <li>
                                <span onClick={this.toggle} className={className}></span>
                                <div className="childs" onClick={this.toggle}>{model.get('name')}</div>
                                <div style={style}><CatTreeLinksList source={null} childs={model.get('childNodes')}/></div>
                            </li>
                            );
                    }
                    return(
                        <li><span onClick={this.toggle} className={className}></span>
                            <a className="childs" href={src}>{model.get('name')}</a>
                            <div style={style}>
                                <CatTreeLinksList source={null} childs={model.get('childNodes')}/>
                            </div>
                        </li>
                        );
                }

                return(
                    <li style={style}><ItemLink item={model} onClick={this.whenClicked}/></li>
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
                    links_output = this.state.links.map(function(link_model){
                        console.log('link_model');
                        console.log(link_model);
                        if(link_model.get('is_not_screen')==true && link_model.get('childNodes')==null){
                            console.log('cat_tree > render > not_link');
                            return(<li><div className="tree_not_link">{link_model.get('rus_name')}</div></li>);
                        }
                        if(link_model.get('is_non_independent')!=true){
                            console.log('cat_tree > render > link');
                            return(<CatLink model={link_model} key={link_model.get('id')} onClick={self.handleClick}/>)
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
