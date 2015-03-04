/** @jsx React.DOM */

define(
    'views/react/controls/tiny_text',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'config'
    ],function($, React, ControlsMixin, Config){

        var debug = (Config['debug'] && Config['debug']['debug_controls']['tiny_text'] )? 1:null;
        var ControlTinyText = React.createClass({
            mixins: [ControlsMixin],
            getInitialState: function() {
                return {
                    value: this.props.value,
                    discard: this.props.discard
                };
            },
            render: function(){
                (debug)?console.info(['TinyText render, this.props', this.props]):null;
                var error = [];
                if(this.props.error){
                    error = <span className="help-block warn">{this.props.error}</span>
                }
                var id = this.props.name; //'tiny_control_'+this.props.russian_name;
                return(<div className="form-group">
                    <label htmlFor={id}>{this.props.russian_name}</label>
                    <input type="text" className="form-control" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
                    {error}
                </div>)
            }
        });

        return ControlTinyText;
    }
);