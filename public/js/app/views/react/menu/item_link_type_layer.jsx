/** @jsx React.DOM */

define(
    'views/react/menu/item_link_type_layer',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var LayerItemLink = React. createClass({
            getInitialState: function(){
              return {
                  visible: true
              }
            },
            handleClick: function(e){
                /*e.preventDefault();*/
                EventBus.trigger(this.props.model.get('entity'));
                //this.props.onClick(this.props.model);
            },
            render: function(){
                var href= "#admin/"+this.props.model.get('entity');

                var className = 'glyphicon';
                if(this.state.visible == false){
                    className += ' glyphicon-remove';
                }
                else{
                    className += ' glyphicon-eye-open';
                }

                return(
                    <div>
                        <i className={icon}></i>
                        <span><a className="childs" href={src}>{model.get('name')}</a></span>
                        <span onClick={this.toggle} className={className}></span>
                    </div>
                )
            },
            toggle: function(){
                this.setState({visible:!this.state.visible});
            }
        });

        return LayerItemLink;
    }
);


