/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree_node',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/controls/tree_mixin',
        'jsx!views/react/controls/tree_node_box',
        'jsx!views/react/controls/tree_main',

        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete'


        /*
        * <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
          <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
          <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
        *
        * */
    ],function($, _, Backbone, React,
               TreeClassMixin, TreeNodeBox, MainTree,
               ButtonAdd, ButtonEdit, ButtonDelete
        ){

        var TreeNode = React.createClass({
            mixins: [TreeClassMixin],
            getInitialState: function () {
                return {
                    visible: true,
                    model: this.props.model,
                    open: false,
                    dependency_items: []
                };
            },
            closeState: function(e){
                if(this.props.model.get('id')!=e.detail.id){
                    this.setState({open: false});
                }
            },
            componentDidMount: function(){
                if(this.props.node.childNodes!=null){
                    this.setState({visible: false});
                }
                window.addEventListener("closeWhoOpenEvent", this.closeState, true);
            },
            componentWillUnmount: function () {
                window.removeEventListener("closeWhoOpenEvent", this.closeState, true);
            },
            nodeControlClicked: function(action){
                var customEvent = new CustomEvent("modalWindowOpen",  {
                    detail: {
                        action: action,
                        entity: 'doc_type_groups_edit', //FIX!!!
                        model: this.props.model,
                        current_id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                console.log('nodeControlClicked > dispatch event:');
                console.log(customEvent);
                this.getDOMNode().dispatchEvent(customEvent);
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
                var closeWhoOpenEvent = new CustomEvent("closeWhoOpenEvent",  {
                    detail: {
                        id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            },
            getNodeTreeDependency: function(){
                console.info('===getNodeTreeDependency===');
                console.log('podpindosnost!');
                /*
                if(typeof this.props.tree_dependency.id_name_in_dependency != 'undefined' ){
                    var url = 'http://zend_test/main/'
                        + this.props.tree_dependency.source
                        + '/search/'
                        + this.props.tree_dependency.id_name_in_dependency
                        + '/'
                        + this.props.node.id;
                    var data = '';
                    console.info('url: '+url);

                    $.get(url, function (result) {
                        var dependency_items = [];
                        dependency_items = result.data;
                        data = result.data;
                    }.bind(this));
                    return data;
                }*/
            },
            render: function () {
                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }


                var dependency_box = [];
                console.info('this.props.tree_dependency');
                console.info(this.props.tree_dependency);

                /*
                if(typeof this.props.tree_dependency != 'undefined'){
                    //if(this.props.had_dependeny_items){
                    className = 'glyphicon';
                    if (this.state.open == true) {
                        className += " glyphicon-chevron-left";
                    } else {
                        className += " glyphicon-chevron-right";
                    }
                    dependency_box[0] = <div className="dependency_open_link"><span className={className} onClick={this.whenClicked}></span></div>;


                    if(this.state.open == true){
                        dependency_box[1] =
                            <div className="tree_dependency_box">
                                <div className="dependencies_list">
                                    <EntityBlock
                                    entity_name = {this.props.tree_dependency.entity_name}
                                    db_prop_name={this.props.tree_dependency.id_name_in_dependency}
                                    host={this.props.node} />
                                </div>
                            </div>;
                    }
                }
                */

                if(!MainTree){
                    var MainTree =require(['jsx!views/react/controls/tree_main'], function(MainTree){
                        console.log('loaded...');
                        return MainTree;
                    });
                }
                console.log();

                if (this.props.model.get('items')!= null) {
                    if(this.props.model.get('items').length>0){
                        className = "glyphicon togglable";
                        if (this.state.visible) {
                            className += " glyphicon-minus";
                        } else {
                            className += " glyphicon-plus";
                        }
                        var node_key = 'tree_box_node'+this.props.model.get('id');
                        var tree_dependency ='';
                        return(
                            <li>
                                <div className="tree_box_node"
                                draggable="true"
                                onDrop={this.drop}
                                onDragEnd={this.dragEnd}
                                onDragStart={this.dragStart}
                                onDragOver={this.dragOver}
                                onDragLeave={this.dragLeave}
                                key={node_key}
                                id={this.props.model.get('id')} >
                                    <span onClick={this.toggle} className={className}></span>
                                    <TreeNodeBox item={this.props.model}/>
                        {dependency_box}
                                </div>
                                <div className="tree_box_node_controls">
                                    <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                                </div>
                                <div className="tree_childs" style={style}>
                                    <MainTree source={null} childs={this.props.model.get('items')} tree_dependency={this.props.model.get('attr_dependency')}/>
                                </div>
                            </li>
                            );
                    }
                }
                return(
                    <li style={style}>
                        <div className="tree_box_node"
                        draggable="true"
                        onDragEnd={this.dragEnd}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        onDragLeave={this.dragLeave}
                        onDrop={this.drop}
                        id={this.props.model.get('id')}>
                            <TreeNodeBox model={this.props.model} tree_dependency={tree_dependency}/>
                        {dependency_box}
                        </div>
                        <div className="tree_box_node_controls">
                            <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                            <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                            <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                        </div>
                    </li>
                    );
            },
            toggle: function () {
                this.setState({visible: !this.state.visible});
                var closeWhoOpenEvent = new CustomEvent("closeWhoOpenEvent",  {
                    detail: {
                        id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            }
        });
        return TreeNode;
    }
);



