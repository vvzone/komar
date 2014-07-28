/** @jsx React.DOM */

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

var ControlBoolSelect = React.createClass({
    mixins: [ControlsMixin],
    getInitialState: function() {
        return {
            value: '',
            discard: undefined
        };
    },
    render: function(){
        var id = 'bool_select_'+this.props.russian_name;
        var selected = this.state.value;
        return(
            <div className="form-group">
                <label htmlFor={id}>{this.props.russian_name}</label>
                <select value={selected} name={this.props.name} id={id} onChange={this.handleChange}>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </div>
            )
    }
});

/* Controls: text, selector, search */


var ControlRouter = React.createClass({
    /* Router  fix this as soon as some free time ;)
     * ---
     * props: value, type (route)
     *
     * */
    getInitialState: function() {
        return {
            value: '',
            discard: false
        };
    },
    componentWillReceiveProps: function(prop){
        this.setState({discard: prop.discard});
    },
    callBack: function(property){
        this.props.callback(property);
    },
    render: function () {
        var type = this.props.type;
        var value = this.props.value;
        var name = this.props.name;
        var russian_name = this.props.russian_name;
        var discard = this.props.discard;
        var self = this;
        switch (type) {
            case('tiny_text'):
                return(<ControlTinyText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
            case('small_text'):
                return(<ControlSmallText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
            case('bool_select'):
                return(<ControlBoolSelect value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
        }

        return(<div></div>)
    }
});

