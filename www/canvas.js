//Nathaniel Salami && Temitayo Oyelowo

//***NOTE***//
//DRAWING AND DETECTING X AND Y ARE SWAPPED
//ie. X = Y AND Y = X WHEN DRAWING OR DETECTING PIECES

//new event listener
var canvasDoneEvent = new CustomEvent("canvasReady", { "detail": "Event called when canvas is ready" });

//module containing useful methods
//var chessMethods = require('test');

var playerColor = null;

var playerName = null;

var nextPlayerColor = "WHITE";

var forfeit = false;

var canvas = document.getElementById('canvas1');
var context = canvas.getContext('2d');

//used for drawing the pieces
var buffer = 10;
var scale = 70;
var size = 60;
var gameColors = ['yellow', 'red', 'blue', 'grey'];
var borderWidth = 4;

var deltaX, deltaY; //location where mouse is pressed

//current piece being modified
var selectedPiece;

//stores the white kings current position
var whiteKing;

//stores the black kings current position
var blackKing;

//an array that stores the possible move indexes for whatever piece was selected
var possibleMoves;

//an array that stores illegal moves for the king
var invalidMoves;

//copy of the selected piece
//for when a piece's move conditions are not met
//the piece is sent back to its original position
var copyPiece;

//converts canvas coordinates to index
function index(a) {
	return Math.floor(a/scale);
}

