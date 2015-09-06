var ListItem = React.createClass({
    getInitialState : function() {
        
                return {};
    },

    componentDidMount : function(){
        var data= {};
        data.isChecked = this.props.itemDetail.isChecked;
        data.text = this.props.itemDetail.text;
        this.setState(data);
    },
    deleteItem : function(){
        this.props.deleteItem(this);
    
    },

    render: function () {
        
        return(  <li className="list-group-item">
                    
                        <span>
                            <input type="checkbox" aria-label="..."/>
                        </span>
                        <button className="btn btn-sm btn-link" onClick = {this.deleteItem} type="button">
                            <span className="glyphicon glyphicon-remove "  aria-hidden="true"></span>
                        </button>
                        <span>{this.state.text}</span>
                        
                       
                 </li>
        );

    }
});

var List = React.createClass({

    getInitialState: function(){
        return {
                    listName : "",
                    listItems : [],
                    counter: 0
        };



    },
    componentDidMount: function () {
        var context = this;
        Office.initialize = function (reason) {
            
            var previousState = StorageLibrary.getFromPropertyBag("listState");
            debugger;
        };

    },
    addItem :function(item){

        var textValue = item.value;
        /*If List item is empty then return*/

        if(!textValue){
            console.warn("Empty Item was tried to be inserted");
            return;
        }
        var counter = this.state.counter +1;

        var listItem = {
            isChecked: false,
            text : textValue,
            key : counter
        };

        var newItems = this.state.listItems.concat(listItem);
        var newState = this.state;
        newState.listItems = newItems;
        newState.counter = counter;
        this.setState(newState);
        var previousState = StorageLibrary.getFromPropertyBag("listState");
        debugger;
        StorageLibrary.saveToPropertyBag("listState", JSON.stringify(newState));
        Office.context.document.settings.saveAsync(function (asyncResult) {
            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                console.log('Settings save failed. Error: ' + asyncResult.error.message);
            } else {
                console.log('Settings saved.');
            }
        });
        
    
    },
    changeListName: function(element){
        this.state.listName = element.value; 
    },

    deleteItem : function(element){
        console.log(element.props.itemDetail);

        var index = this.state.listItems.indexOf(element.props.itemDetail);
        var length =this.state.listItems.length;
        var newState = this.state;
        if(length === 1 && index === 0 ){
             newState.listItems =  [];
        }
        else{
            
            var oldStateItems = this.state.listItems;
            var deletedItem = oldStateItems.splice(index ,1);
            newState.listItems =  oldStateItems;
        }		
        this.setState(newState);
    
    },
    reRenderForSavedState : function(savedState) {
        this.setState(savedState);
    },
    render: function () {
            var context = this;
            var listItemsElements = this.state.listItems.map(function(item){
                
                return(<ListItem key = {item.key} deleteItem= {context.deleteItem} itemDetail = {item}/>	);
                 
            });
            return(
            <div id = "list">
                <ListHeading changeListName	= {context.changeListName} />
            
                <div>
                        <ul className="list-group">
                        <ListAddTextBox addItem = {context.addItem}/>
                            {listItemsElements}
                        </ul>
                </div>
            </div>
            );

    }

});


var ListAddTextBox = React.createClass({

    render: function () {

            return(<form onSubmit={this.addItemToList}>

                
                  <input type="text" className="form-control" ref= "listItem" placeholder="Add Item to List"/>
                  <span className="">
                    <button className="btn btn-link pull-right " type="submit" >
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                    </button>
                  </span>
            
                    
                    </form>
            );

    },
    addItemToList : function(event){
        event.preventDefault();

        var listItem = React.findDOMNode(this.refs.listItem);
        
        this.props.addItem(listItem);
        listItem.value = "";
        
    }

});

var ListHeading = React.createClass({

    render: function () {

            return( <div className="panel-heading">
                        <form onSubmit={this.changeListName} >
                            <input type="text" ref = "listNameElement" className="form-control" placeholder="Enter A Cool Name" />
                        </form>
                     </div>
            );

    },
    changeListName : function(event){
        event.preventDefault();
        var listName = React.findDOMNode(this.refs.listNameElement);
        this.props.changeListName(listName);
    }

});

var ListPannel = React.createClass({

    render: function () {

            return( <div className="panel panel-default">
                        
                        <List/>
                    </div>
            );

    }

});

var NavBar = React.createClass({

    render: function () {

            return(   <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            
                            <button type="button" className="btn btn-default navbar-btn" aria-label="Left Align">
                                <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                            </button>
                            <button type="button" className="btn btn-default navbar-btn" aria-label="Left Align">
                                <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                            </button>
                        </div>
                    </nav>
            );

    }

});

var App = React.createClass({

    render: function () {

            return( <div>
                        <NavBar/>
                        <div className="container">
                            <ListPannel/>
                        </div>
                    </div>
                    
                    
            );

    }

});

React.render( <App/>, document.getElementById("app"));
