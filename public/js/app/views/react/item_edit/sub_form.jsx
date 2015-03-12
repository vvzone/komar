/** @jsx React.DOM */

define(
    'views/react/item_edit/sub_form',
    [
        'jquery',
        'bootstrap',
        'react',
        'config',
        'event_bus',
        'jsx!views/react/item_edit/generate_form'
    ],function($, Bootstrap, React, Config, EventBus, Form){

        var SubForm = React.createClass({
            getInitialState: function(){
                return {
                    model: null
                }
            },
            callBack: function(){
                console.log('subForm callback!');
            },
            render: function(){
                var self = this;
                require(['models/'+this.props.model_name], function(Model){
                    var model = new Model(self.props.model_values);
                    console.info(['populated model:', model]);
                    //<SubForm model={model} />

                    self.setState({
                        model: model
                    });
                    /*
                    return (
                        <div className="sub_form">
                            <div>SubForm</div>

                        </div>
                        );
                    */
                });

                return(
                    <div className="sub_form">
                        <div>SubForm</div>
                        <Form model={this.state.model} interface={false} callback={this.callBack} />
                    </div>
                );
            }
        });

        return SubForm;
    }
);