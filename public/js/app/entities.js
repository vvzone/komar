/** @jsx React.DOM */


var EntityBlock = React. createClass({displayName: 'EntityBlock',
    /* Router Class
     * props:
     * entity_name = '',
     * host - for dependencies (whole array of item, inc id, and all fields)
     * */
    render: function () {
        var class_name = this.props.entity_name;
        var current_id = this.props.current_id;

        var entity = {};
        entity['entity_name'] = this.props.entity_name;
        entity['db_prop_name'] = this.props.db_prop_name;

        entity['host'] = this.props.host; //для вывода списка в дереве

        entity['current_id'] = this.props.item; //для редактирования, нужно для хранения current_id для REST запросов вида /entity/{id}

        //entity['current_id'] = this.props.current_id;
        entity['item'] = this.props.item;

        console.log('===ACCEPTED===');
        console.log('==this.props==');
        console.log(this.props);

        /* remove this shit somehow */
        switch (class_name) {
            case 'ranks':
                return(FormEntRanks({entity: entity, callback: this.handleCallback}));
                break;
            case 'positions':
                return(FormEntPositions({entity: entity, callback: this.handleCallback}));
                break;
            case 'rank_position':
                return(FormEntRankPosition({host_id: current_id, entity: entity, callback: this.handleCallback}));
                break;
            case 'pass_doc_types':
                return(FormEntPassDocTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'address_types':
                return(FormEntAddressTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'countries':
                return(FormEntCountries({entity: entity, callback: this.handleCallback}));
                break;
            case 'region_types':
                return(FormEntRegionTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'region_types_selector':
                return(SelectorRegionTypes({selected: current_id, entity: entity, callback: this.handleCallback}));
                break;
            case 'regions':
                return(FormEntRegions({entity: entity, callback: this.handleCallback}));
                break;
            case 'location_types':
                return(FormEntLocationTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'street_types':
                return(FormEntStreetTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'sex_types':
                return(FormEntSexTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'commander_types':
                return(FormEntCommanderTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'period_types':
                return(FormEntPeriodTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'period_types_selector':
                return(SelectorPeriodTypes({selected: current_id, entity: entity, callback: this.handleCallback}));
                break;
            case 'enumeration_types':
                return(FormEntEnumerationTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_type_groups':
                return(TreeDocTypeGroups({entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_type_groups_edit':
                return(FormEntDocTypeGroups({entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_secrecy_types':
                return(FormEntDocSecrecyTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_secrecy_types_selector':
                return(SelectorDocSecrecyTypes({selected: current_id, entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_urgency_types':
                return(FormEntDocUrgencyTypes({entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_urgency_types_selector':
                return(SelectorDocUrgencyTypes({selected: current_id, entity: entity, callback: this.handleCallback}));
                break;
            case 'doc_types':
                return(FormEntDocTypes({entity: entity, callback: this.handleCallback}));
                break;
        };
        var msg = "Не найден класс "+class_name;
        return(React.DOM.div(null, ErrorMsg({msg: msg})))
    },
    handleCallback: function(callback){
        this.props.callback(callback);
    }
});

var CurrentClassMixin = function () {
    return {
        editMainListRoute: function(source, entity, dependencies){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(MainItemEdit({source: source, entity: entity, dependencies: dependencies}));
            }else{
                console.log('*=*=MainList=*=*');
                return(MainList({source: source, entity: entity, dependencies: dependencies}));
            }
        },
        editMainTreeRoute: function(source, entity, dependencies){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(MainItemEdit({source: source, entity: entity, dependencies: dependencies}));
            }else{
                console.log('^=^=MainTree=^=^');
                return(MainTree({source: source, entity: entity, tree_dependency: dependencies})); //real arg is tree_dependency
            }
        },
        handleCallback: function(callback){
            this.props.callback(callback);
        }
    }
}()



var FormEntRanks = React. createClass({displayName: 'FormEntRanks',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('ranks', this.props.entity, null);
        return(
            React.DOM.div({className: "RankBox"},
                output
            )
            )
    }
});

var FormEntPositions = React. createClass({displayName: 'FormEntPositions',
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = {
            class_name: 'rank_position',
            place: 2,
            db_prop_name: 'id'
        };

        var output = this.editMainListRoute('positions', this.props.entity, dependencies);
        return(
            React.DOM.div({className: "PositionBox"},
                output
            )
            )
    }
});

var FormEntRankPosition = React. createClass({displayName: 'FormEntRankPosition',
    mixins: [CurrentClassMixin],
    render: function(){
        console.log('FormEntRankPosition');
        var source = [];
        source[0] = 'positionsranks';
        source[1] = 'ranks';

        return(
            React.DOM.div({className: "item_attr"},
                React.DOM.div({className: "form_label"}, "Звания соответствующие должности"),
                ListBoxTwoSide({source_left: source[0], source_right: source[1], entity: this.props.entity, callback: this.handleCallback})
            )
            )
    }
});

var FormEntPassDocTypes = React. createClass({displayName: 'FormEntPassDocTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('passdoctypes', this.props.entity, null);
        return(
            React.DOM.div({className: "PassDocTypesBox"},
                output
            )
            )
    }
});

var FormEntAddressTypes = React. createClass({displayName: 'FormEntAddressTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('addresstypes', this.props.entity, null);
        return(
            React.DOM.div({className: "AddressBox"},
                output
            )
            )
    }
});

var FormEntCountries = React. createClass({displayName: 'FormEntCountries',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('countries', this.props.entity, null);
        return(
            React.DOM.div({className: "CountriesBox"},
                output
            )
            )
    }
});

var FormEntRegionTypes = React. createClass({displayName: 'FormEntRegionTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('regiontypes', this.props.entity, null);
        return(
            React.DOM.div({className: "RegionTypesBox"},
                output
            )
            )
    }
});

var SelectorRegionTypes = React. createClass({displayName: 'SelectorRegionTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            React.DOM.div({className: "selector RegionTypes"},
                React.DOM.label(null, "Тип региона"),
                SimpleSelect({source: "regiontypes", selected: this.props.selected, current_id: this.props.entity.current_id, callback: this.handleCallback})
            )
            )
    }
});

var FormEntRegions = React. createClass({displayName: 'FormEntRegions',
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies ={};
        dependencies[0] = {
            class_name: 'region_types_selector',
            place: 2,
            db_prop_name: 'region_type'
        };

        var output = this.editMainListRoute('regions', this.props.entity, dependencies);
        return(
            React.DOM.div({className: "RegionsBox"},
                output
            )
            )
    }
});

var FormEntLocationTypes = React. createClass({displayName: 'FormEntLocationTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('locationtypes', this.props.entity, null);
        return(
            React.DOM.div({className: "LocationTypesBox"},
                output
            )
            )
    }
});

var FormEntStreetTypes = React. createClass({displayName: 'FormEntStreetTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('streettypes', this.props.entity, null);
        return(
            React.DOM.div({className: "StreetTypesBox"},
                output
            )
            )
    }
});

var FormEntSexTypes = React. createClass({displayName: 'FormEntSexTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('sextypes', this.props.entity, null);
        return(
            React.DOM.div({className: "SexTypesBox"},
                output
            )
            )
    }
});

var FormEntCommanderTypes = React. createClass({displayName: 'FormEntCommanderTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('commandertypes', this.props.entity, null);
        return(
            React.DOM.div({className: "CommanderTypesBox"},
                output
            )
            )
    }
});

var FormEntPeriodTypes = React. createClass({displayName: 'FormEntPeriodTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('periodtypes', this.props.entity, null);
        return(
            React.DOM.div({className: "PeriodTypesBox"},
                output
            )
            )
    }
});

var SelectorPeriodTypes = React. createClass({displayName: 'SelectorPeriodTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            React.DOM.div({className: "selector PeriodTypes"},
                React.DOM.label(null, "Тип периода:"), SimpleSelect({source: "periodtypes", selected: this.props.selected, callback: this.handleCallback})
            )
            )
    }
});

var FormEntEnumerationTypes = React. createClass({displayName: 'FormEntEnumerationTypes',
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies = {};
        dependencies[0] = {
            class_name: 'period_types_selector',
            place: 3,
            db_prop_name: 'period_type'
        };

        var output = this.editMainListRoute('enumerationtypes', this.props.entity, dependencies);
        return(
            React.DOM.div({className: "EnumerationTypesBox"},
                output
            )
            )
    }
});

var FormEntDocTypeGroups = React. createClass({displayName: 'FormEntDocTypeGroups',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = MainItemEdit({source: "doctypes", entity: this.props.entity});  //this.editMainListRoute('doctypegroups', this.props.entity, null);
        return(
            React.DOM.div({className: "DocKindsBox"},
                output
            )
            )
    }
});

