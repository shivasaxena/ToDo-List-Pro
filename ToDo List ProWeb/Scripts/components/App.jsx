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
        console.log("called");
        if (this.state.isChecked) {
            this.state.isChecked = false;
        } else {
            this.state.isChecked = true;
        }
        this.props.toggleCheck(this);
    },
    render: function () {
        var cx = React.addons.classSet;
        var listItemClasses = cx({
            'is-selected': this.state.isChecked,
            'ms-ListItem': true,
            'is-unread': !this.state.isChecked,
            'is-selectable': true,
            'ms-u-fadeIn500': true,
            'adjustCheckIconPosition': true,
            'ms-bgColor-white': true,
            'whiteBackground': true
        });
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
                            <span className="ms-ListItem-secondaryText"></span>
                            <span className={listItemTextClasses}>{this.state.text} </span>
                            <div className="ms-ListItem-actions adjustDeleteIconPosition">
                                <div className="ms-ListItem-action"><i onClick={this.deleteItem} className="ms-Icon ms-Icon--trash"></i></div>
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
            listName: "",
            listItems: [],
            counter: 0
        };
    },
    clearListSubscriber: function (msg, data) {
        console.log(msg, data)
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
        var textValue = item.value;
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
        return (<form onSubmit={this.addItemToList}>

            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm1 ms-u-md1 ms-u-lg1"></div>
                <div className="ms-Grid-col ms-u-sm12 ms-u-md10 ms-u-lg12 ">
                    <div className="ms-TextField">
                        <input ref="listItemInput" className="ms-TextField-field" type="text" />
                        <span className="ms-TextField-description"></span>
                        <button className="action-btn-on-text-field"><i className="ms-Icon ms-Icon--plus"></i></button>
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
            submitBtnClasses: "btn btn-link pull-right hide"
        };
    },
    componentDidMount: function () {
        /* var listName = React.findDOMNode(this.refs.listNameElement);
         listName.value = this.props.listName;
         */
    },
    showSubmitBtn: function () {
        this.setState({
            submitBtnClasses: "btn btn-link pull-right show"
        });
    },
    hideSubmitBtn: function () {
        var listName = React.findDOMNode(this.refs.listNameElement);
        if (listName.value == this.props.listName) {
            this.setState({
                submitBtnClasses: "btn btn-link pull-right hide"
            });
        }
    },
    render: function () {
        /*TODO: Enhance this*/
        return (<div></div>);
        /* return (<div className="panel-heading">
 
                         <form onSubmit={this.changeListName}>
 
                             <input type="text" ref="listNameElement" className="form-control" placeholder="Enter List Name" onFocus={this.showSubmitBtn} onBlur={this.hideSubmitBtn} />
                              <button className={this.state.submitBtnClasses} type="submit">
                                 <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                              </button>
                         </form>
         </div>);
         */
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
    },
    triggerClearList: function () {

        PubSub.publish(CONSTANTS.CLEAR_LIST_ACTION_TRIGGER_KEY, CONSTANTS.CLEAR_LIST_ACTION_TRIGGER_MESSAGE);
    },
    render: function () {
        return (
            <div className="ms-Grid ms-bgColor-themePrimary ms-u-fadeIn500" style={{ height: 3 + 'em' }}>
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
                        <button style={{ margin: 0.5 + 'em ' + 0 }} title="Clear List" onClick={this.triggerClearList} className="ms-Button ms-Button--hero ms-fontColor-themeLight--hover">
                            <span class="ms-Button-icon"> <i className="ms-Icon ms-Icon--xCircle ms-font-xxl ms-fontColor-themeLighterAlt" aria-hidden="true"></i></span>
                        </button>
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
        </div>);
    }
});
React.render(<App />, document.getElementById("app"));