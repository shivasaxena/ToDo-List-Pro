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
    toggleCheck : function () {
        
        if(this.state.isChecked){
            this.state.isChecked= false;
        }else{
            this.state.isChecked = true;
        }

        this.props.toggleCheck(this);
    },

    render: function () {
        
        var cx = React.addons.classSet;
        var classes = cx({
            'strike-through': this.state.isChecked
            
        });

        
        return(  <li className="list-group-item">
                    
                        <span>
                            <input checked = {this.state.isChecked} onClick = {this.toggleCheck} type="checkbox" aria-label="..."/>
                        </span>
                        <button className="btn btn-sm btn-link" onClick = {this.deleteItem} type="button">
                            <span className="glyphicon glyphicon-remove "  aria-hidden="true"></span>
                        </button>
                        <span className={classes}>{this.state.text}</span>
                        
                       
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

        // check if office is present then get the state from it else set it from localStorage
        if (Office.context.document) {
            Office.initialize = function (reason) {
                var previousState = StorageLibrary.getValueFromStorage("listState");

                context.setState(JSON.parse(previousState));
               
            };

        } else {
            var previousState = StorageLibrary.getValueFromStorage("listState");
            if (previousState) {
                context.setState(JSON.parse(previousState));
            }

        }
        

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
       
        StorageLibrary.saveValueIntoStorage("listState", JSON.stringify(newState));
       
        
    
    },
    changeListName: function (element) {

        var newState = this.state;
        newState.listName = element.value;
        this.setState(newState);

        StorageLibrary.saveValueIntoStorage("listState", JSON.stringify(this.state));
    },

    deleteItem : function(element){
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
        StorageLibrary.saveValueIntoStorage("listState", JSON.stringify(newState));
    
    },
    toggleCheck: function (item) {
        var index = this.state.listItems.indexOf(item.props.itemDetail);
        var oldStateItems = this.state.listItems;
        var newList = oldStateItems;
        newList[index] = item.state;
        this.setState(newList);

        
    },
    reRenderForSavedState : function(savedState) {
        this.setState(savedState);
    },
    render: function () {
            var context = this;
            var listItemsElements = this.state.listItems.map(function(item){
                
                return(<ListItem key = {item.key} deleteItem= {context.deleteItem} toggleCheck ={context.toggleCheck} itemDetail = {item}/>	);
                 
            });
       
        
            return(

            <div id = "list">
                <ListHeading changeListName	= {context.changeListName} listName = {context.state.listName} />
                
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

                
                  <input type="text" className="form-control" ref= "listItemInput" placeholder="Add Item to List"/>
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
        var listItemInput = React.findDOMNode(this.refs.listItemInput);
        this.props.addItem(listItemInput);
        listItemInput.value = "";
        listItemInput.focus();
        
    }

});

var ListHeading = React.createClass({

    getInitialState : function () {
        return {};
    },
    componentDidMount: function () {
        var data = {};
       
       
    },
    render: function () {
        
            return( <div className="panel-heading">
                        <form onSubmit={this.changeListName} >
                            <input type="text" ref = "listNameElement" className="form-control"  />
                             <button className="btn btn-link pull-right " type="submit">
                                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                             </button>
                        </form>
                     </div>
            );

    },
    changeListName : function(event){
        event.preventDefault();
        var listName = React.findDOMNode(this.refs.listNameElement);
        this.props.changeListName(listName);
        listName.blur();
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
