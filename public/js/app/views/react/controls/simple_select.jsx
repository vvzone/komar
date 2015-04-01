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
                property[this.getName()] = event.target.value;
                //this.props.callback(property);
                this.getCallBack(property);
            },
            componentWillMount: function() {
                this.setState({selected: this.getSelected()});
                (debug)?console.info('SimpleSelect -> WillMount selected='+this.props.selected):null;
                this.setState({options: this.getOptions});
            },
            drawOptions: function(options){
                var options_output = [];
                for(var key in options){
                    options_output.push(
                        <option key={options[key]['id']}
                        value={options[key]['id']}
                        id={options[key]['id']}
                        onClick={this.handleClick}>
                                        {options[key]['name']}
                        </option>
                    );
                }
                return options_output;
            },
            getCallBack: function(data){
                if(this.props.template_init){
                    this.props.template_init.callback(data);
                }
                return this.props.callback(data);
            },
            getSelected: function(){
                if(this.props.template_init){
                    return this.props.template_init.value;
                }
                return this.props.selected;
            },
            getOptions: function(){
                if(this.props.template_init){
                    return this.props.template_init.dependency_array
                }
                return this.props.options;
            },
            getName: function(){
                if(this.props.template_init){
                    return this.props.template_init.name;
                }

                return this.props.name;
            },
            getRussianName: function(){
                if(this.props.template_init){
                    return this.props.template_init.russian_name;
                }
                return this.props.russian_name;
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

                options = this.drawOptions(this.getOptions());

                var select_name = 'select_'+this.getName();
                return(
                    <div className="form-group">
                        <label htmlFor={select_name}>{this.getRussianName()}</label>
                        <select id={select_name} value={selected} onChange={this.handleChange} className="form-control">{options}</select>
                    </div>
                    )
            }
        });

        return SimpleSelect;
    }
);
