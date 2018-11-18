var ListItem = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var data = {};
        data.isChecked = this.props.itemDetail.isChecked;
        data.text = this.props.itemDetail.text;
        this.setState(data);


    },
    deleteItem: function () {
        this.props.deleteItem(this);
    },
    toggleCheck: function () {
        if (this.state.isChecked) {
            this.state.isChecked = false;
        } else {
            this.state.isChecked = true;
        }
        this.props.toggleCheck(this);
    },
    render: function () {
        var cx = React.addons.classSet;
        const listItemClassesObject = {
            'is-selected': this.state.isChecked,
            'ms-ListItem': true,
            'is-unread': !this.state.isChecked,
            'is-selectable': true,
            'ms-u-fadeIn500': true,
            'adjustCheckIconPosition': true,
            'ms-bgColor-white': true,
            'whiteBackground': true,
            'ms-borderColor-green !important': true
        };

        var listItemClasses = cx(listItemClassesObject);
        var listItemDeleteButtonClassesObject = {
            'ms-Icon': true,
            'ms-Icon--xCircle': true,
            'ms-font-l': true
            
        }
        Utilities.addThemeColorFontToCssClassObject(listItemDeleteButtonClassesObject);
        var listItemDeleteButtonClasses = cx(listItemDeleteButtonClassesObject);
       

        let listHeadingCssClassObjects = {
            'ms-TextField-field': true
        };

        
        var listItemTextClasses = cx({
            'ms-ListItem-tertiaryTextCustom': true,
            'strike-through': this.state.isChecked
        });

        return (
            <div className="ms-Grid-row">
                <ul className="ms-List ">
                    <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1"></div>
                    <div className="ms-Grid-col ms-u-sm12 ms-u-md10 ms-u-lg12 ">
                        <div className={listItemClasses}>
                            <div onClick={this.toggleCheck} className="ms-ListItem-selectionTarget js-toggleSelection shot-list-checkbox"></div>
                            <span className="ms-bgColor-green"></span>
                            <span className={listItemTextClasses}>{this.state.text} </span>
                            <div className="ms-ListItem-actions adjustDeleteIconPosition">
                                <div className="ms-ListItem-action"><i title="Delete This Item" onClick={this.deleteItem} className={listItemDeleteButtonClasses}></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1"></div>
                </ul>
            </div>
        );
    }
});
var List = React.createClass({
    getInitialState: function () {
        return {
            listName: "My ToDo List",
            listItems: [],
            counter: 0
        };
    },
    clearListSubscriber: function (msg, data) {
        this.setState(this.getInitialState());
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(this.state));
    },
    componentDidMount: function () {
        var context = this;

        // check if office is present then get the state from it else set it from localStorage
        Office.initialize = function (reason) {

            var previousState = StorageLibrary.getValueFromStorage(CONSTANTS.LIST_STATE_KEY);
            context.setState(JSON.parse(previousState));
        };
        this.token = PubSub.subscribe(CONSTANTS.CLEAR_LIST_ACTION_TRIGGER_KEY, this.clearListSubscriber);


    },
    addItem: function (item) {
        var textValue = item.value ? item.value.trim() : null;

        /*If List item is empty then return*/
        if (!textValue) {
            console.warn("Empty Item was tried to be inserted");
            return;
        }
        var counter = this.state.counter + 1;
        var listItem = {
            isChecked: false,
            text: textValue,
            key: counter
        };
        var newItems = this.state.listItems.concat(listItem);
        var newState = this.state;
        newState.listItems = newItems;
        newState.counter = counter;
        this.setState(newState);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(newState));
    },
    changeListName: function (element) {
        var newState = this.state;
        newState.listName = element.value;
        this.setState(newState);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(this.state));
    },
    deleteItem: function (element) {
        var index = this.state.listItems.indexOf(element.props.itemDetail);
        var length = this.state.listItems.length;
        var newState = this.state;
        if (length === 1 && index === 0) {
            newState.listItems = [];
        } else {
            var oldStateItems = this.state.listItems;
            var deletedItem = oldStateItems.splice(index, 1);
            newState.listItems = oldStateItems;
        }
        this.setState(newState);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(newState));
    },
    toggleCheck: function (item) {
        var index = this.state.listItems.indexOf(item.props.itemDetail);
        var oldStateItems = this.state;
        var newList = oldStateItems;

        newList.listItems[index] = item.state;
        this.setState(newList);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(newList));
    },
    reRenderForSavedState: function (savedState) {
        this.setState(savedState);
    },
    render: function () {
        var context = this;
        var uncheckedItemInList = this.state.listItems.map(function (item) {
            if (!item.isChecked) {
                return (<ListItem key={item.key} deleteItem={context.deleteItem} toggleCheck={context.toggleCheck} itemDetail={item} />);
            }
        });
        var checkedItemInList = this.state.listItems.map(function (item) {
            if (item.isChecked) {
                return (<ListItem key={item.key} deleteItem={context.deleteItem} toggleCheck={context.toggleCheck} itemDetail={item} />);
            }
        });


        return (
            <div>
                <div className="TodoList ">
                    <div className="ms-Grid">
                        <div className="ms-Grid-row ">
                            <div className="ms-Grid-col ms-u-sm12 ms-u-md10 ms-u-lg12 ">
                                <br />
                            </div>
                        </div>
                        <ListHeading key={context.state.listName} changeListName={context.changeListName} listName={context.state.listName}/>
                        <ListAddTextBox key="ListAddTextBox" addItem={context.addItem} />
                        {uncheckedItemInList}
                        {checkedItemInList}
                    </div>
                </div>
            </div>
        );
    }
});
var ListAddTextBox = React.createClass({
    getInitialState: function () {
        return {
            submitBtnClasses: "btn btn-link pull-right hide"
        };
    },
    showSubmitBtn: function () {
        this.setState({
            submitBtnClasses: "btn btn-link pull-right show"
        });
    },
    hideSubmitBtn: function () {
        var listItemInput = React.findDOMNode(this.refs.listItemInput);
        if (listItemInput.value == "") {
            this.setState({
                submitBtnClasses: "btn btn-link pull-right hide"
            });
        }
    },
    render: function () {

        var cx = React.addons.classSet;
        let addButtonCssClassObjects = {
            'action-btn-on-text-field': true
        };
        Utilities.addThemeFieldToThemeClassObject(addButtonCssClassObjects);
        let addButtonCssClass = cx(addButtonCssClassObjects);

        return (<form onSubmit={this.addItemToList}>

            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1"> <br/> </div>
                <div className="ms-Grid-col ms-u-sm12 ms-u-md10 ms-u-lg12 ">
                    <div className="ms-TextField">
                        <input ref="listItemInput" className="ms-TextField-field" type="text" />
                        <span className="ms-TextField-description"></span>
                        <button className={addButtonCssClass}><i className="ms-Icon ms-Icon--plus"></i></button>
                    </div>
                </div>
                <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1"></div>
            </div>


        </form>);
    },
    addItemToList: function (event) {
        event.preventDefault();
        var listItemInput = React.findDOMNode(this.refs.listItemInput);
        this.props.addItem(listItemInput);
        listItemInput.value = "";
        listItemInput.focus();
        return false;
    }
});
var ListHeading = React.createClass({
    getInitialState: function () {
        return {
            submitBtnClasses: "action-btn-on-text-field-listName hide"
        };
    },
    componentDidMount: function () {
         var listName = React.findDOMNode(this.refs.listNameElement);
         listName.value = this.props.listName;
        
    },
    showSubmitBtn: function () {
        this.setState({
            submitBtnClasses: "action-btn-on-text-field-listName show"
        });
    },
    hideSubmitBtn: function () {
        var listName = React.findDOMNode(this.refs.listNameElement);
        if (listName.value == this.props.listName) {
            this.setState({
                submitBtnClasses: "action-btn-on-text-field-listName hide"
            });
        }
    },
    render: function () {

        var cx = React.addons.classSet;
        let listHeadingCssClassObjects = {
            'ms-TextField-field': true
        };
        Utilities.addThemeFieldToThemeClassObject(listHeadingCssClassObjects);
        let listHeadingCssClass = cx(listHeadingCssClassObjects);

        return (

            <form onSubmit={this.changeListName} placeholder="Enter List Name"  onBlur={this.changeListName}>

                <div className="ms-Grid-row">
                    
                    <div className="ms-Grid-col ms-u-sm12 ms-u-md10 ms-u-lg12 ">
                        <div>
                            <input id="list-name-input-field" ref="listNameElement" className={listHeadingCssClass} type="text" />
                            <span className="ms-TextField-description"></span>
                        </div>
                    </div>
                </div>
            </form>

            );
         
    },
    changeListName: function (event) {
        event.preventDefault();
        var listName = React.findDOMNode(this.refs.listNameElement);
        this.props.changeListName(listName);
        listName.blur();
    }
});
var ListPannel = React.createClass({
    render: function () {
        return (<div>

            <List />

        </div>);
    }
});
var NavBar = React.createClass({
    componentDidMount: function () {

        this.token = PubSub.subscribe(CONSTANTS.DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON, this.handleSubscription);

    },
    handleSubscription: function (event, message) {
        if (event === CONSTANTS.DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON && message === CONSTANTS.OK_MESSAGE_VALUE) {
            PubSub.publish(CONSTANTS.CLEAR_LIST_ACTION_TRIGGER_KEY, CONSTANTS.CLEAR_LIST_ACTION_MESSAGE);
        } else if (event === CONSTANTS.DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON && message === CONSTANTS.CLEAR_MESSAGE_VALUE) {
            //NOP
        }

    },
    triggerClearList: function () {

        // the convention is to publish message with event and pass the component name as the second parameter
        MessageToDialogBox.MessageTriggerElement = CONSTANTS.DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON;
        MessageToDialogBox.MessageHeading = "Delete the entire list?"
        MessageToDialogBox.MessageBodyContent = "Are you sure that you want to delete the entire list content? <br/> Click OK to confirm or CANCEL to cancel the action";
        PubSub.publish(CONSTANTS.DLALOG_MESSAGE_TRIGGER_KEY, MessageToDialogBox);
    },
    render: function () {

        var cx = React.addons.classSet;
        let navBarClassesObject = {
            "ms-Grid": true,
            "ms-u-fadeIn500": true
        };
        Utilities.addThemeFieldToThemeClassObject(navBarClassesObject);
        var navBarClasses = cx(navBarClassesObject);

        return (
            <div id="NavBar" className={navBarClasses} style={{ height: 3 + 'em' }}>
                <div className="ms-Grid-row" style={{ height: 100 + '%' }}>
                    <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">

                    </div>
                    <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">

                    </div>
                    <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">

                    </div>

                    <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">

                    </div>

                    <div className="ms-Grid-col ms-u-sm2 ms-u-md2 ms-u-lg2">
                        <button style={{ margin: 0.5 + 'em ' + 0 }} title="Delete All Items" onClick={this.triggerClearList} className="ms-Button ms-Button--hero ms-fontColor-themeLight--hover">
                            <span> <i className="ms-Icon ms-Icon--trash ms-font-xxl ms-fontColor-themeLighterAlt" aria-hidden="true"></i></span>
                        </button>
                    </div>
                   
                </div>
            </div>
        );

    }
});

