define(
    'views/react/template/control_adapter/small_text',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',

        'jsx!views/react/controls/small_text'
    ],
    function(
            $, _, Backbone, React,
            SmallText
        ){
        var ControlAdapter = React.createClass({
            getValidationError: function(){
                return this.getInitProp().error;
            },
            getCallBack: function(){
                return this.getInitProp().callback;
            },
            getRussianName: function(){
                return this.getInitProp().russian_name;
            },
            getName: function(){
                return this.getInitProp().name;
            },
            getValue: function(){
                return this.getInitProp().value;
            },
            getInitProp: function(){
                return this.props.template_init;
            },
            render: function(){
                return(
                    <SmallText value={this.getValue()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} error={this.getValidationError()} />
                )
            }
        });

        return ControlAdapter;
    }
);