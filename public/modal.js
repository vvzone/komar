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
    render: function(){
        var buttons = [
            {type: 'success', text: 'Сохранить', handler: this.handleDoingNothing},
            {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Редактировать "; //+this.entity.name;

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
            {this}
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
    render: function(){
        var buttons = [
            {type: 'success', text: 'Удалить', handler: this.handleDoingNothing},
            {type: 'default', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Вы уверены?"; //+this.entity.name;

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring
            <ModalWindowDeleteConfirmation
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
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

        return(
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content alert-warning">
                        <div className="modal-header">
                             {this.renderCloseButton()}
                            <strong>{this.props.header}</strong>
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


var DrawLines =  React.createClass({
    getInitialState: function() {
        return {
            host: '',
            childs: []
        }
    },
    componentDidMount: function() {
        this.setState({
            host: this.props.host,
            childs: this.props.childrens
        });
    },
    render: function(){
        return(
            <Line start={start} end={end} />
            );
    }

});


var Line =  React.createClass({
    render: function(){
        
        return(

        );
    }

});