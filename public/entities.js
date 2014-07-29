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
        console.log('Entity current_id= '+ current_id);

        var entity;
        switch (class_name) {
            case 'ranks':
                return(<FormEntRanks current_id={current_id} />);
                break;
            case 'positions':
                return(<FormEntPositions current_id={current_id} />);
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={current_id} />);
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes current_id={current_id} />);
                break;
            case 'address_types':
                return(<FormEntAddressTypes current_id={current_id} />);
                break;
            case 'countries':
                return(<FormEntCountries current_id={current_id} />);
                break;
            case 'region_types':
                return(<FormEntRegionTypes current_id={current_id} />);
                break;
            case 'region_types_selector':
                return(<FormSelectorRegionTypes selected={current_id} />);
                break;
            case 'regions':
                return(<FormEntRegions current_id={current_id} />);
                break;
            case 'location_types':
                return(<FormEntLocationTypes current_id={current_id} />);
                break;
            case 'street_types':
                return(<FormEntStreetTypes current_id={current_id} />);
                break;
            case 'sex_types':
                return(<FormEntSexTypes current_id={current_id} />);
                break;
            case 'commander_types':
                return(<FormEntCommanderTypes current_id={current_id} />);
                break;
            case 'period_types':
                return(<FormEntPeriodTypes current_id={current_id} />);
                break;
            case 'period_types_selector':
                return(<FormSelectorPeriodTypes selected={current_id} />);
                break;
            case 'enumeration_types':
                return(<FormEntEnumerationTypes current_id={current_id} />);
                break;
            case 'doc_kinds':
                return(<TreeDocKinds current_id={current_id} />);
                break;
            case 'doc_kind_edit':
                return(<FormEntDocKinds current_id={current_id} />);
                break;
            case 'doc_types':
                return(<FormEntDocTypes current_id={current_id} />);
                break;
        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
    }
});

var FormEntPositions = React. createClass({
    render: function(){

        var dependencies = [];
        dependencies[0] = 'rank_position';
        return(
            <div className="PositionBox">
                <MainList source="positions" dependencies={dependencies} current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntRanks = React. createClass({
    render: function(){
        return(
            <div className="RankBox">
                <MainList source="ranks" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntPassDocTypes = React. createClass({
    render: function(){
        return(
            <div className="PassDocTypesBox">
                <MainList source="passdoctypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntAddressTypes = React. createClass({
    render: function(){
        return(
            <div className="AddressBox">
                <MainList source="addresstypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntCountries = React. createClass({
    render: function(){
        return(
            <div className="CountriesBox">
                <MainList source="countries" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntRegionTypes = React. createClass({
    render: function(){
        return(
            <div className="RegionTypesBox">
                <MainList source="regiontypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormSelectorRegionTypes = React. createClass({
    render: function(){
        return(
            <div className="selector RegionTypes">
                <SimpleSelect source="regiontypes" selected={this.props.selected} current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntRegions = React. createClass({
    render: function(){
        var dependencies = [];
        dependencies[0] = 'region_types_selector';
        return(
            <div className="RegionsBox">
                <MainList source="regions" dependencies={dependencies} current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntLocationTypes = React. createClass({
    render: function(){
        return(
            <div className="LocationTypesBox">
                <MainList source="locationtypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntStreetTypes = React. createClass({
    render: function(){
        return(
            <div className="StreetTypesBox">
                <MainList source="streettypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntSexTypes = React. createClass({
    render: function(){
        return(
            <div className="SexTypesBox">
                <MainList source="sextypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntCommanderTypes = React. createClass({
    render: function(){
        return(
            <div className="CommanderTypesBox">
                <MainList source="commandertypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntPeriodTypes = React. createClass({
    render: function(){
        return(
            <div className="PeriodTypesBox">
                <MainList source="periodtypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormSelectorPeriodTypes = React. createClass({
    render: function(){
        return(
            <div className="selector PeriodTypes">
                <label>Тип периода:</label><SimpleSelect source="periodtypes" selected={this.props.selected} />
            </div>
            )
    }
});

var FormEntEnumerationTypes = React. createClass({
    render: function(){
        var dependencies = [];
        dependencies[0] = 'period_types_selector';
        var dependencies_place = [];
        dependencies_place[0] = 3;
        return(
            <div className="EnumerationTypesBox">
                <MainList source="enumerationtypes" dependencies={dependencies} dependencies_place={dependencies_place} current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntDocKinds = React. createClass({
    render: function(){
        console.log('(1)current_id='+this.props.current_id);
        return(
            <div className="DocKindsBox">
                <MainItemEdit source="dockinds" current_id={this.props.current_id} />
            </div>
            )
    }
});

var TreeDocKinds = React. createClass({
    render: function(){
        return(
            <div className="DocKindsBox">
                <MainTree source="dockinds" />
            </div>
            )
    }
});

var FormEntDocTypes = React. createClass({
    render: function(){
        return(
            <div className="DocTypesBox">
                <MainList source="doctypes" current_id={this.props.current_id} />
            </div>
            )
    }
});

var FormEntRankPosition = React. createClass({
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