/** @jsx React.DOM */    
    /*
    * base - ������� �����������: ������, ���������, ���� ����������
    *   --> rank - ������
    *   --> position - ��������� + �����
    *   --> pass_doc_types
    *   --> sys - �������� ���������: ������, ����. ���,
    *   --> sys_docs - �������� ��������� ����������
    *   --> address - ��� ������
    *   --> unit_lead_types
    *   -->
    * staff - ��������
    *   --> person - ������ �������� + ������� ������, ����������, �����, ����,
    *   --> pass_docs
    *   -->
    *   -->
    *   -->
    * doc - ���������
    *   --> person_document
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    * unit - �������������
    *   --> client
    *   --> unit
    *   --> unit_lead
    *   -->
     *  -->
    * */
    
    /*
    Rank -> base -> ranks -> ranks
    Post -> base -> position -> positions
    PostRank -> base -> position_rank -> positions
    PersonDocType -> base -> pass_doc_types -> pass_doc_types
    
    AddressType -> base -> address_types -> sys

    SexType -> base -> sex_types -> sys
    Country -> base -> countries -> sys
    
    CommanderType -> base -> commander_type -> sys_units
    
    PeriodType -> base -> period_types -> sys_docs
    EnumerationType -> base -> enumeration_types -> sys_docs
    DocType -> base -> doc_types -> sys_docs
    NodeType -> base -> route_node_types -> sys_docs
    (?)DocTypeAttribute -> base -> doc_attribute_types -> sys_docs
    (!!???)Enumeration -> unit -> enumeration -> sys_docs
    ==================================================================
    
    Person -> staff -> person -> person
    PersonPost -> staff -> person_position_history -> person
    PersonRank -> staff -> person_rank_history -> person
    Address -> staff -> person_address -> person
    Role -> staff -> person_role -> person
    
    ==================================================================
    
    Document -> doc -> doc -> doc
    PersonDocument -> doc -> pass_docs -> pass_docs
    Route -> doc -> route -> doc?
    Node -> doc -> route_node -> route?
    NodeAttribute -> doc -> route_node_attribute ->(?) route_node
    Attribute -> doc -> doc_attribute - > doc
    
    ==================================================================
    
    Client -> unit -> client -> unit?        !!!
           -> staff? -> client -> person     !!!
           
    Unit -> unit -> unit -> unit
    UnitComander -> unit -> unit_comander -> unit
    UnitPost -> unit -> unit_positions -> unit
    
    Unit_DocType -> unit -> unit_doc_types -> unit
    Unit_Route -> unit -> unit_routes -> unit
    Unit_Enumeration -> unit -> unit_enumeration -> unit
    
    */
    
    

var test_screen = [];
test_screen[0] = 'test_entity';
test_screen[1] = 'child_test1';
test_screen[2] = 'child_test2';

var sys = [];
sys[0] = 'country';
sys[1] = 'sys1';
sys[2] = 'sys2';

var rank = [];
rank[0] = 'rank';

var position = [];
position[0] = 'position';

var pass_doc_types = [];
pass_doc_types[0] = 'pass_doc_types';

var address_types =[];
address_types[0] = 'address_types';

var countries = [];
countries[0] = 'countries';

var region_types = [];
region_types[0] = 'region_types';

var regions = [];
regions[0] = 'regions';

var location_types = [];
location_types[0] = 'location_types';

var street_types = [];
street_types[0] = 'street_types';


var sex_types = [];
sex_types[0] = 'sex_types';

var screen_entities = {};
screen_entities['test_screen'] = test_screen;
screen_entities['sys'] = sys;
screen_entities['rank'] = rank;
screen_entities['pass_doc_types'] = pass_doc_types;
screen_entities['position'] = position;
screen_entities['address_types'] = address_types;
screen_entities['countries'] = countries;
screen_entities['region_types'] = region_types;
screen_entities['regions'] = regions;
screen_entities['location_types'] = location_types;
screen_entities['street_types'] = street_types;
screen_entities['sex_types'] = sex_types;



var properties_types = [];


properties_types['name'] = 'tiny_text';
properties_types['name_min'] = 'tiny_text';
properties_types['description'] = 'small_text';

/* pass_doc_types */
properties_types['seriesMask'] = 'tiny_text';
properties_types['numberMask'] = 'tiny_text';

/* address_types */
properties_types['priority'] = 'tiny_text';

/* countries */
properties_types['code'] = 'tiny_text';
properties_types['fullname'] = 'small_text';

/* ? many */
properties_types['shortname'] = 'tiny_text';



/* */

/*var test_rr = [
 {entity:'rank', screen:'base', name: '������', id: 151},
 {entity:'rank', screen:'base', name: '������', id: 153},
 {entity:'rank', screen:'base', name: '������', id: 154}
 ];*/
