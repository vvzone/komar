/** @jsx React.DOM */


var EntityBlock = React. createClass({
    /* Router Class
     * props:
     * entity_name = '',
     * host - for dependencies (whole array of item, inc id, and all fields)
     * */
    render: function () {
        var class_name = this.props.entity_name;
        var current_id = this.props.item;

        var entity = {};
        entity['name'] = this.props.entity_name;
        entity['current_id'] = this.props.item;

        switch (entity['name']) {
            case 'ranks':
                return(<FormEntRanks entity={entity} />);
                break;
            case 'positions':
                return(<FormEntPositions entity={entity} />);
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={current_id} />);
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes entity={entity} />);
                break;
            case 'address_types':
                return(<FormEntAddressTypes entity={entity} />);
                break;
            case 'countries':
                return(<FormEntCountries entity={entity} />);
                break;
            case 'region_types':
                return(<FormEntRegionTypes entity={entity} />);
                break;
            case 'region_types_selector':
                return(<FormSelectorRegionTypes selected={entity.current_id} entity={entity} />);
                break;
            case 'regions':
                return(<FormEntRegions entity={entity} />);
                break;
            case 'location_types':
                return(<FormEntLocationTypes entity={entity} />);
                break;
            case 'street_types':
                return(<FormEntStreetTypes entity={entity} />);
                break;
            case 'sex_types':
                return(<FormEntSexTypes entity={entity} />);
                break;
            case 'commander_types':
                return(<FormEntCommanderTypes entity={entity} />);
                break;
            case 'period_types':
                return(<FormEntPeriodTypes entity={entity} />);
                break;
            case 'period_types_selector':
                return(<FormSelectorPeriodTypes selected={entity.current_id} entity={entity} />);
                break;
            case 'enumeration_types':
                return(<FormEntEnumerationTypes entity={entity} />);
                break;
            case 'doc_kinds':
                return(<TreeDocKinds entity={entity} />);
                break;
            case 'doc_kind_edit':
                return(<FormEntDocKinds entity={entity} />);
                break;
            case 'doc_types':
                return(<FormEntDocTypes entity={entity} />);
                break;
        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
    }
});

var CurrentClassMixin = function () {
    return {
        editMainListRoute: function(source, entity, dependencies, dependencies_place){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} dependencies_place={dependencies_place} />);
            }else{
                console.log('*=*=MainList=*=*');
                return(<MainList source={source} entity={entity} dependencies={dependencies} dependencies_place={dependencies_place} />);
            }
        },
        editMainRoute: function(source, entity, dependencies, dependencies_place){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} dependencies_place={dependencies_place} />);
            }else{
                console.log('^=^=MainTree=^=^');
                return(<MainList source={source} entity={entity} dependencies={dependencies} dependencies_place={dependencies_place} />);
            }
        }
    }
}()


var FormEntPositions = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = 'rank_position';

        var output = this.editMainListRoute('positions', this.props.entity, null, null);
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
        var output = this.editMainListRoute('ranks', this.props.entity, null, null);
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
        var output = this.editMainListRoute('passdoctypes', this.props.entity, null, null);
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
        var output = this.editMainListRoute('addresstypes', this.props.entity, null, null);
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
        var output = this.editMainListRoute('countries', this.props.entity, null, null);
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
        var output = this.editMainListRoute('regiontypes', this.props.entity, null, null);
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
                <SimpleSelect source="regiontypes" selected={this.props.selected} current_id={this.props.entity.current_id} />
            </div>
            )
    }
});

var FormEntRegions = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = 'region_types_selector';
        var output = this.editMainListRoute('regions', this.props.entity, dependencies, null);
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
        return(
            <div className="LocationTypesBox">
                <MainList source="locationtypes" current_id={this.props.entity} />
            </div>
            )
    }
});

var FormEntStreetTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="StreetTypesBox">
                <MainList source="streettypes" current_id={this.props.entity} />
            </div>
            )
    }
});

var FormEntSexTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="SexTypesBox">
                <MainList source="sextypes" current_id={this.props.entity} />
            </div>
            )
    }
});

var FormEntCommanderTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="CommanderTypesBox">
                <MainList source="commandertypes" current_id={this.props.entity} />
            </div>
            )
    }
});

var FormEntPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="PeriodTypesBox">
                <MainList source="periodtypes" current_id={this.props.entity} />
            </div>
            )
    }
});

var FormSelectorPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector PeriodTypes">
                <label>Тип периода:</label><SimpleSelect source="periodtypes" selected={this.props.selected} />
            </div>
            )
    }
});

var FormEntEnumerationTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = 'period_types_selector';
        var dependencies_place = [];
        dependencies_place[0] = 3;
        return(
            <div className="EnumerationTypesBox">
                <MainList source="enumerationtypes" dependencies={dependencies} dependencies_place={dependencies_place} current_id={this.props.entity} />
            </div>
            )
    }
});

var FormEntDocKinds = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        if(this.props.entity){
            return(
                <div className="DocKindsBox">
                    <MainItemEdit source="dockinds" current_id={this.props.entity} />
                </div>
            )
        }
        return(
            <div className="DocKindsBox">
                <MainTree source="dockinds" />
            </div>
        )
    }
});

var TreeDocKinds = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="DocKindsBox">
                <MainTree source="dockinds" />
            </div>
            )
    }
});

var FormEntDocTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="DocTypesBox">
                <MainList source="doctypes" current_id={this.props.entity} />
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
                <ListBoxTwoSide source_left={source[0]} source_right={source[1]} />
            </div>
            )
    }
});