//Nathaniel Salami && Temitayo Oyelowo 
var sendBoardArray = null;
var sendSelectedPiece = null;
var handleKeyPress = null;
var detectPlayerColor = null;
var sendPlayerColor = null;
var received = null;

document.addEventListener("canvasReady", function(event) {
	console.log("I'm in web socket");
	var ws = new WebSocket('ws://' + window.document.location.host);
		//console.log(ws.id);
	  ws.onmessage = function(message) {
			if((message.data != "WHITE") && (message.data != "BLACK") && (message.data != true)){
				received = JSON.parse(message.data);
			}else if(message.data == true){
				forfeit = message.data;
				return false;
			}else{
				nextPlayerColor = message.data;
				console.log("NEXT PLAYER COLOR IS NOW --> " + nextPlayerColor);
				return false;
			}


			if (received == 'BLACK') {
				//console.log(received);
				alert("You are on the " + received + " Team");
				playerColor = received;
				//&emsp; to insert tab space
				document.getElementById('name').innerHTML += "&emsp;&emsp; TEAM COLOR: " + playerColor;
				//detectPlayerColor();
			}
			else if (received == 'WHITE') {
				//console.log(received);
				alert("You are on the " + received + " Team");
				playerColor = received;
				//&emsp; to insert tab space
				document.getElementById('name').innerHTML += "&emsp;&emsp; TEAM COLOR: " + playerColor;
				//detectPlayerColor();
			}

			else {
				var received = JSON.parse(message.data);
				//console.log("RECEIVED OUTPUT: " + received);
				if(received != null){
					if(received.length == 8){
						//console.log("BOARD LOCATION AT WebSocket: " + received);
						recieveBoardArray(received);
					}else{
						receiveSelectedPiece(received);
						//console.log("RECEIVED.NAME --> " + received.name);
					}
				}else {
					//console.log("RECIEVED NOTHING!!!!!!");
					receiveSelectedPiece(null);
				}
			}
	  };

	  sendBoardArray = function sendBoardArray() {
			var myBoardLocation = JSON.stringify(boardArray);
			ws.send(myBoardLocation);
			//document.getElementById('msgBox').value = '';
	  }

	  sendSelectedPiece = function sendSelectedPiece() {
			var mySelectedPiece = JSON.stringify(selectedPiece);
			ws.send(mySelectedPiece);
	  }

		sendPlayerColor = function sendPlayerColor(){
			ws.send(nextPlayerColor);
		}

});
