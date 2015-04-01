define(
    'views/react/template/control_adapter/bool_select',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/template/control_adapter/control_getters',
        'jsx!views/react/controls/bool_select'
    ],
    function(
            $, _, Backbone, React,  ControlGetters,
            BoolSelect
        ){
        var ControlAdapter = React.createClass({
            mixins: [ControlGetters],
            render: function(){
                return(
                    <BoolSelect value={this.getValue()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} error={validation_error} />
                )
            }
        });

        return ControlAdapter;
    }
);