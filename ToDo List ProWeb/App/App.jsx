var ListItem = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        var data = {};
        data.isChecked = this.props.itemDetail.isChecked;
        data.text = this.props.itemDetail.text;
        this.setState(data);
    },
    deleteItem: function() {
        this.props.deleteItem(this);
    },
    toggleCheck: function() {
        if(this.state.isChecked) {
            this.state.isChecked = false;
        } else {
            this.state.isChecked = true;
        }
        this.props.toggleCheck(this);
    },
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'strike-through': this.state.isChecked
        });
        return(
            <li className="list-group-item">


                        <input checked={this.state.isChecked} onClick={this.toggleCheck} type="checkbox" aria-label="..." />

                        <button className="btn btn-sm btn-link" onClick={this.deleteItem} type="button">
                            <span className="glyphicon glyphicon-remove " aria-hidden="true"></span>
                        </button>
                        <span className={classes}>{this.state.text}</span>



            </li>
        );
    }
});
var List = React.createClass({
    getInitialState: function() {
        return {
            listName: "",
            listItems: [],
            counter: 0
        };
    },
    componenetDidUpdate: function(){
       
    },
    componentDidMount: function() {
        var context = this;
       
        // check if office is present then get the state from it else set it from localStorage
        Office.initialize = function(reason) {
           
            var previousState = StorageLibrary.getValueFromStorage(CONSTANTS.LIST_STATE_KEY);
            context.setState(JSON.parse(previousState));
        };
       

    },
    addItem: function(item) {
        var textValue = item.value;
        /*If List item is empty then return*/
        if(!textValue) {
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
    changeListName: function(element) {
        var newState = this.state;
        newState.listName = element.value;
        this.setState(newState);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(this.state));
    },
    deleteItem: function(element) {
        var index = this.state.listItems.indexOf(element.props.itemDetail);
        var length = this.state.listItems.length;
        var newState = this.state;
        if(length === 1 && index === 0) {
            newState.listItems = [];
        } else {
            var oldStateItems = this.state.listItems;
            var deletedItem = oldStateItems.splice(index, 1);
            newState.listItems = oldStateItems;
        }
        this.setState(newState);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(newState));
    },
    toggleCheck: function(item) {
        var index = this.state.listItems.indexOf(item.props.itemDetail);
        var oldStateItems = this.state;
        var newList = oldStateItems;

        newList.listItems[index] = item.state;
        this.setState(newList);
        StorageLibrary.saveValueIntoStorage(CONSTANTS.LIST_STATE_KEY, JSON.stringify(newList));
    },
    reRenderForSavedState: function(savedState) {
        this.setState(savedState);
    },
    render: function() {
        var context = this;
        var listLeftItemsElements = this.state.listItems.map(function(item) {
            if(!item.isChecked) {
                return(<ListItem key={item.key} deleteItem={context.deleteItem} toggleCheck={context.toggleCheck} itemDetail={item} />);
            }
        });
        var listDoneItemsElements = this.state.listItems.map(function(item) {
            if(item.isChecked) {
                return(<ListItem key={item.key} deleteItem={context.deleteItem} toggleCheck={context.toggleCheck} itemDetail={item} />);
            }
        });
        return(
            <div id="list" className="panel panel-primary">
               <ListHeading key={context.state.listName} className="panel-title" changeListName={context.changeListName} listName={context.state.listName} />

                <div>
                   <React.addons.CSSTransitionGroup transitionName="fade" transitionAppear={false} className="list-group" component='ul'>

                        <ListAddTextBox key="ListAddTextBox" addItem={context.addItem} />
                       {listLeftItemsElements}
                       {listDoneItemsElements}

                   </React.addons.CSSTransitionGroup>
                </div>
            </div>
        );
    }
});
var ListAddTextBox = React.createClass({
    getInitialState: function() {
        return {
            submitBtnClasses: "btn btn-link pull-right hide"
        };
    },
    showSubmitBtn: function() {
        this.setState({
            submitBtnClasses: "btn btn-link pull-right show"
        });
    },
    hideSubmitBtn: function() {
        var listItemInput = React.findDOMNode(this.refs.listItemInput);
        if(listItemInput.value == "") {
            this.setState({
                submitBtnClasses: "btn btn-link pull-right hide"
            });
        }
    },
    render: function() {
        return(<form onSubmit={this.addItemToList}>


                  <input type="text" className="form-control" ref="listItemInput" tabindex="1" placeholder="Add Item to List" onFocus={this.showSubmitBtn} onBlur={this.hideSubmitBtn} />
                  <span className="">
                    <button className={this.state.submitBtnClasses} type="submit">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                    </button>
                  </span>


        </form>);
    },
    addItemToList: function(event) {
        event.preventDefault();
        var listItemInput = React.findDOMNode(this.refs.listItemInput);
        this.props.addItem(listItemInput);
        listItemInput.value = "";
        listItemInput.focus();
        return false;
    }
});
var ListHeading = React.createClass({
    getInitialState: function() {
        return {
            submitBtnClasses: "btn btn-link pull-right hide"
        };
    },
    componentDidMount: function() {
        var listName = React.findDOMNode(this.refs.listNameElement);
        listName.value = this.props.listName;
    },
    showSubmitBtn: function() {
        this.setState({
            submitBtnClasses: "btn btn-link pull-right show"
        });
    },
    hideSubmitBtn: function() {
        var listName = React.findDOMNode(this.refs.listNameElement);
        if(listName.value == this.props.listName) {
            this.setState({
                submitBtnClasses: "btn btn-link pull-right hide"
            });
        }
    },
    render: function() {
        return(<div className="panel-heading">

                        <form onSubmit={this.changeListName}>

                            <input type="text" ref="listNameElement" className="form-control" placeholder="Enter List Name" onFocus={this.showSubmitBtn} onBlur={this.hideSubmitBtn} />
                             <button className={this.state.submitBtnClasses} type="submit">
                                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                             </button>
                        </form>
        </div>);
    },
    changeListName: function(event) {
        event.preventDefault();
        var listName = React.findDOMNode(this.refs.listNameElement);
        this.props.changeListName(listName);
        listName.blur();
    }
});
var ListPannel = React.createClass({
    render: function() {
        return(<div>

                        <List />
        </div>);
    }
});
var NavBar = React.createClass({
    componentDidMount: function() {
        $("[data-toggle=tooltip]").tooltip();
    },
    clearList: function () {

        console.log(List);
        List.bind(null);
    },
    
    render: function() {
        return(<nav className="navbar navbar-inverse">
                        <div className="container-fluid">

                         

                        </div>
        </nav>);
    }
});
var App = React.createClass({
    render: function() {
        return(<div>
                        <NavBar />
                        <div className="container">
                            <ListPannel />
                        </div>
        </div>);
    }
});
React.render(<App />, document.getElementById("app"));