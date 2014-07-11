/** @jsx React.DOM */    
    /*
    * base - Базовые определения: звания, должности, типы документов
    *   --> rank - звания
    *   --> position - должность + соотв
    *   --> pass_doc_types
    *   --> sys - основные настройки: страны, сокр. пол,
    *   --> sys_docs - основные настройки документов
    *   --> address - тип адреса
    *   --> unit_lead_types
    *   -->
    * staff - Персонал
    *   --> person - личная карточка + история званий, должностей, адрес, роль,
    *   --> pass_docs
    *   -->
    *   -->
    *   -->
    * doc - Документы
    *   --> person_document
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    * unit - Подразделение
    *   --> client
    *   --> unit
    *   --> unit_lead
    *   -->
     *  -->
    * */
    
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
    (?)DocTypeArrtibute -> base -> doc_attribute_types -> sys_docs
    (!!???)Enumeration -> unit -> enumaration -> sys_docs
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
    
    Client -> unit -> client -> unit?        !!!!!!!!!!!!
           -> staff? -> client -> person     !!!!!!!!!!!!
           
    Unit -> unit -> unit -> unit
    UnitComander -> unit -> unit_comander -> unit
    UnitPost -> unit -> unit_positions -> unit
    
    Unit_DocType -> unit -> unit_doc_types -> unit
    Unit_Route -> unit -> unit_routes -> unit
    Unit_Enumeration -> unit -> unit_enumeration -> unit
    
    
    
    

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
position[1] = 'rank_position';

var screen_entities = {};

screen_entities['test_screen'] = test_screen;
screen_entities['sys'] = sys;
screen_entities['rank'] = rank;
screen_entities['position'] = position;


/*var test_rr = [
 {entity:'rank', screen:'base', name: 'Звания', id: 151},
 {entity:'rank', screen:'base', name: 'Звания', id: 153},
 {entity:'rank', screen:'base', name: 'Звания', id: 154}
 ];*/