//stores white pieces info: image, and coordinates
var whitePieces = [];
whitePieces.push({name: 'rookL', image: document.getElementById("WHITE_ROOK"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'knightL', image: document.getElementById("WHITE_KNIGHT"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'bishopL', image: document.getElementById("WHITE_BISHOP"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'queen', image: document.getElementById("WHITE_QUEEN"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'king', image: document.getElementById("WHITE_KING"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'bishopR', image: document.getElementById("WHITE_BISHOP"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'knightR', image: document.getElementById("WHITE_KNIGHT"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
whitePieces.push({name: 'rookR', image: document.getElementById("WHITE_ROOK"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});

//generates the white pawns
for (var i = 0; i< 8; i++) {
	var pName = 'pawn' + (i+1);
	whitePieces.push({name: pName, image: document.getElementById("WHITE_PAWN"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0});
}

//stores black pieces info: image, and coordinates
var blackPieces = [];
blackPieces.push({name: 'rookL', image: document.getElementById("BLACK_ROOK"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'knightL', image: document.getElementById("BLACK_KNIGHT"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'bishopL', image: document.getElementById("BLACK_BISHOP"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'queen', image: document.getElementById("BLACK_QUEEN"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'king', image: document.getElementById("BLACK_KING"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'bishopR', image: document.getElementById("BLACK_BISHOP"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'knightR', image: document.getElementById("BLACK_KNIGHT"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
blackPieces.push({name: 'rookR', image: document.getElementById("BLACK_ROOK"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});

//generates the black pawns
for (var i = 0; i< 8; i++) {
	var pName = 'pawn' + (i+1);
	blackPieces.push({name: pName, image: document.getElementById("BLACK_PAWN"), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0});
}

function nextPlayer() {
	//changes the player color to manage turns

	if (nextPlayerColor == "WHITE") {
		nextPlayerColor = "BLACK";
	}
	else {
		nextPlayerColor = "WHITE";
	}
}

function getPossibleMoves(piece) {
	//returns an array of all possible moves for a piece
	var tempArray = [];

	//black pawn
	if ((piece.name.substr(0, 4) == 'pawn') && (piece.color == 'BLACK')) {
		//if there is a piece in this path it ends the path
		var targetPiece = getPieceAtLocation((piece.y)*scale, (piece.x+1)*scale);
		if (targetPiece == null) {
			tempArray.push([piece.x+1, piece.y]);
			targetPiece = getPieceAtLocation((piece.y)*scale, (piece.x+2)*scale);
			if (piece.x == 1) {
				if (targetPiece == null) {
					tempArray.push([piece.x+2, piece.y]);
				}
			}
		}
		//conditions for capture
		targetPiece = getPieceAtLocation((piece.y-1)*scale, (piece.x+1)*scale); //left
		if ((targetPiece != null) && (targetPiece.color != piece.color)) {
			tempArray.push([piece.x+1, piece.y-1]);
		}
		targetPiece = getPieceAtLocation((piece.y+1)*scale, (piece.x+1)*scale); //right
		if ((targetPiece != null) && (targetPiece.color != piece.color)) {
			tempArray.push([piece.x+1, piece.y+1]);
		}
	}

	//white pawn
	if ((piece.name.substr(0, 4) == 'pawn') && (piece.color == 'WHITE')) {
		//if there is a piece in this path it ends the path
		var targetPiece = getPieceAtLocation((piece.y)*scale, (piece.x-1)*scale);
		if (targetPiece == null) {
			tempArray.push([piece.x-1, piece.y]);
			targetPiece = getPieceAtLocation((piece.y)*scale, (piece.x-2)*scale);
			if (piece.x == 6) {
				if (targetPiece == null) {
					tempArray.push([piece.x-2, piece.y]);
				}
			}
		}
		//conditions for capture
		targetPiece = getPieceAtLocation((piece.y-1)*scale, (piece.x-1)*scale); //left
		if ((targetPiece != null) && (targetPiece.color != piece.color)) {
			tempArray.push([piece.x-1, piece.y-1]);
		}
		targetPiece = getPieceAtLocation((piece.y+1)*scale, (piece.x-1)*scale); //right
		if ((targetPiece != null) && (targetPiece.color != piece.color)) {
			tempArray.push([piece.x-1, piece.y+1]);
		}
	}

	//rook
	if (piece.name.substr(0, 4) == 'rook') {
		//left
		var rookX = piece.x;
		var rookY = piece.y;
		while (rookY > 0) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--rookY)*scale, (rookX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([rookX, rookY]);
				}
				tempArray.push([rookX, rookY]);
				break;
			}
			tempArray.push([rookX, rookY]);
		}
		//right
		var rookX = piece.x;
		var rookY = piece.y;
		while (rookY < 7) {
			var targetPiece = getPieceAtLocation((++rookY)*scale, rookX*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([rookX, rookY]);
				}
				tempArray.push([rookX, rookY]);
				break;
			}
			tempArray.push([rookX, rookY]);
		}
		//back
		var rookX = piece.x;
		var rookY = piece.y;
		while (rookX > 0) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((rookY)*scale, (--rookX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([rookX, rookY]);
				}
				tempArray.push([rookX, rookY]);
				break;
			}
			tempArray.push([rookX, rookY]);
		}
		//front
		var rookX = piece.x;
		var rookY = piece.y;
		while (rookX < 7) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((rookY)*scale, (++rookX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([rookX, rookY]);
				}
				tempArray.push([rookX, rookY]);
				break;
			}
			tempArray.push([rookX, rookY]);
		}
	}

	//bishop
	if (piece.name.substr(0, 6) == 'bishop') {
		//top left
		var bishopX = piece.x;
		var bishopY = piece.y;
		while ((bishopY > 0) && (bishopX > 0)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--bishopY)*scale, (--bishopX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([bishopX, bishopY]);
				}
				tempArray.push([bishopX, bishopY]);
				tempArray.push([bishopX, bishopY]);
				break;
			}
			tempArray.push([bishopX, bishopY]);
		}
		//top right
		var bishopX = piece.x;
		var bishopY = piece.y;
		while ((bishopY < 7) && (bishopX > 0)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((++bishopY)*scale, (--bishopX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([bishopX, bishopY]);
				}
				tempArray.push([bishopX, bishopY]);
				break;
			}
			tempArray.push([bishopX, bishopY]);
		}
		//bottom left
		var bishopX = piece.x;
		var bishopY = piece.y;
		while ((bishopY > 0) && (bishopX < 7)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--bishopY)*scale, (++bishopX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([bishopX, bishopY]);
				}
				tempArray.push([bishopX, bishopY]);
				break;
			}
			tempArray.push([bishopX, bishopY]);
		}
		//bottom right
		var bishopX = piece.x;
		var bishopY = piece.y;
		while ((bishopY < 7) && (bishopX < 7)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((++bishopY)*scale, (++bishopX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([bishopX, bishopY]);
				}
				tempArray.push([bishopX, bishopY]);
				break;
			}
			tempArray.push([bishopX, bishopY]);
		}
	}

	//queen
	if (piece.name.substr(0, 5) == 'queen') {
		//left
		var queenX = piece.x;
		var queenY = piece.y;
		while (queenY > 0) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--queenY)*scale, queenX*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//right
		var queenX = piece.x;
		var queenY = piece.y;
		while (queenY < 7) {
			var targetPiece = getPieceAtLocation((++queenY)*scale, queenX*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//back
		var queenX = piece.x;
		var queenY = piece.y;
		while (queenX > 0) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((queenY)*scale, (--queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//front
		var queenX = piece.x;
		var queenY = piece.y;
		while (queenX < 7) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((queenY)*scale, (++queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//top left
		var queenX = piece.x;
		var queenY = piece.y;
		while ((queenY > 0) && (queenX > 0)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--queenY)*scale, (--queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//top right
		var queenX = piece.x;
		var queenY = piece.y;
		while ((queenY < 7) && (queenX > 0)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((++queenY)*scale, (--queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//bottom left
		var queenX = piece.x;
		var queenY = piece.y;
		while ((queenY > 0) && (queenX < 7)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((--queenY)*scale, (++queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
		//bottom right
		var queenX = piece.x;
		var queenY = piece.y;
		while ((queenY < 7) && (queenX < 7)) {
			//if there is a piece in this path it ends the path
			var targetPiece = getPieceAtLocation((++queenY)*scale, (++queenX)*scale);
			if (targetPiece != null) {
				if (targetPiece.color != piece.color) {
					tempArray.push([queenX, queenY]);
				}
				tempArray.push([queenX, queenY]);
				break;
			}
			tempArray.push([queenX, queenY]);
		}
	}

	//king
	if (piece.name.substr(0, 4) == 'king') {
		//left
		if (piece.y-1 != -1) { tempArray.push([piece.x, piece.y-1]); }
		//right
		if (piece.y+1 != 8) { tempArray.push([piece.x, piece.y+1]); }
		//behind
		if (piece.x-1 != -1) { tempArray.push([piece.x-1, piece.y]); }
		//front
		if (piece.x+1 != 8) { tempArray.push([piece.x+1, piece.y]); }
		//top left
		if ((piece.y-1 != -1) && (piece.x-1 != -1)) { tempArray.push([piece.x-1, piece.y-1]); }
		//top right
		if ((piece.y+1 != 8) && (piece.x-1 != -1)) { tempArray.push([piece.x-1, piece.y+1]); }
		//bottom left
		if ((piece.y-1 != -1) && (piece.x+1 != 8)) { tempArray.push([piece.x+1, piece.y-1]); }
		//bottom right
		if ((piece.y+1 != 8) && (piece.x+1 != 8)) { tempArray.push([piece.x+1, piece.y+1]); }
	}

	//knight
	if (piece.name.substr(0, 6) == 'knight') {
		//left L's
		if (piece.y-2 > -1) {
			if (piece.x-1 > -1) {
				tempArray.push([piece.x-1, piece.y-2]); //top
			}
			if (piece.x+1 < 8) {
				tempArray.push([piece.x+1, piece.y-2]); //bottom
			}
		}
		//right L's
		if (piece.y+2 < 8) {
			if (piece.x-1 > -1) {
				tempArray.push([piece.x-1, piece.y+2]); //top
			}
			if (piece.x+1 < 8) {
				tempArray.push([piece.x+1, piece.y+2]); //bottom
			}
		}
		//top L's
		if (piece.x-2 > -1) {
			if (piece.y-1 > -1) {
				tempArray.push([piece.x-2, piece.y-1]); //top
			}
			if (piece.y+1 < 8) {
				tempArray.push([piece.x-2, piece.y+1]); //bottom
			}
		}
		//bottom L's
		if (piece.x+2 < 8) {
			if (piece.y-1 > -1) {
				tempArray.push([piece.x+2, piece.y-1]); //top
			}
			if (piece.y+1 < 8) {
				tempArray.push([piece.x+2, piece.y+1]); //bottom
			}
		}
	}

	return tempArray;
}

function getInvalidMoves(king) {
	//returns an array of invalid possible moves for the king
	var tempArray = [];

	//possible moves for the king piece
	var kingMoves = getPossibleMoves(king);

	//loops through all the pieces on the board
	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			//gets the possible moves for the current piece
			var currentPiece = boardArray[x][y];

			if (currentPiece != null) {
				//gets the possible moves for the current piece
				var currentPieceMoves = [];

				//adds the diagonal capture indexes for pawns
				if (currentPiece.name.substr(0, 4) == 'pawn') {
					if (currentPiece.color == 'BLACK') { //black
						currentPieceMoves.push([currentPiece.x+1, currentPiece.y-1]); //left
						currentPieceMoves.push([currentPiece.x+1, currentPiece.y+1]); //right
					}
					else { //white
						currentPieceMoves.push([currentPiece.x-1, currentPiece.y-1]); //left
						currentPieceMoves.push([currentPiece.x-1, currentPiece.y+1]); //right
					}
				}
				else {
					currentPieceMoves = getPossibleMoves(currentPiece);
				}

				//checks if any of the kings possible moves are also in the
				//move set of another piece (of a different color) and adds it as an invalid move
				if (currentPiece.color != selectedPiece.color) {
					for (var i = 0; i < currentPieceMoves.length; i++) {
						for (var j = 0; j < kingMoves.length; j++) {
							if ((kingMoves[j][0] == currentPieceMoves[i][0]) &&
								  (kingMoves[j][1] == currentPieceMoves[i][1])) {

								tempArray.push(kingMoves[j]);
							}
						}
					}
				}
			}
		}
	}

	return tempArray;
}

function getKingOnCheck() {
	//detects whether a king is under check
	//returns the king under check

	//loops through all the pieces on the board
	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			//gets the possible moves for the current piece
			var currentPiece = boardArray[x][y];

			if (currentPiece != null) {
				//stores the possible moves for the current piece
				var currentPieceMoves = [];

				//adds the diagonal capture indexes for pawns
				if (currentPiece.name.substr(0, 4) == 'pawn') {
					if (currentPiece.color == 'BLACK') { //black
						currentPieceMoves.push([currentPiece.x+1, currentPiece.y-1]); //left
						currentPieceMoves.push([currentPiece.x+1, currentPiece.y+1]); //right
					}
					else { //white
						currentPieceMoves.push([currentPiece.x-1, currentPiece.y-1]); //left
						currentPieceMoves.push([currentPiece.x-1, currentPiece.y+1]); //right
					}
				}
				else {
					//gets the possible moves for the current piece
					currentPieceMoves = getPossibleMoves(currentPiece);
				}

				//loops through the moves of the current piece
				for (var i = 0; i < currentPieceMoves.length; i++) {
					if (currentPiece.color != whiteKing.color) { //check if white king is under check
						//returns the white king if it is in another pieces move set
						if ((whiteKing.x == currentPieceMoves[i][0]) && (whiteKing.y == currentPieceMoves[i][1])) {
							return whiteKing;
						}
					}
					if (currentPiece.color != blackKing.color) { //check if black king is under check
						//returns the black king if it is in another pieces move set
						if ((blackKing.x == currentPieceMoves[i][0]) && (blackKing.y == currentPieceMoves[i][1])) {
							return blackKing;
						}
					}
				}
			}
		}
	}
	return null;
}

function updateKings() {
	//update the global variables for the kings

	//loops through all the pieces on the board to find the kings
	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			var currentPiece = boardArray[x][y];

			if (currentPiece != null) {
				if (currentPiece.name.substr(0, 4) == 'king') {
					if (currentPiece.color == 'WHITE') {
						whiteKing = currentPiece;
					}
					else {
						blackKing = currentPiece;
					}
				}
			}
		}
	}
}

function drawKingOnCheck() {
	//indicates the king on check
	var kingOnCheck = getKingOnCheck();

	if (kingOnCheck != null) {
		var tempX = buffer/2 + kingOnCheck.y * scale;
		var tempY = buffer/2 + kingOnCheck.x * scale;

		//indicates possible moves
		context.beginPath();
		context.stroke();
		context.lineWidth = borderWidth;
		context.strokeStyle = gameColors[1];
		context.rect(tempX, tempY, scale, scale);
		context.stroke();
	}
}

function handleForfeitButton() {
	forfeit = true;
	//alert("GAME OVER");
	resetGame();
}

function resetGame() {
	//resets the entire game
	//alert("GAME OVER");
	//document.removeEventListener("mousemove", handleMouseMove, true);
	//document.removeEventListener("mouseup", handleMouseUp, true);

	boardArray = initializeBoard();
	selectedPiece = null;
	copyPiece = null;

	if (nextPlayerColor == "BLACK") {
		nextPlayer();
	}
	sendPlayerColor();
	updateKings();
	sendSelectedPiece();
	sendBoardArray();
}

function checkForPromotion() {
	//returns any pawn that has reached the opposite end

	//loops through the board to find a pawn at the last position
	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			var currentPiece = boardArray[x][y];

			//checks if a pawn is behind enemy lines and returns it
			if (currentPiece != null) {
				if (currentPiece.name.substr(0, 4) == 'pawn') {
					if (currentPiece.color == 'BLACK') { //black
						if (currentPiece.x == 7) {
							return currentPiece;
						}
					}
					else { //white
						if (currentPiece.x == 0) {
							return currentPiece;
						}
					}
				}
			}
		}
	}
	return null;
}

function handlePawnPromotion() {
	//promotes any qualifying pawn

	var goodPawn = checkForPromotion();

	if (goodPawn != null) {
		console.log("PROMOTION!!!!!!!!!!");
		if (goodPawn.color == 'BLACK') { //manages promotion of black pawns
			var requestedPiece = callPromotionPrompt();

			if(requestedPiece != "User cancelled the prompt."){
				while(getImage(requestedPiece, goodPawn.color) == false){
					alert("WRONG NAME!!!");
					requestedPiece = callPromotionPrompt();
				}
			}else{
				console.log("Cancel button is clicked");
				requestedPiece = 'queen';
			}

			if(requestedPiece == 'pawn'){
				console.log("REQUESTED PAWN");
				requestedPiece = 'queen';
			}

			var replacement = {name: requestedPiece, image: getImage(requestedPiece, goodPawn.color), x: 0, y: 0, color: 'BLACK', canvasX: 0, canvasY: 0};
			replacement.x = goodPawn.x;
			replacement.y = goodPawn.y;
			replacement.canvasX = goodPawn.canvasX;
			replacement.canvasY = goodPawn.canvasY;

			boardArray[goodPawn.x][goodPawn.y] = replacement;
		}

		else { //manages promotion of white pawns
			var requestedPiece = callPromotionPrompt();
			if(requestedPiece != "User cancelled the prompt."){
				while(getImage(requestedPiece, goodPawn.color) == false){
					alert("WRONG NAME!!!");
					requestedPiece = callPromotionPrompt();
				}
			}else{
				console.log("Cancel button is clicked");
				requestedPiece = 'queen';
			}

			if(requestedPiece == 'pawn'){
				console.log("REQUESTED PAWN");
				requestedPiece = 'queen';
			}

			//var replacement = {name: 'queen', image: document.getElementById("WHITE_QUEEN"), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0};
			var replacement = {name: requestedPiece, image: getImage(requestedPiece, goodPawn.color), x: 0, y: 0, color: 'WHITE', canvasX: 0, canvasY: 0};
			replacement.x = goodPawn.x;
			replacement.y = goodPawn.y;
			replacement.canvasX = goodPawn.canvasX;
			replacement.canvasY = goodPawn.canvasY;

			boardArray[goodPawn.x][goodPawn.y] = replacement;
		}
	}
}

function callPromotionPrompt() {
    var requestedPiece;
    var person = prompt("Enter the name of the piece you want to promote:", "queen");
    if (person == null || person == "") {
        requestedPiece = "User cancelled the prompt.";
    } else {
        requestedPiece = person.toLowerCase();
    }
    return requestedPiece;
}

function getImage(name, color){
	var mySrc;
	var myImage;

	if(color == 'BLACK'){
		if(name == 'rook'){
			myImage = document.getElementById("BLACK_ROOK");
		}else if(name == 'knight'){
			myImage = document.getElementById("BLACK_KNIGHT");
		}else if(name == 'bishop'){
			myImage = document.getElementById("BLACK_BISHOP");
		}else if(name == 'queen' ){
			myImage = document.getElementById("BLACK_QUEEN");
		}else if(name == 'king'){
			myImage = document.getElementById("BLACK_KING");
		}else if (name == 'pawn'){
			myImage = document.getElementById("BLACK_PAWN");
		}else if(name == "User cancelled the prompt."){
			console.log("Cancelled");
			myImage = document.getElementById("BLACK_QUEEN");
		}else{
			return false;
		}
	}else{
		if(name == 'rook'){
			myImage = document.getElementById("WHITE_ROOK");
		}else if(name == 'knight'){
			myImage =document.getElementById("WHITE_KNIGHT");
		}else if(name == 'bishop'){
			myImage = document.getElementById("WHITE_BISHOP");
		}else if(name == 'queen' ){
			myImage = document.getElementById("WHITE_QUEEN");
		}else if(name == 'king'){
			myImage = document.getElementById("WHITE_KING");
		}else if (name == 'pawn'){
			myImage = document.getElementById("WHITE_PAWN");
		}else if(name == "User cancelled the prompt."){
			myImage = document.getElementById("WHITE_QUEEN");
		}else{
			return false;
		}
	}
	return myImage;
}

function drawInvalidMoves(movesArray) {
	//draws the invalid moves of a king
	if (movesArray != null) {
		for (var i = 0; i < movesArray.length; i++) {
			var tempX = buffer/2 + movesArray[i][1]*scale;
			var tempY = buffer/2 + movesArray[i][0]*scale;

			var targetPiece = getPieceAtLocation(tempX, tempY);

			if (targetPiece != null) {
				if (targetPiece.color != selectedPiece.color) {
					//indicates possible moves
					context.beginPath();
					context.stroke();
					context.lineWidth = borderWidth;
					context.strokeStyle = gameColors[2];
					context.rect(tempX, tempY, scale, scale);
					context.stroke();
				}
			}
			else {
				//indicates possible moves
				context.beginPath();
				context.stroke();
				context.lineWidth = borderWidth;
				context.strokeStyle = gameColors[2];
				context.rect(tempX, tempY, scale, scale);
				context.stroke();
			}
		}
	}
}

function moveValidity(piece, x, y) {
	//determines if a move about to be made is Valid

	//stops a king from making an invalid move
	if (piece.name.substr(0, 4) == 'king') {
		for (var i = 0; i < invalidMoves.length; i++) {
			if ((invalidMoves[i][0] == x) && (invalidMoves[i][1] == y)) {
				return false;
			}
		}
	}

	//checks if x and y are in the move set
	for (var i = 0; i < possibleMoves.length; i++) {
		if ((possibleMoves[i][0] == x) && (possibleMoves[i][1] == y)) {
			//checks if there is any piece at x, y
			if (getPieceAtLocation(y*scale, x*scale) == null) {
				return true;
			}
			else {
				//checks if the piece at x, y is the same color as the incoming piece
				if (getPieceAtLocation(y*scale, x*scale).color != piece.color) {
					//console.log("Selected Piece color: " + selectedPiece.color);
					//console.log("Piece at Target color: " + getPieceAtLocation(y*scale, x*scale).color);
					return true;
				}
			}
		}
	}

	return false;
}

function drawPiecesInDanger(movesArray) {
	//indicates pieces in danger
	if (movesArray != null) {
		for (var i = 0; i < movesArray.length; i++) {
			//position where the indicator is drawn
			var tempX = buffer/2 + movesArray[i][1]*scale;
			var tempY = buffer/2 + movesArray[i][0]*scale;

			var currentPiece = getPieceAtLocation(tempX, tempY);

			if (currentPiece != null) {
				if (currentPiece.color != selectedPiece.color) {
					//a piece (of a different color) is on a point in the moves array
					//therefore it is in danger
					if ((currentPiece.x == movesArray[i][0]) && (currentPiece.y == movesArray[i][1])) {
						context.beginPath();
						context.stroke();
						context.lineWidth = borderWidth;
						context.strokeStyle = gameColors[1];
						context.rect(tempX, tempY, scale, scale);
						context.stroke();
					}
				}
			}
		}
	}
}

function drawPossibleMoves(movesArray) {

	//draws possible moves
	if(movesArray != null){

		for (var i = 0; i < movesArray.length; i++) {
			//position where the indicator is drawn
			var tempX = buffer/2 + movesArray[i][1]*scale;
			var tempY = buffer/2 + movesArray[i][0]*scale;

			var targetPiece = getPieceAtLocation(tempX, tempY);
			if (targetPiece != null) {
				//indicates all possible moves except where the piece is of the same colour
				if (targetPiece.color != selectedPiece.color) {
					context.beginPath();
					context.stroke();
					context.lineWidth = borderWidth;
					context.strokeStyle = gameColors[0];
					context.rect(tempX, tempY, scale, scale);
					context.stroke();
				}
			}
			else {
				//indicates all possible moves
				context.beginPath();
				context.stroke();
				context.lineWidth = borderWidth;
				context.strokeStyle = gameColors[0];
				context.rect(tempX, tempY, scale, scale);
				context.stroke();
			}
		}
		//indicates any piece that is in danger
		drawPiecesInDanger(movesArray);
	}

}

//assigns the initial coordinates to board pieces
var boardArray = initializeBoard();		//stores the the pieces currently on the board

function initializeBoard() {
	var tempArray = [];

	for (var x = 0; x < 8; x++) {
		tempArray[x] = [];

		for (var y = 0; y < 8; y++) {
			//adding black pieces
			//pawns
			if (x == 1) {
				blackPieces[y+8].x = x;
				blackPieces[y+8].y = y;
				tempArray[x][y] = blackPieces[y+8];
			}
			//other pieces
			if (x == 0) {
				blackPieces[y].x = x;
				blackPieces[y].y = y;
				tempArray[x][y] = blackPieces[y];

				//stores the black king
				if (blackPieces[y].name.substr(0, 4) == 'king') {
					blackKing = blackPieces[y];
				}
			}

			//adding white pieces
			//pawns
			if (x == 6) {
				whitePieces[y+8].x = x;
				whitePieces[y+8].y = y;
				tempArray[x][y] = whitePieces[y+8];
			}
			//other
			if (x == 7) {
				whitePieces[y].x = x;
				whitePieces[y].y = y;
				tempArray[x][y] = whitePieces[y];

				//stores the black king
				if (whitePieces[y].name.substr(0, 4) == 'king') {
					whiteKing = whitePieces[y];
				}
			}
		}
	}

	return tempArray;
}

function drawPieces(){
	//converts boardArray positions to canvas coordinates
	//and draws the pieces

	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			if (boardArray[x][y] != null) {
				var currPiece = boardArray[x][y].image;
				var currX = buffer + boardArray[x][y].x * scale;
				var currY = buffer + boardArray[x][y].y * scale;

				boardArray[x][y].canvasX = currX;
				boardArray[x][y].canvasY = currY;

				context.drawImage(currPiece, currY, currX, size, size);
			}
		}
	}
}

var drawGame = function drawGame() {
	//draws the pieces and shows important indications
	context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

	drawBoard();
	drawPieces();
	drawKingOnCheck();

	if(selectedPiece != null ){
		drawPossibleMoves(possibleMoves);
		drawInvalidMoves(invalidMoves);
		context.drawImage(selectedPiece.image,
			 								selectedPiece.canvasX-size/2,
											selectedPiece.canvasY-size/2,
											size, size);
	}
	drawKingOnCheck();
}

function drawBoard() {
	var boxSize = size+buffer;
	var borderSize = 8*scale + (buffer/2);

	//border
	context.beginPath();
	context.stroke();
	context.lineWidth = 4;
	context.strokeStyle = 'black';
	context.rect(2.5, 2.5, borderSize, borderSize);
	context.stroke();

	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			context.strokeStyle = gameColors[3];
			var posX = x*scale + (buffer/2);
			var posY = y*scale + (buffer/2);

			if (x % 2 == 0) { //even rows
				//fill odd columns
				if (y % 2 != 0) {
					context.beginPath();
					context.rect(posX, posY, boxSize, boxSize);
					context.fillStyle = gameColors[3];
					context.fill();
				}
			}
			else { //odd rows
				//fill even columns
				if (y % 2 == 0) {
					context.beginPath();
					context.rect(posX, posY, boxSize, boxSize);
					context.fillStyle = gameColors[3];
					context.fill();
				}
			}
		}
	}
}

function getPieceAtLocation(aCanvasX, aCanvasY) {
	//locate the piece targeted by aCanvasX, aCanvasY
	if (((index(aCanvasX) < 8) && (index(aCanvasY) < 8)) &&
	 		((index(aCanvasX) > -1) && (index(aCanvasY) > -1))) { //prevents out of bounds clicks

		return boardArray[index(aCanvasY)][index(aCanvasX)];
	}
	return null;
}

function handleMouseDown(e){

	//get mouse location relative to canvas top left
	var evt = evt || window.event;
  if (evt.button == 0) {
		//detectPlayerColor();
		//who are you
		console.log("Player: " + playerColor);
		//console.log(chessMethods.test());

		var rect = canvas.getBoundingClientRect();

		var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
		var canvasY = e.pageY - rect.top;
		console.log("Mouse Down(index): X = " + index(canvasX) + ", Y = " + index(canvasY));

		selectedPiece = getPieceAtLocation(canvasX, canvasY);
		copyPiece = getPieceAtLocation(canvasX, canvasY);

		if(selectedPiece != null ){

			if(playerColor != nextPlayerColor){
				alert("Please wait for your turn to play");
				return false;
			}else if(playerColor != selectedPiece.color){
				alert("Please click on a piece you've been assigned");
				return false;
			}

			/*if ((playerColor != selectedPiece.color) || (playerColor != nextPlayerColor)) {
				alert("Please wait your turn");
				return false;
			}*/

			console.log("Selected Piece: " + selectedPiece.color + " " + selectedPiece.name +
									", X: " + selectedPiece.x + " Y: " + selectedPiece.y);
			/*console.log("Selected Piece: " + selectedPiece.color + " " + selectedPiece.name +
									", X: " + selectedPiece.canvasX + " Y: " + selectedPiece.canvasY);*/

			deltaX = selectedPiece.canvasX - canvasX;
			deltaY = selectedPiece.canvasY - canvasY;
			document.addEventListener("mousemove", handleMouseMove, true);
			document.addEventListener("mouseup", handleMouseUp, true);

			selectedPiece.canvasX = canvasX;
			selectedPiece.canvasY = canvasY;

			possibleMoves = getPossibleMoves(selectedPiece);

			//generates the invalid moves for a king
			if (selectedPiece.name.substr(0, 4) == 'king') {
				invalidMoves = getInvalidMoves(selectedPiece);

				//printing
				var movesString = "Invalid Moves: ";
				for (var i = 0; i < invalidMoves.length; i++) {
					movesString += "[" + invalidMoves[i][0] + ", " + invalidMoves[i][1] + "], ";
				}
				console.log(movesString);
			}

			//clears the location where the piece is coming from
			boardArray[selectedPiece.x][selectedPiece.y] = null;
		}

		// Stop propagation of the event and stop any default
		//  browser action
		e.stopPropagation();
		e.preventDefault();

		sendBoardArray();
		//sendSelectedPiece();

		drawGame();
	}
}

function handleMouseMove(e){

	console.log("Moving: " + selectedPiece.color + " " + selectedPiece.name);

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
	var canvasX = e.pageX - rect.left;
	var canvasY = e.pageY - rect.top;

	selectedPiece.canvasX = canvasX;
	selectedPiece.canvasY = canvasY;


	sendSelectedPiece();
	//sendBoardArray();

	e.stopPropagation();

	drawGame();
}

function handleMouseUp(e){
	console.log("Mouse Up");
	/*console.log("Selected Piece: " + selectedPiece.color + " " + selectedPiece.name +
							", X: " + selectedPiece.canvasX + " Y: " + selectedPiece.canvasY);*/

	var rect = canvas.getBoundingClientRect();
	var canvasX = e.pageX - rect.left;
	var canvasY = e.pageY - rect.top;

	e.stopPropagation();

	document.removeEventListener("mousemove", handleMouseMove, true);
	document.removeEventListener("mouseup", handleMouseUp, true);

	var newX = index(canvasX);
	var newY = index(canvasY);


	//var condition = moveValidity(newY, newX);
	//checks if the move about to be made is valid
	if (moveValidity(selectedPiece, newY, newX)) { //valid move
		//stores the piece at the target location (if there is one)
		var tempPiece = boardArray[newY][newX];


		//places the selected piece at the location it is dropped
		boardArray[newY][newX] = {name: selectedPiece.name, image: selectedPiece.image,
															x: newY, y: newX, color: selectedPiece.color,
															canvasX: buffer + newY * scale, canvasY: buffer + newX * scale};

		updateKings();
		//checks if the move that was just made saved a king from a check
		//if it didnt the move is rejected
		var kingOnCheck = getKingOnCheck();

		if ((kingOnCheck != null) && (selectedPiece.color == kingOnCheck.color)) {
			//replaces what was at the target location
			boardArray[newY][newX] = tempPiece;

			//returns the selectedPiece to its origin
			boardArray[copyPiece.x][copyPiece.y] = copyPiece;
			console.log("Illegal Move");
		}
		else { //valid move was made
			//switches to next player
			nextPlayer();
			sendPlayerColor();
			console.log("Valid Move");
		}
		//switches to next player
		/*nextPlayer();
		sendPlayerColor();
		console.log("Valid Move");*/
	}
	else { //rejects the invalid move by restoring the piece to its original position
		boardArray[copyPiece.x][copyPiece.y] = copyPiece;
		console.log("Illegal Move");
	}

	selectedPiece = null;
	possibleMoves = null;
	invalidMoves = null;

	//switches to next player
	/*nextPlayer();
	sendPlayerColor();*/

	handlePawnPromotion();

	sendSelectedPiece();
	sendBoardArray();

	drawGame();
}

window.onload = (function(){
	//playerName = prompt("Enter your name: ", "Player");
	//prompt("Enter the color you want control:");

	//add mouse down listener to our canvas object
	canvas.addEventListener("mousedown", handleMouseDown);

	document.getElementById('name').innerHTML = "NAME: " + prompt("What is your name?", "Player");

	console.log("Dispatch the canvasDoneEvent");
	document.dispatchEvent(canvasDoneEvent);
	drawGame();
});

var receiveSelectedPiece = function receiveSelectedPiece(myPiece){
	if(myPiece != null){
		if(myPiece.color == "BLACK"){
			if (myPiece.name.substr(0, 4) == 'pawn') {
				myPiece.image = document.getElementById("BLACK_PAWN");
			}else if(myPiece.name.substr(0, 4) == 'rook'){
				myPiece.image = document.getElementById("BLACK_ROOK");
			}else if(myPiece.name.substr(0, 6) == 'bishop'){
				myPiece.image = document.getElementById("BLACK_BISHOP");
			}else if(myPiece.name.substr(0, 5) == 'queen'){
				myPiece.image = document.getElementById("BLACK_QUEEN");
			}else if(myPiece.name.substr(0, 4) == 'king'){
				myPiece.image = document.getElementById("BLACK_KING");
			}else if (myPiece.name.substr(0, 6) == 'knight') {
				myPiece.image = document.getElementById("BLACK_KNIGHT");
			}
		}else{
			if (myPiece.name.substr(0, 4) == 'pawn') {
				myPiece.image = document.getElementById("WHITE_PAWN");
			}else if(myPiece.name.substr(0, 4) == 'rook'){
				myPiece.image = document.getElementById("WHITE_ROOK");
			}else if(myPiece.name.substr(0, 6) == 'bishop'){
				myPiece.image = document.getElementById("WHITE_BISHOP");
			}else if(myPiece.name.substr(0, 5) == 'queen'){
				myPiece.image = document.getElementById("WHITE_QUEEN");
			}else if(myPiece.name.substr(0, 4) == 'king'){
				myPiece.image = document.getElementById("WHITE_KING");
			}else if (myPiece.name.substr(0, 6) == 'knight') {
				myPiece.image = document.getElementById("WHITE_KNIGHT");
			}
		}

		//console.log("SELECTED PIECE IS --> " + selectedPiece.color + " " + selectedPiece.name);
	}
	selectedPiece = myPiece;
	drawGame();
}

var recieveBoardArray = function recieveBoardArray(boardLocation){
	var myPiece;
	var name;

	//console.log("RECEIVED BOARD ARRAY");

	for (var rows = 0; rows < 8; rows++){
		for (var cols = 0; cols < 8; cols++){
			if(boardLocation[rows][cols] != undefined){
				myPiece = boardLocation[rows][cols];
				name = myPiece.name;
				if(myPiece.color == "BLACK"){
					if (myPiece.name.substr(0, 4) == 'pawn') {
						boardLocation[rows][cols].image = document.getElementById("BLACK_PAWN");
					}else if(myPiece.name.substr(0, 4) == 'rook'){
						boardLocation[rows][cols].image = document.getElementById("BLACK_ROOK");
					}else if(myPiece.name.substr(0, 6) == 'bishop'){
						boardLocation[rows][cols].image = document.getElementById("BLACK_BISHOP");
					}else if(myPiece.name.substr(0, 5) == 'queen'){
						boardLocation[rows][cols].image = document.getElementById("BLACK_QUEEN");
					}else if(myPiece.name.substr(0, 4) == 'king'){
						boardLocation[rows][cols].image = document.getElementById("BLACK_KING");
					}else if (myPiece.name.substr(0, 6) == 'knight') {
						boardLocation[rows][cols].image = document.getElementById("BLACK_KNIGHT");
					}
				}else{
					if (myPiece.name.substr(0, 4) == 'pawn') {
						boardLocation[rows][cols].image = document.getElementById("WHITE_PAWN");
					}else if(myPiece.name.substr(0, 4) == 'rook'){
						boardLocation[rows][cols].image = document.getElementById("WHITE_ROOK");
					}else if(myPiece.name.substr(0, 6) == 'bishop'){
						boardLocation[rows][cols].image = document.getElementById("WHITE_BISHOP");
					}else if(myPiece.name.substr(0, 5) == 'queen'){
						boardLocation[rows][cols].image = document.getElementById("WHITE_QUEEN");
					}else if(myPiece.name.substr(0, 4) == 'king'){
						boardLocation[rows][cols].image = document.getElementById("WHITE_KING");
					}else if (myPiece.name.substr(0, 6) == 'knight') {
						boardLocation[rows][cols].image = document.getElementById("WHITE_KNIGHT");
					}
				}
			}
		}
	}

	boardArray = boardLocation;
	updateKings();
	if (forfeit) {
		//alert("GAME OVER");
		resetGame();
		forfeit = false;
	}
	drawGame();
}
