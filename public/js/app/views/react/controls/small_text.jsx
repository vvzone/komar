/** @jsx React.DOM */

define(
    'views/react/controls/small_text',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin'
    ],function($, React, ControlsMixin){

        var ControlSmallText = React.createClass({
            mixins: [ControlsMixin],
            getInitialState: function() {
                return {
                    value: '',
                    discard: undefined
                };
            },
            render: function(){
                var id = 'small_control_'+this.props.russian_name;
                return(<div className="form-group">
                    <label htmlFor={id}>{this.props.russian_name}</label>
                    <textarea className="form-control" id={id} name={this.props.name} value={this.state.value} onChange={this.handleChange} />
                </div>)
            }
        });

        return ControlSmallText;
    }
);