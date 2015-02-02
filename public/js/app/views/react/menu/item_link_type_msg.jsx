/** @jsx React.DOM */

define(
    'views/react/menu/item_link_type_msg',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var MenuMsgTypeLink = React. createClass({
            handleClick: function(e){
                EventBus.trigger(this.props.model.get('entity'));
            },
            currentIcon: function(){
                var icon = '';
                if(this.props.model.get('icon')){
                    icon= <i className={this.props.model.get('icon')}></i>;
                    return icon;
                }
            },
            counter: function(){
                var counter = [];
                if(this.props.model.get('messages')){
                    var messages = this.props.model.get('messages');
                    counter.push(<span className="unread">{messages.new}</span>);
                    return counter;
                }
            },
            render: function(){
                var href= "#client/"+this.props.model.get('entity');
                return(
                    <li>
                        <div className="childs">
                            {this.currentIcon()}
                            <span className="link"><a draggable="false" href={href} onClick={this.handleClick}>{this.props.model.get('name')}</a></span>
                            {this.counter()}
                        </div>
                    </li>
                )
            }
        });

        return MenuMsgTypeLink;
    }
);



