/** @jsx React.DOM */

define(
    'views/react/cat_tree_links_list',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/item_link'
    ],function($, React, Config, ErrorMsg, ItemLink){
        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;

        console.log('views/react/cat_tree_links_list.jsx loaded....');

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
                (debug)?console.log('views/react/cat_tree_links_list loaded'):null;
                if(this.props.childs!=null){
                    (debug)?console.log('CatTreeLinksList -> render childrens'):null;
                    var collection = this.props.childs;
                    this.setState({collection: collection})
                }else{
                    this.setState({
                        collection: this.props.collection
                    });
                }
            },
            handleClick: function(){
                (debug)?console.log('handle click'):null;
            },
            render: function(){
                var links_output = [];
                var collection = this.state.collection;

                //if(Object.prototype.toString.call(this.state.links) == '[object Array]'){
                    //console.info(Object.prototype.toString.call(this.state.collection));
                    var self = this;
                    links_output = collection.map(function(model){
                        (debug)?console.log(['link_model', model]):null;
                        if(model.get('is_not_screen')==true && model.get('items')==null){
                            (debug)?console.log('cat_tree > render > not_link (is_not_screen==true & items==null)'):null;
                            (debug)?console.log("model.get('name')="+model.get('name')):null;
                            return(<li><div className="tree_not_link">{model.get('name')}</div></li>);
                        }
                        //if(model.get('is_non_independent')!=true){
                        if(model.get('isNonIndependent')!=true){
                            (debug)?console.log('cat_tree > render > link (is_non_independent!=true)'):null;
                            (debug)?console.log("model.get('name')="+model.get('name')):null;
                            return(<CatLink model={model} key={model.get('id')} onClick={self.handleClick}/>)
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
