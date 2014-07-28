/** @jsx React.DOM */

var ControlsMixin = function () {

    return{
        discardChanges: function(){
            this.setState({value: this.props.value});
        },

    }
}()