define(
    'views/react/template/form/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',

        'jsx!views/react/controls/tiny_text',
        'jsx!views/react/controls/simple_select',
        'jsx!views/react/controls/bool_select',
        'jsx!views/react/controls/list_box',
        'jsx!views/react/controls/simple_list'
    ],
    function(
            $, _, Backbone, React,
            TinyText, SimpleSelect, BoolSelect, ListBox, SimpleList
        ){
        var ControlAdapter = React.createClass({
            getPropDataFromModel: function (prop) {
                //var dependency_array = this.getPropDependency(prop);

                var propData = {
                    value: this.props.model.get(prop),
                    name: prop,
                    russian_name: this.props.model.attr_rus_names[prop],
                    callback: this.callBack,
                    error: this.getPropErrors(prop)
                };

                if(this.props.dependency_array){
                    //propData.push({dependency_array: dependency_array});
                    if(this.props.dependency_array[prop]){
                        console.error('YES');
                        _.extend(propData, {dependency_array: this.props.dependency_array[prop]})
                        console.warn(['propData', propData]);
                    }
                }

                return propData;
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
            },
            render: function(){
                return(
                    <BoolSelect value={this.getValue()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} error={validation_error} />
                )
            }
        });

        return ControlAdapter;
    }
);