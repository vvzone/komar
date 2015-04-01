define(
    'views/react/template/control_adapter/simple_select',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/template/control_adapter/control_getters',

        'jsx!views/react/controls/simple_select'
    ],
    function(
            $, _, Backbone, React, ControlGetters,
            SimpleSelect
        ){
        var ControlAdapter = React.createClass({
            mixins: [ControlGetters],
            render: function(){
                return(
                    <SimpleSelect selected={this.getValue()} options={this.getDependencyArray()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} error={this.getValidationError} />
                )
            }
        });

        return ControlAdapter;
    }
);