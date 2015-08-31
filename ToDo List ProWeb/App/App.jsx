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
						<button className="btn btn-sm btn-link" type="button">
							<span className="glyphicon glyphicon-remove " onClick = {this.deleteItem} aria-hidden="true"></span>
						</button>
                        <span>{this.state.text}</span>
						
                       
                 </li>
        );

    }
});

var List = React.createClass({

	getInitialState: function(){
		return {
			listItems : [{isChecked: true,
			text: "TODO make this dynammic"
			},{isChecked: false,
			text: "TODO make this More dynamic"
			}]
		};
	},

	deleteItem : function(element){
		console.log(element);
		
		this.setState({listItems : this.state.listItems.concat(element)});
	
	},
	render: function () {
			var context = this;
			var listItemsElements = this.state.listItems.map(function(item){
				
				return(<ListItem deleteItem= {context.deleteItem} itemDetail = {item}/>	);
				 
			});
			return(<div> <ul className="list-group">
						{listItemsElements}
					 </ul>
				   </div>
			);

	}

});


var ListAddTextBox = React.createClass({

	render: function () {

			return(<form onSubmit={this.submitHandller}>

				
				  <input type="text" className="form-control" placeholder="Search for..."/>
				  <span className="">
					<button className="btn btn-link pull-right " type="button">
						<span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
					</button>
				  </span>
			
					
					</form>
			);

	},
	submitHandller : function(){
		console.log("test");
		return false;
	}

});

var ListHeading = React.createClass({

	render: function () {

			return( <div className="panel-heading">
						<form onSubmit={this.submitHandller}>
							<input type="text" className="form-control" value="Default List Name" aria-describedby="basic-addon1" />
						</form>
					 </div>
			);

	},
	submitHandller : function(){
		console.log("test");
		return false;
	}

});

var ListPannel = React.createClass({

	render: function () {

			return( <div className="panel panel-default">
						<ListHeading/>
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
