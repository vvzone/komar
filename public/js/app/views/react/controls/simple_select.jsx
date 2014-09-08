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
                console.error(this.props.entity.db_prop_name);
                property[this.props.entity.db_prop_name] = event.target.value;
                this.props.callback(property);
            },
            componentDidMount: function() {
                this.setState({selected: this.props.selected});
                console.log('WillMount selected='+this.props.selected);
                console.log('===========this.props=========');
                console.log(this.props);

                $.get('http://zend_test/main/'+this.props.source, function(result) {
                    var arr = [];
                    for(var item in result.data){
                        arr[result.data[item]['id']] = result.data[item];
                    }
                    this.setState({options: arr});
                }.bind(this));

            },
            render: function(){
                var options = [];
                var selected = 0;
                if(this.state.selected){
                    selected = this.state.selected;
                    console.log('SELECTED');
                    console.log(selected);
                }

                for(var key in this.state.options){
                    options.push(<option key={this.state.options[key]['id']}
                    value={this.state.options[key]['id']}
                    id={this.state.options[key]['id']}
                    onClick={this.handleClick}>
                {this.state.options[key]['name']}
                    </option>);
                }

                return(<select value={selected} onChange={this.handleChange}>{options}</select>)
            }
        });

        return SimpleSelect;
    }
);
