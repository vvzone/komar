define(
    'views/react/template/control_adapter/control_getters',
    [
        'jquery',
        'underscore'
    ],
    function(
            $, _
        ){

        return function(){
            return {
                getDependencyArray: function(){
                    return this.getInitProp().dependency_array;
                },
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
                }
            }
        }();
    }
);