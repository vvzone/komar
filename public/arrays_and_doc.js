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
    
    rank -> base -> rank -> rank
    post -> base -> position -> position
    
    person_post -> staff -> person_position_history -> person
    
    
    

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
 {entity:'rank', screen:'base', name: '������', id: 151},
 {entity:'rank', screen:'base', name: '������', id: 153},
 {entity:'rank', screen:'base', name: '������', id: 154}
 ];*/
