/** @jsx React.DOM */
/* som base elements */

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
        this.props.clicked(this.props.item);
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

    whenClicked: function(){
        this.props.itemdisplay(this.props.item.id);
    },
    whenClickedCP: function(action){
        var itaction = [];
        itaction['action'] = action;
        itaction['id'] = this.props.item.id;
        //console.log('whenClicked'+itaction['action']+' action[id]='+ itaction['id']);
        this.props.itemaction(itaction);
    },
    render: function(){
        var delete_key= 'delete/'+this.props.item.id;
        var edit_key= 'edit/'+this.props.item.id;
        return(
            <div className="item">
                <div className="item_name"><ItemLink item={this.props.item} clicked={this.whenClicked} /></div>
                <div className="item_cp">
                    <ButtonEdit clicked={this.whenClickedCP} id={this.props.item.id} key={edit_key}/>
                    <ButtonDelete clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key}/>
                </div>
            </div>
            )
    }
});


