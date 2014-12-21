/** @jsx React.DOM */

define(
    'views/react/controls/bool_select',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin'
    ],function($, React, ControlsMixin){

        var ControlBoolSelect = React.createClass({
            mixins: [ControlsMixin],
            getInitialState: function() {
                return {
                    value: false,
                    discard: undefined
                };
            },
            render: function(){
                var id = 'bool_select_'+this.props.name;
                var selected = this.state.value;
                if(selected == null){
                    selected = false;
                }
                console.info('bool_select , selected='+selected);
                return(
                    <div className="form-group">
                        <label htmlFor={id}>{this.props.russian_name}</label>
                        <select value={selected} name={this.props.name} id={id} onChange={this.handleChange} className="form-control">
                            <option value={true}>Да</option>
                            <option value={false}>Нет</option>
                        </select>
                    </div>
                    )
            }
        });

        return ControlBoolSelect;
    }
);