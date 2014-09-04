/** @jsx React.DOM */

define(
    'views/react/controls/controls_mixin',
    [
        'react'
    ],function(React){
        var ControlsMixin = function () {
            return{
                discardChanges: function(){
                    this.setState({value: this.props.value});
                },
                componentWillMount: function() {
                    this.setState({value: this.props.value});
                    this.setState({discard: this.props.discard});
                },
                handleChange: function(event){
                    this.setState({value: event.target.value});
                    var property = {};
                    property[this.props.name] = event.target.value;
                    this.props.callback(property);
                }
            }
        }()

        return ControlsMixin;
    }
);