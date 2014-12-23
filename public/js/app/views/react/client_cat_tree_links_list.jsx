/** @jsx React.DOM */

define(
    'views/react/client_cat_tree_links_list',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/client_item_link'
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
                if(this.props.model.get('items')!=null){
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
                if(model.get('items')!=null){
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
                                <div style={style}><CatTreeLinksList source={null} childs={model.get('items')}/></div>
                            </li>
                            );
                    }
                    return(
                        <li><span onClick={this.toggle} className={className}></span>
                            <a className="childs" href={src}>{model.get('name')}</a>
                            <div style={style}>
                                <CatTreeLinksList source={null} childs={model.get('items')}/>
                            </div>
                        </li>
                        );
                }

                return(
                    <li style={style}><ItemLink model={model} onClick={this.whenClicked}/></li>
                    );

            },
            toggle: function() {
                this.setState({visible: !this.state.visible});
            }
        });

        var CatTreeLinksList = React. createClass({
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
            handleClick: function(){
                console.log('handle click');
            },
            render: function(){
                var links_output = [];
                var collection = this.state.collection;
                var self = this;
                links_output = collection.map(function(model) {
                    if (model.get('is_not_screen') == true && model.get('items') == null) {
                        return(<li>
                            <div className="tree_not_link">{model.get('name')}</div>
                        </li>);
                    }
                    if (model.get('isNonIndependent') != true) {
                        return(<CatLink model={model} key={model.get('id')} onClick={self.handleClick}/>)
                    }
                });
                return(
                    <ul className="nav nav-sidebar cattree">{links_output}</ul>
                );
            }
        });

        return CatTreeLinksList;
    }
);
