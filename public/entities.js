/** @jsx React.DOM */


var EntityBlock = React. createClass({
    /* Router Class
     * props:
     * entity_name = '',
     * host - for dependencies (whole array of item, inc id, and all fields)
     * */
    render: function(){
        var class_name = this.props.entity_name;
        var host = this.props.item;
        switch(class_name) {
            case 'rank':
                return(<FormEntRank />)
                break;
            case 'position':
                return(<FormEntPosition />)
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={host.id} />)
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes />)
                break;
            case 'address_types':
                return(<FormEntAddressTypes />)
                break;
            case 'countries':
                return(<FormEntCountries />)
                break;
            case 'region_types':
                return(<FormEntRegionTypes />)
                break;
            case 'region_types_selector':
                return(<FormSelectorRegionTypes selected={host.region_type} />)
                break;
            case 'regions':
                return(<FormEntRegions />)
                break;
            case 'location_types':
                return(<FormEntLocationTypes />)
                break;
            case 'street_types':
                return(<FormEntStreetTypes />)
                break;
            case 'sex_types':
                return(<FormEntSexTypes />)
                break;
            case 'commander_types':
                return(<FormEntCommanderTypes />)
                break;

        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
    }
});

var FormEntPosition = React. createClass({
    render: function(){

        var dependencies = [];
        dependencies[0] = 'rank_position';
        return(
            <div className="PositionBox">
                <MainList source="positions" dependencies={dependencies} />
            </div>
            )
    }
});

var FormEntRank = React. createClass({
    render: function(){
        return(
            <div className="RankBox">
                <MainList source="ranks" />
            </div>
            )
    }
});

var FormEntPassDocTypes = React. createClass({
    render: function(){
        return(
            <div className="PassDocTypesBox">
                <MainList source="passdoctypes" />
            </div>
            )
    }
});

var FormEntAddressTypes = React. createClass({
    render: function(){
        return(
            <div className="AddressBox">
                <MainList source="addresstypes" />
            </div>
            )
    }
});

var FormEntCountries = React. createClass({
    render: function(){
        return(
            <div className="CountriesBox">
                <MainList source="countries" />
            </div>
            )
    }
});

var FormEntRegionTypes = React. createClass({
    render: function(){
        return(
            <div className="RegionTypesBox">
                <MainList source="regiontypes" />
            </div>
            )
    }
});

var FormSelectorRegionTypes = React. createClass({
    render: function(){
        return(
            <div className="selector RegionTypes">
                <SimpleSelect source="regiontypes" selected={this.props.selected} />
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
                <MainList source="regions" dependencies={dependencies}/>
            </div>
            )
    }
});

var FormEntLocationTypes = React. createClass({
    render: function(){
        return(
            <div className="LocationTypesBox">
                <MainList source="locationtypes" />
            </div>
            )
    }
});

var FormEntStreetTypes = React. createClass({
    render: function(){
        return(
            <div className="StreetTypesBox">
                <MainList source="streettypes" />
            </div>
            )
    }
});

var FormEntSexTypes = React. createClass({
    render: function(){
        return(
            <div className="SexTypesBox">
                <MainList source="sextypes" />
            </div>
            )
    }
});

var FormEntCommanderTypes = React. createClass({
    render: function(){
        return(
            <div className="CommanderTypesBox">
                <MainList source="commandertypes" />
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