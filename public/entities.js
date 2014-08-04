/** @jsx React.DOM */


var EntityBlock = React. createClass({
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

        entity['current_id'] = this.props.item; //нужно для хранения current_id для REST запросов вида /entity/{id}

        //entity['current_id'] = this.props.current_id;
        entity['item'] = this.props.item;



       console.log('===ACCEPTED===');
       console.log('==this.props==');
       console.log(this.props);



        switch (class_name) {
            case 'ranks':
                return(<FormEntRanks entity={entity}  callback={this.handleCallback} />);
                break;
            case 'positions':
                return(<FormEntPositions entity={entity}  callback={this.handleCallback} />);
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={current_id} callback={this.handleCallback} />);
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'address_types':
                return(<FormEntAddressTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'countries':
                return(<FormEntCountries entity={entity}  callback={this.handleCallback} />);
                break;
            case 'region_types':
                return(<FormEntRegionTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'region_types_selector':
                return(<SelectorRegionTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'regions':
                return(<FormEntRegions entity={entity}  callback={this.handleCallback} />);
                break;
            case 'location_types':
                return(<FormEntLocationTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'street_types':
                return(<FormEntStreetTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'sex_types':
                return(<FormEntSexTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'commander_types':
                return(<FormEntCommanderTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'period_types':
                return(<FormEntPeriodTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'period_types_selector':
                return(<SelectorPeriodTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'enumeration_types':
                return(<FormEntEnumerationTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_type_groups':
                return(<TreeDocTypeGroups entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_type_groups_edit':
                return(<FormEntDocTypeGroups entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types':
                return(<FormEntDocSecrecyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types_selector':
                return(<SelectorDocSecrecyTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types':
                return(<FormEntDocUrgencyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types_selector':
                return(<SelectorDocUrgencyTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_types':
                return(<FormEntDocTypes entity={entity}  callback={this.handleCallback} />);
                break;
        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
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
                return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} />);
            }else{
                console.log('*=*=MainList=*=*');
                return(<MainList source={source} entity={entity} dependencies={dependencies} />);
            }
        },
        editMainTreeRoute: function(source, entity, dependencies){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} />);
            }else{
                console.log('^=^=MainTree=^=^');
                return(<MainTree source={source} entity={entity} tree_dependency={dependencies} />); //real arg is tree_dependency
            }
        },
        handleCallback: function(callback){
            this.props.callback(callback);
        }
    }
}()


var FormEntPositions = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = {
            class_name: 'rank_position',
            place: 2,
            db_prop_name: 'region_type'
        };

        var output = this.editMainListRoute('positions', this.props.entity, dependencies);
        return(
            <div className="PositionBox">
                {output}
            </div>
            )
    }
});

var FormEntRanks = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('ranks', this.props.entity, null);
        return(
            <div className="RankBox">
                 {output}
            </div>
            )
    }
});

var FormEntPassDocTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('passdoctypes', this.props.entity, null);
        return(
            <div className="PassDocTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntAddressTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('addresstypes', this.props.entity, null);
        return(
            <div className="AddressBox">
                {output}
            </div>
            )
    }
});

var FormEntCountries = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('countries', this.props.entity, null);
        return(
            <div className="CountriesBox">
                {output}
            </div>
            )
    }
});

var FormEntRegionTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('regiontypes', this.props.entity, null);
        return(
            <div className="RegionTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorRegionTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector RegionTypes">
                <label>Тип региона</label>
                <SimpleSelect source="regiontypes" selected={this.props.selected} current_id={this.props.entity.current_id} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntRegions = React. createClass({
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
            <div className="RegionsBox">
                {output}
            </div>
            )
    }
});

var FormEntLocationTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('locationtypes', this.props.entity, null);
        return(
            <div className="LocationTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntStreetTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('streettypes', this.props.entity, null);
        return(
            <div className="StreetTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntSexTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('sextypes', this.props.entity, null);
        return(
            <div className="SexTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntCommanderTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('commandertypes', this.props.entity, null);
        return(
            <div className="CommanderTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('periodtypes', this.props.entity, null);
        return(
            <div className="PeriodTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector PeriodTypes">
                <label>Тип периода:</label><SimpleSelect source="periodtypes" selected={this.props.selected} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntEnumerationTypes = React. createClass({
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
            <div className="EnumerationTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntDocTypeGroups = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainTreeRoute('doctypegroups', this.props.entity, null);
        return(
            <div className="DocKindsBox">
                {output}
            </div>
        )
    }
});

var TreeDocTypeGroups = React. createClass({
    mixins: [CurrentClassMixin],

    render: function(){
        var tree_dependency = {};
        tree_dependency = {
            source: 'doctypes',
            id_name_in_dependency: 'doc_kind_id',
            russian_name: 'Типы документов'
        };
        var output = this.editMainTreeRoute('doctypegroups', this.props.entity, tree_dependency); //MainTree !!!
        return(
            <div className="DocKindsBox">
                {output}
            </div>
            )
    }
});

var FormEntDocSecrecyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docsecrecytypes', this.props.entity, null);
        return(
            <div className="DocSecrecyTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorDocSecrecyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocSecrecyTypes">
                <label>Секретность</label>
                <SimpleSelect source="docsecrecytypes" selected={this.props.selected} entity={this.props.entity} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntDocUrgencyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docurgencytypes', this.props.entity, null);
        return(
            <div className="DocUrgencyTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorDocUrgencyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocurgencyTypes">
                <label>Срочность</label>
                <SimpleSelect source="docurgencytypes" selected={this.props.selected} entity={this.props.entity} callback={this.handleCallback}/>
            </div>
            )
    }
});



var FormEntDocTypes = React. createClass({
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
            <div className="DocTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntRankPosition = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        console.info(this.props.host_id);
        var source = [];
        source[0] = 'positionsranks';
        source[1] = 'ranks';

        return(
            <div className="item_attr">
                <div className="form_label">Звания соответствующие должности</div>
                <ListBoxTwoSide source_left={source[0]} source_right={source[1]} callback={this.handleCallback} />
            </div>
            )
    }
});