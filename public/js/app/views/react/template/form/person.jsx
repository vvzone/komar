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
        var Template = React.createClass({
            callBack: function(){
              return 'callback';
            },
            getPropErrors: function(prop){
                if(this.props.model.validation_errors){
                    if(this.props.model.validation_errors[prop]){
                        return this.props.model.validation_errors[prop];
                    }
                }
                return null;
            },
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
            render: function(){
                console.info(['TEMPLATE this.props', this.props]);
                console.info(['this.getPropDataFromModel(first_name)', this.getPropDataFromModel('first_name')]);
                console.warn(['this.props.dependency_array', this.props.dependency_array]);
                // <TinyText control_init={this.getPropDataFromModel('first_name')} />
                return(
                    <div>
                        <TinyText control_init={this.getPropDataFromModel('first_name')} />
                        <SimpleSelect control_init={this.getPropDataFromModel('sex_type')} />
                    </div>
                )
            }
        });

        return Template;
    }
);