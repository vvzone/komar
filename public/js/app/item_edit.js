/** @jsx React.DOM */
/* some base elements */


var ItemEditBox = React.createClass({
    /*
    * Props:
    * item - item array
    * prototype.editable_properties - from server
    * dependencies - from entity
    *
    * */
    getInitialState: function () {
        return {
            item: [],
            item_dependencies: []
        }
    },
    saveForm: function () {
        console.info('item to save');
        console.info(this.state.item);
    },
    itemUpdate: function (property) {
        //console.info('itemUpdate');
        var current_item = this.state.item;
        for (var key in property) {
            current_item[key] = property[key];
        }
        current_item[property.db_prop_name] = property.value;
        this.setState({item: current_item});
    },
    componentWillMount: function () {
        window.addEventListener("saveButtonClick", this.saveForm, true);
        this.setState({item: this.props.item});
    },
    componentWillUnmount: function () {
        window.removeEventListener("saveButtonClick", this.saveForm, true);
    },
    render: function () {
        var editable = this.props.prototype.editable_properties;

        var item = null;
        if(this.state.item){
            var item = this.state.item; //может быть и undefined для новых
        }

        var controls = [];
        var counter = 0;
        var dependencies_by_place = {};

        // 2-do: //fix this
        // dependencies arrays are nightmare
        var dependencies = {};
        dependencies = this.props.dependencies;

        //console.info('Object.prototype.toString.call(dependencies)='+Object.prototype.toString.call(dependencies));
        //console.info('typeof(dependencies)'+typeof(dependencies));
        if (typeof(dependencies) == 'object') {
            for(var key in dependencies){
                var place_key = dependencies[key].place;
                console.info('place_key= '+place_key);
                dependencies_by_place[place_key] = dependencies[key];
            }
        }

        console.log('Editable');
        var self = this;
        for (var prop in editable) { // старое item - ошибочно так как выводило только не undefined поля текущего экземпляра обьекта
            if (typeof(dependencies) == 'object') {
                if (typeof dependencies_by_place[counter] != 'undefined' && typeof dependencies_by_place[counter].place != 'undefined') {
                        if (counter == dependencies_by_place[counter].place) {
                            controls.push(<EntityBlock
                                entity_name={dependencies_by_place[counter].class_name}
                                db_prop_name={dependencies_by_place[counter].db_prop_name}
                                item={item}
                                current_id={this.props.item[dependencies_by_place[counter].db_prop_name]}
                                callback={self.itemUpdate} />);
                        }
                }
            }
            if (editable[prop]) {
                var type = prop;
                controls.push(
                    <ControlRouter type={properties_types[type]} value={item[prop]} name={type} russian_name={editable[prop]} callback={this.itemUpdate} key={editable[prop]} />
                );
            }
            counter++;
        }

        if(controls.length == 0){
            return(<ErrorMsg msg="Не найдено ни одного контрола" />);
        }

        var edit_properties_box = [];
        edit_properties_box.push(<form role="form" className="ControlsBox">{controls}</form>);
        return(
            <div className="item">
                {edit_properties_box}
            </div>
            )
    }
});

var MainItemEdit = React. createClass({
    getInitialState: function() {
        return {
            item: []
        }
    },
    componentWillMount: function() {
        var self = this;
        $.ajax({
            type: "POST",
            url: 'http://zend_test/main/' + this.props.source+'/'+this.props.entity.current_id,
            data: ''+this.props.entity.current_id+'',
            success: function(response){
                console.info('response');
                console.info(response);
                self.setState({item : response});
            }
        })
            .error(function () {
                alert("Network Error.");
            });
    },
    render: function(){
        var controls = [];
        var key ='edit_'+this.props.entity.name+'_'+1;
        var item = [];
        if(this.state.item.data){
            item = this.state.item.data[0];
        }

        if(this.state.item.prototype){ //старое item.data - может быть и undefined для add-action
            controls[0] = <ItemEditBox
            item={item}
            prototype={this.state.item.prototype}
            key={key}
            dependencies={this.props.dependencies}
            entity={this.props.entity}
            />;
        }
        return(
            <div>
                {controls}
            </div>
        );
    }

});