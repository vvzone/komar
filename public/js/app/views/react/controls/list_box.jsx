/** @jsx React.DOM */

define(
    'views/react/controls/controls',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin'
    ],function($, React, ControlsMixin){
        var ButtonListBoxLeft = React.createClass({
            handleClick: function (e) {
                var action = 'move_left';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonMoveLeft btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-left"></span></button> )
                }
                return ( <button className="ButtonMoveLeft btn btn-xs btn-link btn-block" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-left"></span></button> );
            }
        });

        var ButtonListBoxRight = React.createClass({
            handleClick: function (e) {
                var action = 'move_right';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonMoveRight btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-right"></span></button> )
                }
                return ( <button className="ButtonMoveRight btn btn-xs btn-link btn-block" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-right"></span></button> );
            }
        });


        /* ListBOX*/

        var ListBox = React.createClass({
            getInitialState: function() {
                return {
                    selected: []
                }
            },
            handleClickButton: function(action){
                var callback = [];
                callback['action'] = action;
                callback['id'] = this.state.selected;
                var callback_item=[];
                callback_item = this.props.items[callback['id']];
                callback['item'] = callback_item;
                this.props.callback(callback); //они оба передадут коллбэк
                console.log('listbox update');
                //this.forceUpdate();


                if(this.props.primary){
                    //this.props.callback(callback); //дописать условия коллбэка
                }
            },
            handleChange: function(event){
                this.setState({selected: event.target.value});
            },
            render: function(){
                var list_box_items=[];

                /*console.log('list-box whole array:');
                 console.info(this.props.items);*/

                for(var key in this.props.items){

                    /*console.info('key='+key);
                     console.info('this.props.items['+key+']:');
                     console.info(this.props.items[key]);*/

                    list_box_items.push(
                        <option
                        key={this.props.items[key]['id']}
                        value={this.props.items[key]['id']}
                        id={this.props.items[key]['id']}
                        onClick={this.handleClick}
                        >
                {this.props.items[key]['name']}
                        </option>
                    );
                }
                if(this.props.type == 'right'){
                    return( <div className="list_box">
                        <div className="list_box_select">
                            <select multiple="" size="10" onChange={this.handleChange}>{list_box_items}</select>
                        </div>
                        <div className="list_box_cp">
                            <ButtonListBoxLeft clicked={this.handleClickButton} />
                        </div>
                    </div>)
                }
                return(
                    <div className="list_box">
                        <div className="list_box_select">
                            <select multiple="" size="10" onChange={this.handleChange}>{list_box_items}</select>
                        </div>
                        <div className="list_box_cp">
                            <ButtonListBoxRight clicked={this.handleClickButton} />
                        </div>
                    </div>
                    )
            }
        });

        var ListBoxTwoSide = React.createClass({
            getInitialState: function() {
                return {
                    items_left: [],
                    items_right: []
                }
            },
            listChange: function(callback){
                var current_list = [];
                var target_list = [];
                if(callback['action']=='move_left'){
                    current_list = this.state.items_right;
                    target_list = this.state.items_left;
                }else{
                    current_list = this.state.items_left;
                    target_list = this.state.items_right;
                }

                delete current_list[callback['id']];
                target_list[callback['id']] = callback['item'];


                if(callback['action']=='move_left'){
                    this.setState({items_right: current_list});
                    this.setState({items_left: target_list});

                }else{
                    this.setState({items_left: current_list});
                    this.setState({items_right: target_list});
                }

                callback['entity'] = this.props.entity; //как вариант source_left - ибо всегда левый селект

                this.props.callback('ListBoxTwoSide callback:');
                this.props.callback(callback);
            },
            componentDidMount: function() {
                var arr_items_2_select = [];

                //всегда выполнять второй запрос только при удачном первом иначе голод и разруха

                $.get('http://zend_test/main/'+this.props.source_right, function(result) {
                    var arr = [];
                    for(var item in result.data){
                        arr[result.data[item]['id']] = result.data[item];
                    }
                    arr_items_2_select = arr;
                    this.setState({items_right: arr});

                    $.get('http://zend_test/main/'+this.props.source_left, function(result) {
                        var arr = [];
                        for(var item in result.data){
                            arr[result.data[item]['id']] = arr_items_2_select[result.data[item]['id']];
                        }
                        this.setState({items_left: arr});
                    }.bind(this));
                }.bind(this));

                //add listener because it's another table, so this is need to save separately, but with post current_id
                /*
                 * save:
                 * to source+left
                 * this.state.items_left
                 * for
                 * this.props.entity.current_id.id
                 *
                 * only add new, remove those who not send but in db on server-side
                 *
                 * */

            },
            saveListBox: function(){
                //триггер сейва формы

                var source = this.props.source_left;
                var post = [];
                post = this.state.items_left;

                var current_id = ''; //???!!!! position_id, какое поле?
                var url = '';
                url = 'http://zend_test/main/'+ source +'/save/';
            },
            render: function(){
                var combined = [];
                var items_left = this.state.items_left;
                var items_right = this.state.items_right;

                for(var id in items_left){
                    console.log('id='+id);
                    console.log('2 delete='+items_right[id]);
                    delete items_right[id];
                }
                combined[0] = <ListBox key="combo" key_prefix="left" items={items_left} callback={this.listChange} type="left" />;
                combined[1] = <ListBox key="combo_right" key_prefix="right" items={items_right} callback={this.listChange} type="right" />;

                console.info('LIST BOX PROPS');
                console.info(this.props);
                return(
                    <div className="two-way-list-box">{combined}</div>
                    )
            }
        });

        return ListBoxTwoSide;

    }
);

