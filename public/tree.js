/** @jsx React.DOM */


var TreeNode = React.createClass({
    getInitialState: function () {
        return {
            visible: true,
            items: []
        };
    },
    componentDidMount: function(){
        if(this.props.node.childNodes!=null){
            this.setState({visible: false});
        }
    },
    render: function () {
        console.log('this.props.node');
        console.log(this.props.node);
        var childNodes = [];
        var className = "tree_node ";

        var style = {};
        if (!this.state.visible) {
            style.display = "none";
        }

        if (this.props.node.childNodes != null) {
            childNodes = this.props.node.childNodes.map(function (node) {
                return(<li><TreeNode node={node} /></li>);
            });

            var childsList = [];
            childsList.push(<ul className="nav nav-sidebar cattree" style={style}>{childNodes}</ul>);

            className = "tree_node glyphicon togglable";
            if (this.state.visible) {
                className += " glyphicon-minus";
            } else {
                className += " glyphicon-plus";
            }
        }


        return (
            <div className={className}>
                <div onClick={this.toggle}>
                {this.props.node.name}
                </div>
                {childsList}
            </div>
            );
    },
    toggle: function () {
        this.setState({visible: !this.state.visible});
    }
});



var MainTree = React.createClass({
    getInitialState: function() {
        return {
            items: [] //array!!
        };
    },
    componentDidMount: function() {
        $.get('http://zend_test/main/index/dockinds', function (result) {
                var items = [];
                items = result.data;
                this.setState({items: items});
            }.bind(this));
    },
    render: function(){
        var tree = [];
        //tree = this.state.items;
        var tree_output = [];
        for(var key in this.state.items){
            tree_output.push(<TreeNode node={this.state.items[key]} />);
        }

        return(<ul className="nav nav-sidebar cattree">{tree_output}</ul>);
    }
});