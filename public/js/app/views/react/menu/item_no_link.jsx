/** @jsx React.DOM */

define(
    'views/react/menu/item_no_link',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var NoLink = React. createClass({
            callback: function (event) {
                event.preventDefault();
                this.props.callback(true);
            },
            render: function(){
                var href= "#client/"+this.props.model.get('entity');
                return(
                    <div className={this.headerClass()} onClick={this.callback}>
                        {this.currentIcon()}
                        <span>{this.currentName()}</span>
                        <span className={this.currentClassName()}></span>
                    </div>
                );
            },
            currentIcon: function () {
                if (this.props.model.get('icon')) {
                    return (<i className={this.props.model.get('icon')}></i>);
                }
            },
            currentClassName: function () {
                var className = '';
                if (this.props.model.get('items') != null) {
                    className = 'glyphicon togglable';
                    if (this.props.visible) {
                        className += " glyphicon-chevron-up";
                    } else {
                        className += " glyphicon-chevron-down";
                    }
                }
                return className;
            },
            headerClass: function () {
                var listHead = "childs";
                if (this.props.visible) {
                    listHead += " childs_open";
                }
                if (this.props.model.get('entity')) {
                    listHead += ' '+this.props.model.get('entity');
                }
                return listHead;
            },
            currentName: function(){
                return this.props.model.get('name');
            }
        });

        return NoLink;
    }
);


