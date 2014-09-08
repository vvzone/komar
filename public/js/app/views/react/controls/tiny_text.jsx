/** @jsx React.DOM */

define(
    'views/react/controls/tiny_text',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin'
    ],function($, React, ControlsMixin){
        
        var ControlTinyText = React.createClass({
            mixins: [ControlsMixin],
            getInitialState: function() {
                return {
                    value: this.props.value,
                    discard: this.props.discard
                };
            },
            render: function(){
                var id = 'tiny_control_'+this.props.russian_name;
                return(<div className="form-group">
                    <label htmlFor={id}>{this.props.russian_name}</label>
                    <input type="text" className="form-control" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
                </div>)
            }
        });

        return ControlTinyText;
    }
);