var DialogBox = React.createClass({
    componentDidMount: function () {
        var DialogElements = document.querySelectorAll(".ms-Dialog");
        
        if ($.fn.Dialog) {
            $(".ms-Dialog").Dialog();
         }

        this.token = PubSub.subscribe(CONSTANTS.DLALOG_MESSAGE_TRIGGER_KEY, this.showDialogBox);
    },
    showDialogBox: function (message, envokingPublisherMessage) {
        this.envokingPublisher = envokingPublisherMessage.MessageTriggerElement;
        this.MessageBodyContent = envokingPublisherMessage.MessageBodyContent;
        var MessageHeading = React.findDOMNode(this.refs.MessageDialogBoxHeading);
        MessageHeading.innerHTML  = envokingPublisherMessage.MessageHeading;
        var MessageBodyContent = React.findDOMNode(this.refs.MessageDialogBoxContent);
        MessageBodyContent.innerHTML = envokingPublisherMessage.MessageBodyContent;
        //TODO: get element by id and not by list
        $(".ms-Dialog").Dialog().show();
    },
    publishOkResponse: function () {
        PubSub.publish(this.envokingPublisher, CONSTANTS.OK_MESSAGE_VALUE);
    },
    publishCancelResponse: function () {
        PubSub.publish(this.envokingPublisher, CONSTANTS.CANCEL_MESSAGE_VALUE);
        this.envokingPublisher = null;
        $(".ms-Dialog").Dialog().hide();
    },
    render: function () {

      
        return (
            
            <div className="ms-Dialog">
                <div className="ms-Overlay"></div>
                <div className="ms-Dialog-main">
                    <button className="ms-Dialog-button ms-Dialog-button--close">
                        <i className="ms-Icon ms-Icon--x"></i>
                    </button>
                    <div className="ms-Dialog-header">
                        <p className="ms-Dialog-title" ref="MessageDialogBoxHeading"></p>
                    </div>
                    <div className="ms-Dialog-inner">
                        <div className="ms-Dialog-content">
                            <p className="ms-Dialog-subText" ref="MessageDialogBoxContent"></p>
                        </div>
                        <div className="ms-Dialog-actions">
                            <div className="ms-Dialog-actionsRight">
                                <button className="ms-Dialog-action on ms-Button ms-Button--primary ms-bgColor-green" onClick={this.publishOkResponse}>
                                    <span className="ms-Button-label">OK</span>
                                </button>
                                <button className="ms-Dialog-action ms-Button" onClick={this.publishCancelResponse}>
                                    <span className="ms-Button-label">Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>     
        
       );
    }

});
var App = React.createClass({

    render: function () {
        return (<div>
            <NavBar />
            <div className="container">
                <ListPannel />
            </div>
            <DialogBox/>
        </div>);
    }
});
React.render(<App />, document.getElementById("app"));