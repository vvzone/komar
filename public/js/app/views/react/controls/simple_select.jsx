/** @jsx React.DOM */

define(
    'views/react/controls/simple_select',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin'
    ],function($, React, ControlsMixin){

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
                console.error(this.props.name);
                property[this.props.name] = event.target.value;
                this.props.callback(property);
            },
            componentWillMount: function() {
                this.setState({selected: this.props.selected});
                console.info('SimpleSelect -> WillMount selected='+this.props.selected);
                console.log('===========this.props=========');
                console.log(this.props);

                this.setState({options: this.props.options});

                /*
                $.get('http://zend_test/main/'+this.props.source, function(result) {
                    var arr = [];
                    for(var item in result.data){
                        arr[result.data[item]['id']] = result.data[item];
                    }
                    this.setState({options: arr});
                }.bind(this));
                */

            },
            render: function(){
                console.info('SimpleSelect -> Render');
                console.log(this.props);
                var options = [];
                var selected = 0;
                if(this.state.selected){
                    selected = this.state.selected;
                    console.log('SELECTED');
                    console.log(selected);
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
