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
            render: function(){
                var href= "#admin/"+this.props.model.get('entity');

                var model = this.props.model;

                var icon = '';
                if(model.get('icon')){
                    icon= <i className={model.get('icon')}></i>;
                }

                var counter = '';
                console.info(model.get('messages'));
                if(model.get('messages')){
                    var messages = this.props.model.get('messages');
                   counter = <span className="unread">{messages.new}</span>;
                }

                return(
                    <li>
                        <div className="childs">
                            {icon}
                            <span className="link"><a draggable="false" href={href} onClick={this.handleClick}>{this.props.model.get('name')}</a></span>
                            {counter}
                        </div>
                    </li>
                )
            }
        });

        return MenuMsgTypeLink;
    }
);



