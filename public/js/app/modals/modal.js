/** @jsx React.DOM */

var ModalWindowAdd = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Добавить', handler: this.handleDoingNothing},
            {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Новая запись в "; //+this.entity.name;

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring
            <ModalWindowBase
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            >
                <p>I'm the content.</p>
                <p>That's about it, really.</p>
            </ModalWindowBase>
            );

    }
});

var ModalWindowEdit = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    throwSave: function(){
        var customEvent = new CustomEvent("saveButtonClick",  {
            detail: {id: this.props.current_id},
            bubbles: true
        });
        this.getDOMNode().dispatchEvent(customEvent);
    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Сохранить', handler: this.throwSave},
            {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Редактировать "; //+this.entity.name;

        console.log('modal and current:');
        console.log(this.props.current_id);

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring

            <ModalWindowBase
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            >
                <EntityBlock entity_name={this.props.entity} item={this.props.current_id} />
            </ModalWindowBase>
            );

    }
});

var ModalWindowDelete = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    throwDelete: function(){

    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Удалить', handler: this.throwDelete},
            {type: 'default', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Вы уверены?"; //+this.entity.name;

        console.log('Delete');
        console.log(this.props);

        var msg = "Будет удален обьект «" +  this.props.item.name + "»";
        if(this.props.item.childNodes){
            var childs = '';
            /*var childNodes = this.props.item.childNodes;
            console.log('this.props.item.childNodes');
            console.log(this.props.item.childNodes);
            for(var key in childNodes){

                childs = childs + childNodes[key].name +', ';
            }*/
            //msg = msg + 'Следующие дочерние обьекты будут удалены: '+childs;
            msg = msg + ', а также все дочерние обьекты.';
        }else{
            msg = msg + '.'
        }

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring
            <ModalWindowDeleteConfirmation
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            msg={msg}
            >
            </ModalWindowDeleteConfirmation>
            );
    }
});

var ModalWindowBase = React.createClass({
    mixins: [BootstrapModalMixin],
    componentDidMount: function() {
        this.show();
    },
    render: function () {
        var buttons = this.props.buttons.map(function (button) {
            return (
                <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                </button>
                );
        });
        return(
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                             {this.renderCloseButton()}
                            <strong>{this.props.header}</strong>
                        </div>
                        <div className="modal-body">
                        {this.props.children}
                        </div>
                        <div className="modal-footer">
                       {buttons}
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});


var ModalWindowDeleteConfirmation = React.createClass({
    mixins: [BootstrapModalMixin],
    componentDidMount: function() {
        this.show();
    },
    render: function () {
        var buttons = this.props.buttons.map(function (button) {
            return (
                <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                </button>
                );
        });

        var msg ='';
        if(this.props.msg){
            msg = <div className="modal-body">
                     {this.props.msg}
                </div>;
        }
        return(
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content alert-warning">
                        <div className="modal-header">
                             {this.renderCloseButton()}
                            <strong>{this.props.header}</strong>
                        </div>
                        {msg}
                        <div className="modal-footer">
                       {buttons}
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});

