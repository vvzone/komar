/** @jsx React.DOM */


var EntityBlock = React. createClass({
    /* Router Class
     * props:
     * entity_name = '',
     * host - for dependencies (whole array of item, inc id, and all fields)
     * */
      render: function () {
        var class_name = this.props.entity_name;
        var current_id = this.props.item.id;

        var entity = {};
        entity['name'] = this.props.entity_name;
        entity['value'] = this.props.value;
        entity['item'] = this.props.item;
        entity['prop_name'] = this.props.name;


       console.log('===ACCEPTED===');
       console.log('==this.props==');
       console.log(this.props);



        switch (entity['name']) {
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
                return(<FormSelectorRegionTypes selected={entity.current_id} entity={entity}  callback={this.handleCallback} />);
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
                return(<FormSelectorPeriodTypes selected={entity.current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'enumeration_types':
                return(<FormEntEnumerationTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_kinds':
                return(<TreeDocKinds entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_kind_edit':
                return(<FormEntDocKinds entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types':
                return(<FormEntDocSecrecyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types_selector':
                return(<FormSelectorDocSecrecyTypes selected={entity.current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types':
                return(<FormEntDocUrgencyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types_selector':
                return(<FormSelectorDocUrgencyTypes selected={entity.current_id} entity={entity}  callback={this.handleCallback} />);
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
                return(<MainTree source={source} entity={entity} dependencies={dependencies} />);
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

var FormSelectorRegionTypes = React. createClass({
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

var FormSelectorPeriodTypes = React. createClass({
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

var FormEntDocKinds = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainTreeRoute('dockinds', this.props.entity, null);
        return(
            <div className="DocKindsBox">
                {output}
            </div>
        )
    }
});

var TreeDocKinds = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainTreeRoute('dockinds', this.props.entity, null); //MainTree !!!
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

var FormSelectorDocSecrecyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocSecrecyTypes">
                <label>Секретность</label>
                <SimpleSelect source="docsecrecytypes" selected={this.props.current_id} entity={this.props.entity} callback={this.handleCallback} />
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

var FormSelectorDocUrgencyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocurgencyTypes">
                <label>Срочность</label>
                <SimpleSelect source="docurgencytypes" selected={this.props.current_id} entity={this.props.entity} callback={this.handleCallback}/>
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