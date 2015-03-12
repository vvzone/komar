/** @jsx React.DOM */

define(
    'views/react/controls/simple_select',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'config'
    ],function($, React, ControlsMixin, Config){
        var debug = (Config['debug'] && Config['debug']['debug_controls']['tiny_text'] )? 1:null;
        /* Select */

        var SimpleSelect = React.createClass({
            /*
             * props: selected, source
             * */
            getInitialState: function() {
                return {
                    options: [],
                    selected: ''
                }
            },

            handleChange: function(event){
                this.setState({selected: event.target.value});
                var property = {};
                property[this.props.name] = event.target.value;
                this.props.callback(property);
            },
            componentWillMount: function() {
                this.setState({selected: this.props.selected});
                (debug)?console.info('SimpleSelect -> WillMount selected='+this.props.selected):null;
                this.setState({options: this.props.options});
            },
            render: function(){
                var options = [];
                var selected = 0;
                (debug)?console.log(['this.props.options', this.props.options]):null;
                if(this.state.selected){
                    if(selected = this.state.selected.id){
                      selected = this.state.selected.id;
                    }
                    else{
                      selected = this.state.selected;
                    }
                }

                for(var key in this.props.options){
                    options.push(<option key={this.props.options[key]['id']}
                    value={this.props.options[key]['id']}
                    id={this.props.options[key]['id']}
                    onClick={this.handleClick}>
                    {this.props.options[key]['name']}
                    </option>);
                }

                var select_name = 'select_'+this.props.name;
                return(
                    <div className="form-group">
                        <label htmlFor={select_name}>{this.props.russian_name}</label>
                        <select id={select_name} value={selected} onChange={this.handleChange} className="form-control">{options}</select>
                    </div>
                    )
            }
        });

        return SimpleSelect;
    }
);
