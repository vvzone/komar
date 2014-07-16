/** @jsx React.DOM */
/* som base elements */

var ErrorMsg = React.createClass({
    render: function () {
        //class="btn btn-sm btn-warning">
        var message = '';
        var header = '';
        (this.props.header == undefined)? header= 'Ошибка' : header = this.props.header;
        (this.props.msg == undefined)? message= 'Неизвестная ошибка': message = this.props.msg;

        return (
            <div className="alert alert-error">
                <a href="#" className="close" data-dismiss="alert">&times;</a>
                <strong>{header}</strong>
                <br />{message}
            </div>
            );
    }
});


var ButtonEditMini = React.createClass({
    handleClick: function (e) {
        var action = 'edit';
        this.props.clicked(action);
    },
    render: function () {
        //class="btn btn-sm btn-warning">
        return ( <button className="ButtonEdit btn btn-xs btn-warning" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span></button> );
    }
});

var ButtonEdit = React.createClass({
    handleClick: function (e) {
        var action = 'edit';
        this.props.clicked(action);
    },
    render: function () {
        //class="btn btn-sm btn-warning">
        return ( <button className="ButtonEdit btn btn-xs btn-warning" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span>  Редактировать</button> );
    }
});

var ButtonDeleteMini = React.createClass({
    handleClick: function (e) {
        var action = 'delete';
        this.props.clicked(action);
    },
    render: function () {
        //class="btn btn-xs btn-danger"> Удалить</a>
        return ( <button className="ButtonDelete btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span></button> );
    }
});


var ButtonDelete = React.createClass({
    handleClick: function (e) {
        var action = 'delete';
        this.props.clicked(action);
    },
    render: function () {
        //class="btn btn-xs btn-danger"> Удалить</a>
        return ( <button className="ButtonDelete btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span>  Удалить</button> );
    }
});


var ItemLink = React. createClass({
    /*
     * props: name, clicked(), id
     *
     * */

    handleClick: function(e){
        e.preventDefault();
        this.props.onClick(this.props.item);
    },
    render: function(){
        return(<a href={this.props.item.id} onClick={this.handleClick}>{this.props.item.name}</a>)
    }
});


var ListItems = React.createClass({
    /*
     * <ListItem item=[] key='' action={this.whenListItemsAction} />
     * props:
     * item = []; required: 'name', 'id'
     * key - unique;
     * */
    getInitialState: function() {
        return {
            item: this.props.item,
            item_dependencies: []
        }
    },
    whenClicked: function(){
        this.props.itemdisplay(this.props.item.id);
    },
    whenClickedCP: function(action){
        var itaction = [];
        itaction['action'] = action;
        itaction['id'] = this.props.item.id;
        console.log('whenClicked'+itaction['action']+' action[id]='+ itaction['id']);

        if(action == 'edit'){
            /*$.get('http://zend_test/main/index/'+this.props.source, function(result) {
                this.setState({items: result});
            }.bind(this));*/
            this.setState({item_dependencies: this.props.dependencies});
            console.log('dependencies='+this.props.dependencies);
        }
        //this.props.itemaction(itaction);
    },
    render: function(){
        var delete_key= 'delete/'+this.props.item.id;
        var edit_key= 'edit/'+this.props.item.id;

        console.log(this.state);
        var item_dependencies = [];
        var self=this;
        item_dependencies = this.state.item_dependencies.map(function(item){

            //console.log('this.props.item.id'+this.props.item.id);
            var key = self.state.item.id+'_'+item;
            return(<EntityBlock entity_name={item} host_id={self.state.item.id} key={key}/>)
            //console.log(item);
        });
        if(this.props.non_base == "true"){
            return(
                <div className="item">
                    <div className="item_name" onClick={this.whenClicked}><ItemLink item={this.props.item} clicked={this.whenClicked} /></div>
                    <div className="item_cp">
                        <ButtonDeleteMini clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key}/>
                    </div>
                </div>
                )
        }
        return(
            <div className="item">
                <div className="item_name" onClick={this.whenClicked}><ItemLink item={this.props.item} clicked={this.whenClicked} /></div>
                <div className="item_cp">
                    <ButtonEdit clicked={this.whenClickedCP} id={this.props.item.id} key={edit_key}/>
                    <ButtonDelete clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key}/>
                </div>
                {item_dependencies}
            </div>
            )
    }
});


var MainList = React. createClass({
    /* Props
     *
     * source - server data-controller action (entity)
     * */
    getInitialState: function() {
        return {
            items: []
        }
    },
    componentDidMount: function() {
        $.get('http://zend_test/main/index/'+this.props.source, function(result) {
            this.setState({items: result});
        }.bind(this));
    },
    whenListItemsClick: function(id){
        //somehow call MainScreen width cur id
        //this.props.itemclick(id);
        //??? really need?
        console.log(' whenListItemsClick'+ id);
    },
    whenListItemsAction: function(action){
        /* 2do
         *  action 2 ajax
         * */

        console.warn('whenListItemsCpAction'+ action['action']+' k='+action['id']);


        //$.get('http://zend_test/main/index/no', function(result){
        $.get('http://zend_test/main/index/yes', function(result){
            if(result['response'] == true){
                alert('Success');
            }else{
                alert('Error');
            }
        });
    },
    render: function(){
        var items_arr = this.state.items;
        var output =[];

        var self = this;

        for(var item in items_arr){
            console.log(items_arr[position]);

            console.log('MainList: '+this.props.dependencies);
            output.push(
                <ListItems item={items_arr[item]} key={items_arr[item].id}
                itemaction={self.whenListItemsAction} itemdisplay={self.whenListItemsClick}
                dependencies={this.props.dependencies}
                non_base={this.props.non_base} />);
        }

        return(
            <div className="MainList">{output}</div>
            )
    }
});