var TreeDocTypeGroups = React. createClass({displayName: 'TreeDocTypeGroups',
    mixins: [CurrentClassMixin],

    render: function(){
        var tree_dependency = {};
        tree_dependency = {
            source: 'doctypes',
            entity_name: 'doc_types',
            id_name_in_dependency: 'doc_group_id',
            russian_name: 'типы документов'
        };
        var output = this.editMainTreeRoute('doctypegroups', this.props.entity, tree_dependency); //MainTree !!!
        return(
            React.DOM.div({className: "DocKindsBox"},
                output
            )
            )
    }
});

var FormEntDocSecrecyTypes = React. createClass({displayName: 'FormEntDocSecrecyTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docsecrecytypes', this.props.entity, null);
        return(
            React.DOM.div({className: "DocSecrecyTypesBox"},
                output
            )
            )
    }
});

var SelectorDocSecrecyTypes = React. createClass({displayName: 'SelectorDocSecrecyTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            React.DOM.div({className: "selector DocSecrecyTypes"},
                React.DOM.label(null, "Секретность"),
                SimpleSelect({source: "docsecrecytypes", selected: this.props.selected, entity: this.props.entity, callback: this.handleCallback})
            )
            )
    }
});

var FormEntDocUrgencyTypes = React. createClass({displayName: 'FormEntDocUrgencyTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docurgencytypes', this.props.entity, null);
        return(
            React.DOM.div({className: "DocUrgencyTypesBox"},
                output
            )
            )
    }
});

var SelectorDocUrgencyTypes = React. createClass({displayName: 'SelectorDocUrgencyTypes',
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            React.DOM.div({className: "selector DocurgencyTypes"},
                React.DOM.label(null, "Срочность"),
                SimpleSelect({source: "docurgencytypes", selected: this.props.selected, entity: this.props.entity, callback: this.handleCallback})
            )
            )
    }
});



var FormEntDocTypes = React. createClass({displayName: 'FormEntDocTypes',
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies = {};
        dependencies[0] = {
            class_name: 'doc_secrecy_types_selector',
            place: 5,
            db_prop_name: 'secrecy_type'
        };

        dependencies[1] = {
            class_name: 'doc_urgency_types_selector',
            place: 6,
            db_prop_name: 'urgency_type'
        };

        var output = this.editMainListRoute('doctypes', this.props.entity, dependencies);

        return(
            React.DOM.div({className: "DocTypesBox"},
                output
            )
            )
    }
});