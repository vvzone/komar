/** @jsx React.DOM */

define(
    'views/react/controls/list_box',
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

                console.info('ListBox->handle:');
                console.log('this.props.items');
                console.log(this.props.items);
                console.log('callback[id]');
                console.log(callback['id']);
                console.log('callback_item = this.props.items['+callback['id']+']');
                console.log(callback_item);
                callback['item'] = callback_item;

                this.props.callback(callback); //они оба передадут коллбэк
                console.log('listbox update');
                //this.forceUpdate();


                if(this.props.primary){
                    //this.props.callback(callback); //дописать условия коллбэка
                }
            },
            handleChange: function(event){
                console.info('selected');
                console.info(event.target);
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

                console.log('listChange -> callback[id]:'+callback['id']);
                console.info('callback:');
                console.log(callback);

                // чо за херня какой то бред - не бред, удаление из списка при мув-лефт-райт
                console.log('delete from current_list['+callback['id']+']');
                console.log('current_list:');
                console.log(current_list);
                console.log('target_list['+callback['id']+']='+callback['item']+' (callback[item])');
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


                var callback_new = [];
                console.info('ListBoxTwoSide > listChange: available props');
                console.log(this.props);

                var desorted_array = [];
                for(var key in this.state.items_left){
                    desorted_array.push(this.state.items_left[key]);
                }
                callback_new[this.props.name] = desorted_array;
                //this.props.callback('ListBoxTwoSide callback:');
                this.props.callback(callback_new);
            },
            componentWillMount: function() {
                var arr_items_2_select = [];
                //всегда выполнять второй запрос только при удачном первом иначе голод и разруха
                console.info('ListBoxTwoSide->mounting...');
                console.log('this.props.items_left:');
                console.log(this.props.items_left);
                console.log('this.props.items_right:');
                console.log(this.props.items_right);

                var items_left = this.props.items_left;
                var items_right = this.props.items_right;

                var sorted_by_id_items_left = {};
                for(var new_id_left in items_left){
                    sorted_by_id_items_left[items_left[new_id_left]['id']] = items_left[new_id_left];
                }

                //resort by id
                var sorted_by_id_items_right = {};
                for(var new_id in items_right){
                    sorted_by_id_items_right[items_right[new_id]['id']] = items_right[new_id];
                }

                for(var id in sorted_by_id_items_left){
                    console.warn('clear same id from sorted_by_id_items_right['+id+']='+sorted_by_id_items_right[id]['name']);
                    delete sorted_by_id_items_right[id];
                }

                this.setState({
                    items_left: sorted_by_id_items_left,
                    items_right: sorted_by_id_items_right
                });

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

            },
            render: function(){
                var combined = [];
                var items_left = this.state.items_left;
                var items_right = this.state.items_right;

                combined[0] = <ListBox key="combo" key_prefix="left" items={items_left} callback={this.listChange} type="left" />;
                combined[1] = <ListBox key="combo_right" key_prefix="right" items={items_right} callback={this.listChange} type="right" />;

                console.info('ListBox props');
                console.info(this.props);
                return(
                    <div className="two-way-list-box">{combined}</div>
                    )
            }
        });

        return ListBoxTwoSide;

    }
);

