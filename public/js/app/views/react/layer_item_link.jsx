/** @jsx React.DOM */

define(
    'views/react/layer_item_link',
    [
        'jquery',
        'react',
        'event_bus'
    ],function($, React, EventBus){
        var LayerItemLink = React. createClass({
            /*
             * props: name, clicked(), id
             *
             * */

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
                    //className += ' glyphicon-eye-close';
                    className += ' glyphicon-remove';
                }
                else{
                    className += ' glyphicon-eye-open';
                }

                return(
                    <div>
                        <span className={className} onClick={this.toggle}></span>
                        <a draggable="false" href={href} onClick={this.handleClick}>{this.props.model.get('name')}</a>
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


