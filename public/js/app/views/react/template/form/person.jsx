define(
    'views/react/template/form/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',

        'jsx!views/react/template/control_adapter/tiny_text',
        'jsx!views/react/template/control_adapter/simple_select',
        'jsx!views/react/template/control_adapter/small_text'
    ],
    function(
            $, _, Backbone, React,
            TinyText, SimpleSelect, SmallText
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
            getPropDataFromSubModel: function(prop_sub_model, prop){

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
                /*

                 birth_date: 'Дата рождения',
                 birth_place: 'Место рождения',
                 sex_type: 'Пол',
                 inn: 'ИНН',
                 citizenship: 'Гражданство',
                 deputy: 'Заместитель',
                 person_post: 'Должность',
                 user: 'Профиль пользователя системы'

                */

                return(
                    <div>
                        <TinyText template_init={this.getPropDataFromModel('first_name')} />
                        <TinyText template_init={this.getPropDataFromModel('patronymic_name')} />
                        <TinyText template_init={this.getPropDataFromModel('family_name')} />
                        <SmallText template_init={this.getPropDataFromModel('family_name')} />
                        <SimpleSelect template_init={this.getPropDataFromModel('sex_type')} />
                        <TinyText template_init={this.getPropDataFromModel('inn')} />
                        <TinyText template_init={this.getPropDataFromModel('citizenship')} />
                        <SimpleSelect template_init={this.getPropDataFromModel('deputy')} />
                        <TinyText template_init={this.getPropDataFromModel('person_post')} />
                    </div>
                )
            }
        });

        return Template;
    }
);