define(
    'views/react/controls/tree/tree_main',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'config',
        'jsx!views/react/controls/tree/tree_mixin',
        'jsx!views/react/controls/tree/tree_node_box',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete'

    ],function($, _, Backbone, React, EventBus, Config,
               TreeClassMixin, TreeNodeBox,
               ButtonAdd, ButtonEdit, ButtonDelete
        ){

        console.log('views/react/controls/tree/tree_node.jsx loaded...');
        var debug = (Config['debug'] && Config['debug']['debug_tree'])? 1:null;

        var TreeNode = React.createClass({
            mixins: [TreeClassMixin],
            getInitialState: function () {
                return {
                    visible: true,
                    open: false,
                    dependency_items: []
                };
            },
            closeState: function(e){
                if(this.props.model.get('id')!=e.detail.id){
                    this.setState({open: false});
                }
            },
            componentWillMount: function(){
                (debug)?console.log(['Node WillMount -> this.props.model:', this.props.model]):null;
                var childs = this.props.model.get('items');
                if(childs.length>0){
                    this.setState({visible: false});
                }
                window.addEventListener("closeWhoOpenEvent", this.closeState, true);
                (debug)?console.log('Node WillMount -> add event =closeWhoOpenEvent='):null;
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
                (debug)?console.log(['nodeControlClicked > dispatch event:', customEvent]):null;
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
                (debug)?console.info('===getNodeTreeDependency==='):null;
            },
            isVisible: function(){
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }
                return style;
            },
            render: function () {
                var self = this;
                (debug)?console.log(['Node Render -> this.props.model', this.props.model]):null;
                var open_button, children_box = null
                if(this.haveChildren()){
                    open_button = this.openButton();
                    children_box = this.childrenBox();
                }
                return(
                    <li>
                        <div className="tree_box_node"
                        draggable="true"
                        onDragEnd={this.dragEnd}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        onDragLeave={this.dragLeave}
                        onDrop={this.drop}
                        id={this.props.model.get('id')}>
                            {open_button}
                            <TreeNodeBox model={this.props.model} />
                            {this.leavesBox()}
                        </div>
                        <div className="tree_box_node_controls">
                            <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                            <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                            <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                        </div>
                        {children_box}
                    </li>
                );
            },
            leavesBox: function(){

            },
            haveChildren: function(){
                if(this.props.model.get('items') != null && this.props.model.get('items').length > 0){
                    return true;
                }
                return false;
            },
            openButton: function(){
                var className = "glyphicon togglable";
                if (this.state.visible) {
                    className += " glyphicon-minus";
                } else {
                    className += " glyphicon-plus";
                }
                return(
                    <span onClick={this.toggle} className={className}></span>
                );
            },
            childrenBox: function(){
                var self = this;
                var child_box = this.props.model.get('items').map(function(child){
                    return <TreeNode model={child} move={self.props.move} />;
                });
                return(
                    <div className="tree_childs" style={this.isVisible()}>
                        <ul>
                           {child_box}
                        </ul>
                    </div>
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
