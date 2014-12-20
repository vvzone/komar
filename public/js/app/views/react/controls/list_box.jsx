/** @jsx React.DOM */

define(
    'views/react/controls/list_box',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'event_bus'
    ],function($, React, ControlsMixin, EventBus){
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

                console.info('ListBox props');
                console.info(this.props);

                var items;
                (typeof this.props.items !='undefined')? items = this.props.items : items=[];

                console.log('size(items)'+_.size(items));
                console.log(items);
                if(_.size(items)>0){
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
                }else{
                    return(
                    <div className="list_box">
                        <div className="empty_list_box">Нет.</div>
                    </div>
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


/*
        var ListBoxAssync = React.createClass({
            callBack: function(callback){
                this.props.callback(callback);
            },
            render: function(){
                return(<ListBoxTwoSide items_left={this.props.item} />);
            }
        });*/

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
                //если сразу все ок.
                console.info('ListBoxTwoSide-> WILL MOUNT');
                console.log('this.props');
                console.log(this.props);
                if(_.size(this.props.items_left)> 0 && _.size(this.props.items_right)> 0){
                    this.calculateState(this.props.items_left, this.props.items_right);
                }
                /*if(_.size(new_props.items_left)> 0 && _.size(new_props.items_right)> 0){
                    this.calculateState(new_props.items_left, new_props.items_right);
                }*/
            },
            componentDidMount: function() {
                var arr_items_2_select = [];
                //всегда выполнять второй запрос только при удачном первом иначе голод и разруха
                console.info('ListBoxTwoSide-> DID MOUNT');
                /*console.log('this.props.items_left:');
                console.log(this.props.items_left);
                console.log('this.props.items_right:');
                console.log(this.props.items_right);*/

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
            calculateState: function(items_left, items_right){
                console.log('CALCULON!!!1');
                console.info('items_left');
                console.info(items_left);
                console.info('items_right');
                console.info(items_right);

                var sorted_by_id_items_left = {};
                if(typeof items_left != 'undefined'){
                    console.warn('items_left > 0, resort');
                    for(var new_id_left in items_left){
                        if(typeof items_left[new_id_left]['id'] == 'undefined'){
                            //throw error
                            console.error('В контрол ListBox переданы данные неверного формата');
                            //EventBus.trigger('error', 'Ошибка', 'В контрол ListBox переданы данные неверного формата');
                        }
                        console.warn(items_left[new_id_left]['id']);
                        sorted_by_id_items_left[items_left[new_id_left]['id']] = items_left[new_id_left];
                    }
                }
                console.info('sorted_by_id_items_left');
                console.info(sorted_by_id_items_left);

                //resort by id
                var sorted_by_id_items_right = {};
                if(typeof items_right != 'undefined'){
                    console.warn('items_right > 0, resort');
                    for(var new_id in items_right){
                        if(typeof items_right[new_id]['id'] == 'undefined'){
                            //throw error
                            console.error('В контрол ListBox переданы данные неверного формата');
                            //EventBus.trigger('error', 'Ошибка', 'В контрол ListBox переданы данные неверного формата');
                        }
                        sorted_by_id_items_right[items_right[new_id]['id']] = items_right[new_id];
                    }
                }
                console.info('sorted_by_id_items_right');
                console.info(sorted_by_id_items_right);

                //if(_.size(sorted_by_id_items_left) > 0 or _.size(sorted_by_id_items_right)>0){
                if(_.size(sorted_by_id_items_left) > 0 || _.size(sorted_by_id_items_right)>0){
                    for(var id in sorted_by_id_items_left){
                        console.warn('clear same id from sorted_by_id_items_right['+id+']='+sorted_by_id_items_right[id]['name']);
                        delete sorted_by_id_items_right[id];
                    }

                    this.setState({
                        items_left: sorted_by_id_items_left,
                        items_right: sorted_by_id_items_right
                    });
                }
            },
            componentWillReceiveProps: function(new_props){
                console.info('componentWillReceiveProps');
                console.warn(new_props);
                //if(_.size(new_props.items_left)> 0 && _.size(new_props.items_right)> 0){
                if(_.size(new_props.items_left)> 0 || _.size(new_props.items_right)> 0){
                    this.calculateState(new_props.items_left, new_props.items_right);
                }
            },
            render: function(){
                var combined = [];

                var state_items_left = this.state.items_left;
                var state_items_right = this.state.items_right;

                console.warn('ListBoxTwoSide, state.items_left:');
                console.warn(state_items_left);


                console.warn('ListBoxTwoSide, state.items_right:');
                console.warn(state_items_right);

                combined[0] =
                    <div className="list_box_container">
                        <label htmlFor="combo" >Текущие</label>
                        <ListBox key="combo" key_prefix="left" items={state_items_left} callback={this.listChange} type="left" />
                    </div>;
                combined[1] =
                    <div className="list_box_container">
                        <label htmlFor="combo-right" >Доступные</label>
                        <ListBox key="combo_right" key_prefix="right" items={state_items_right} callback={this.listChange} type="right" />
                    </div>;

                console.info('ListBoxTwoSide props');
                console.info(this.props);
                console.info('ListBoxTwoSide state');
                console.info(this.state);
                return(
                    <div className="form-group">
                    <label htmlFor="list_box_outer_container">{this.props.russian_name}</label>
                    <div className="list_box_outer_container">
                        <div className="two-way-list-box">{combined}</div>
                    </div>
                    </div>
                    )
            }
        });

        return ListBoxTwoSide;
    }
);

