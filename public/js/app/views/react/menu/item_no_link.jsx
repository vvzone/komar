/** @jsx React.DOM */

define(
    'views/react/menu/item_no_link',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var NoLink = React. createClass({
            callback: function(){
                this.props.callback(true);
            },
            render: function(){
                var model = this.props.model;

                var icon = '';
                if(model.get('icon')){
                    icon= <i className={model.get('icon')}></i>;
                }

                var listHead= '';
                var className = '';

                var href= "#client/"+this.props.model.get('entity');
                return(
                    <div className={listHead} onClick={this.callback}>
                        {icon}
                        <span>{model.get('name')}</span>
                        <span className={className} onClick={this.callback}></span>
                    </div>
                );
            }
        });

        return NoLink;
    }
);


