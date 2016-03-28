var socket = io.connect("/");

var main = function() {
	
//**********************//
// Array to keep track  //
// of pieces locations  //
//**********************//
	var positions = new Array(8);
	for (var x=0;x<8;x++) positions[x] = new Array(8);
	positions.name = "positions";
	var tempPositions;
	
//************************//
// Arrays to keep track   //
// of attacked locations  //
//************************//
	var attackedPosW = new Array(8);
	for (var x=0;x<8;x++) attackedPosW[x] = new Array(8);
	var attackedPosB = new Array(8);
	for (var x=0;x<8;x++) attackedPosB[x] = new Array(8);
	var attackedPosTempW;
	var attackedPosTempB;
	
	
//*********************************************************//
// initBoard                                               //
// Populates positions array with piece starting locations //
//*********************************************************//	
	var initBoard = function() {
		$("#playAgain").toggle();
		for (var y=0;y<8;y++){
			for(var z=0;z<8;z++){
				positions[y][z] = "N";
			}
		}
		for (var i=0;i<8;i++){ // Pawns
			positions[1][i] = "Bp";
			positions[6][i] = "Wp";
		} // Other Pieces
		positions[0][0] = "Br"; positions[0][7] = "Br"; positions[0][1] = "Bk"; positions[0][6] = "Bk"; 
		positions[0][2] = "Bb"; positions[0][5] = "Bb"; positions[0][3] = "Bq"; positions[0][4] = "Bking"; 
		positions[7][0] = "Wr"; positions[7][7] = "Wr"; positions[7][1] = "Wk"; positions[7][6] = "Wk";
		positions[7][2] = "Wb"; positions[7][5] = "Wb"; positions[7][3] = "Wq"; positions[7][4] = "Wking";
	};
	
	
//***********************************************************//
// movePiece                                                 //
// Moves a piece by changing destination location            //
// attributes to start location attributes                   //
//***********************************************************//	
	var movePiece = function(array) {
		array[Dr][Dc] = array[Fr][Fc];
		array[Fr][Fc] = "N";
		if (castleBK){
			array[0][7] = "N";
			array[0][5] = "Br";
		}
		if (castleBQ){
			array[0][0] = "N";
			array[0][3] = "Br";
		}
		if (castleWK){
			array[7][7] = "N";
			array[7][5] = "Wr";
		}
		if (castleWQ){
			array[7][0] = "N";
			array[7][3] = "Wr"
		}
		if (startPiece=="Wp"){ // White promotion
			if(Fr==1){
				array[Dr][Dc] = "Wq";
			}
		}
		if (startPiece=="Bp"){ // Black promotion
			if(Fr==6){
				array[Dr][Dc] = "Bq";
			}
		}
		if (array.name == "positions"){
			if (castleBQ){
				$("#1").attr("data-chess-piece", "none");
				$("#1").removeClass("rookB");
				$("#4").attr("data-chess-piece", "rookB");
				$("#4").addClass("rookB");
			}
			if (castleBK){
				$("#8").attr("data-chess-piece", "none");
				$("#8").removeClass("rookB");
				$("#6").attr("data-chess-piece", "rookB");
				$("#6").addClass("rookB");
			}
			if (castleWK){
				$("#64").attr("data-chess-piece", "none");
				$("#64").removeClass("rookA");
				$("#62").attr("data-chess-piece", "rookA");
				$("#62").addClass("rookA");
			}
			if (castleWQ){
				$("#57").attr("data-chess-piece", "none");
				$("#57").removeClass("rookA");
				$("#60").attr("data-chess-piece", "rookA");
				$("#60").addClass("rookA");
			}
			$("#"+firstID).attr("data-chess-piece", "none");
			$("#"+firstID).removeClass(firstAttr);
			$("#"+destID).attr("data-chess-piece", firstAttr);
			$("#"+destID).removeClass(secondAttr);
			$("#"+destID).addClass(firstAttr);
			
			if (startPiece == "Wp" && Fr == 1){ // White promotion
				$("#"+destID).removeClass(firstAttr);
				$("#"+destID).addClass("queenA");
				$("#"+destID).attr("data-chess-piece", "queenA");
			}
			if (startPiece == "Bp" && Fr == 6){ // Black promotion
				$("#"+destID).removeClass(firstAttr);
				$("#"+destID).addClass("queenB");
				$("#"+destID).attr("data-chess-piece", "queenB");
			}
			
		}
		
		
	};
	
	
//***********************************************************//
// whitePawnMove                                             //
// Contains logic for white pawn movement                    //
//***********************************************************//	
	var whitePawnMove = function() {
		if (Dc == Fc && Fr-1 == Dr && positions[Dr][Dc] == "N") return true;
		else if (Dc == Fc+1 && Dr == Fr-1 && endPiece != "N"){
			if ($.inArray(endPiece, whitePieces) > -1) return false;
			return true;
		} else if (Dc == Fc-1 && Dr == Fr-1 && endPiece != "N"){
			if ($.inArray(endPiece, whitePieces) > -1) return false;
			return true;
		} else if (Fr == 6 && Fc == Dc && Dr == 4){
			if (endPiece == "N" && positions[5][Dc] == "N") return true;
		} else return false;
	};
	

//***********************************************************//
// blackPawnMove                                             //
// Contains logic for black pawn movement                    //
//***********************************************************//	
	var blackPawnMove = function() {
		if (Dc == Fc && Fr+1 == Dr && positions[Dr][Dc] == "N") return true;
		else if (Dc == Fc+1 && Dr == Fr+1 && endPiece != "N"){
			if ($.inArray(endPiece, blackPieces) > -1) return false;
			return true;
		} else if (Dc == Fc-1 && Dr == Fr+1 && endPiece != "N"){
			if ($.inArray(endPiece, blackPieces) > -1) return false;
			return true;
		} else if (Fr == 1 && Fc == Dc && Dr == 3){
			if (endPiece == "N" && positions[2][Dc] == "N") return true;
		} else return false;
	};
	
	
//***********************************************************//
// knightMove                                                //
// Contains logic for knight movement                        //
//***********************************************************//
	var knightMove = function() {
		if (Dc-Fc == 2 || Fc-Dc == 2){
			if (Fr-Dr == 1 || Dr-Fr == 1){
				if (startPiece == "Bk"){
					if ($.inArray(endPiece, blackPieces) > -1) return false;
				} else {
					if ($.inArray(endPiece, whitePieces) > -1) return false;}
				return true;
			}
		} else if (Fr-Dr == 2 || Dr-Fr == 2){
			if (Dc-Fc == 1 || Fc-Dc == 1){
				if (startPiece == "Bk"){
					if ($.inArray(endPiece, blackPieces) > -1) return false;
				} else {
					if ($.inArray(endPiece, whitePieces) > -1) return false;}
				return true;
			}
		} else return false;
	}	
	
//***********************************************************//
// bishopMove                                                //
// Contains logic for bishop movement                        //
//***********************************************************//	
	var bishopMove = function() {
		var difC = Dc-Fc;
		var difR = Dr-Fr;
		if (difC == difR || difC == -difR) {
			var i = 1;
			if (Dc>Fc){
				if (Dr>Fr){
					while(Fr+i < Dr){
						if(positions[Fr+i][Fc+i] != "N") return false;
						i++;
					}
				} else {
					while(Fc+i < Dc){
						if(positions[Fr-i][Fc+i] != "N") return false;
						i++;
					}
				}
			} else {
				if (Dr>Fr){
					while(Fr+i < Dr){
						if(positions[Fr+i][Fc-i] != "N") return false;
						i++;
					}
				} else {
					while(Dr+i < Fr){
						if(positions[Fr-i][Fc-i] != "N") return false;
						i++
					}
				}
			}
			if (startPiece == "Bb" || startPiece == "Bq"){
				if ($.inArray(endPiece, blackPieces) > -1) return false;
			} else {
				if ($.inArray(endPiece, whitePieces) > -1) return false;
			}
			return true;	
		}
	};
	
	
//***********************************************************//
// rookMove                                                  //
// Contains logic for rook movement                          //
//***********************************************************//	
	var rookMove = function() {
		if (Fr == Dr){ // Same Row
			var i = Fc;
			if (Dc > Fc){ // Move Right
				i++;
				while (i < Dc){
					if(positions[Fr][i] != "N") return false;
					i++;
				}
			} else { // Move Left
				i--;
				while (i > Dc){
					if(positions[Fr][i] != "N") return false;
					i--;
				}
			}
		} else if (Dc == Fc){ // Same column
			var i = Fr;
			if (Dr > Fr){ // Move Down
				i++;
				while(i < Dr){
					if(positions[i][Dc] != "N") return false;
					i++;
				}
			} else { // Move Up
				i--;
				while(i > Dr){
					if(positions[i][Dc] != "N") return false;
					i--;
				}
			}
		} else return false; // Destination Row not same as first row and Destination Column not same as first Column
		if (startPiece == "Br" || startPiece == "Bq"){
			if ($.inArray(endPiece, blackPieces) > -1) return false;
		} else {
			if ($.inArray(endPiece, whitePieces) > -1) return false;
		}
		return true;
	};
	
//***********************************************************//
// queenMove                                                 //
// Contains logic for queen movement                         //
//***********************************************************//	
	var queenMove = function(){
		if (bishopMove() || rookMove()) return true;
		else return false;
	}
	
//***********************************************************//
// kingMove                                                  //
// Contains logic for king movement                          //
//***********************************************************//
	var kingMove = function(){
		difC = Dc-Fc;
		difR = Dr-Fr;
		if(difC >= -1 && difC <= 1){
			if(difR >= -1 && difR <= 1){
				if (startPiece == "Bking"){
					if ($.inArray(endPiece, blackPieces) > -1) return false;
				} else {
					if ($.inArray(endPiece, whitePieces) > -1) return false;
				}
				return true;
			}
		}
		if (startPiece == "Bking" && BkingMoved == false){ // Black castling
			if (Dc == 6 && Dr == 0 && BrookMovedK == false){ // Castling kingside
				if (tempPositions[0][6] == "N" && tempPositions[0][5] == "N"){
					if (attackedPosTempW[0][4] != "x" && attackedPosTempW[0][5] != "x" && attackedPosTempW[0][6] != "x"){
						castleBK = true;
						return true;
					}
				}
			}
			if (Dc == 2 && Dr == 0 && BrookMovedQ == false){ // Castling queenside
				if (tempPositions[0][1] == "N" && tempPositions[0][2] == "N" && tempPositions[0][3] == "N"){
					if (attackedPosTempW[0][1] != "x" && attackedPosTempW[0][2] != "x" && attackedPosTempW[0][3] != "x" && attackedPosTempW[0][4] != "x"){
						castleBQ = true;
						return true;
					}
				}
			}
		}
		if (startPiece == "Wking" && WkingMoved == false){ // White castling
			if (Dc == 6 && Dr == 7 && WrookMovedK == false){ // Castling kingside
				if (tempPositions[7][6] == "N" && tempPositions[7][5] == "N"){
					if (attackedPosTempB[7][4] != "x" && attackedPosTempB[7][5] != "x" && attackedPosTempB[7][6] != "x"){
						castleWK = true;
						return true;
					}
				}
			}
			if (Dc == 2 && Dr == 7 && WrookMovedQ == false){ // Castling queenside
				if (tempPositions[7][1] == "N" && tempPositions[7][2] == "N" && tempPositions[7][3] == "N"){
					if (attackedPosTempB[7][1] != "x" && attackedPosTempB[7][2] != "x" && attackedPosTempB[7][3] != "x" && attackedPosTempB[7][4] != "x"){
						castleWQ = true;
						return true;
					}
				}
			}
		}
		return false;
	}

	
//*********************************************************//
// canMove                                                 //
// Checks whether piece being moved can legally go to      //
// the requested destination                               //
//*********************************************************//
	var canMove = function() {
		if (startPiece == "Bp"){ // Black Pawn
			return blackPawnMove();
		} else if (startPiece == "Wp"){ // White Pawn
			return whitePawnMove();
		} else if (startPiece == "Br" || startPiece == "Wr"){ // Rooks
			return rookMove();
		} else if (startPiece == "Bb" || startPiece == "Wb"){ // Bishops
			return bishopMove();
		} else if (startPiece == "Bk" || startPiece == "Wk"){ // Knights
			return knightMove();
		} else if (startPiece == "Bq" || startPiece == "Wq"){ // Queen
			return queenMove();
		} else if (startPiece == "Bking" || startPiece == "Wking"){ // King
			return kingMove();
		}
		else return false;
	};
	
	
//************************************//
// isDef                              //
// Checks if arrays index is valid    //
//************************************//
	function isDef(i, y, array){
		if ((array[i]||[])[y] === undefined) return false;
		else return true;
	}
	
//***********************************************//
// bishopAttack                                  //
// Finds squares bishop attacks                  //
//***********************************************//
	function bishopAttack(i, y, array, attackArray){
		var a = i+1; var b = i+1; var c = i-1; var d = i-1; c1 = 0; c2 = 0;
		var e = y+1; var f = y-1; var g = y+1; var h = y-1; c3 = 0; c4 = 0;
		while (isDef(a, e, array) && c1<1){ // down, right
			if (array[a][e] == "N"){
				attackArray[a][e] = "x";
				a+=1; e+=1;
			} else{
				c1+=1;
			}
		}
		if (isDef(a, e, array)) attackArray[a][e] = "x";
		while (isDef(b, f, array) && c2<1){ // up, right
			if (array[b][f] == "N"){
				attackArray[b][f] = "x";
				b+=1; f-=1;
			} else{
				c2+=1;
			}
		}
		if (isDef(b, f, array)) attackArray[b][f] = "x";
		while (isDef(c, g, array) && c3<1){ // down, left
			if (array[c][g] == "N"){
				attackArray[c][g] = "x";
				c-=1; g+=1;
			} else{
				c3+=1;
			}
		}
		if (isDef(c, g, array)) attackArray[c][g] = "x";
		while (isDef(d, h, array) && c4<1){ // up, left
			if (array[d][h] == "N"){
				attackArray[d][h] = "x";
				d-=1; h-=1;
			} else{
				c4+=1;
			}
		}
		if (isDef(d, h, array)) attackArray[d][h] = "x";
		if (isDef(d, h, array)) attackArray[d][h] = "x";
	}
		
//******************************************//
// rookAttack                               //
// Finds squares rook attacks               //
//******************************************//
	function rookAttack(i, y, array, attackArray){
		var a = i+1; var b = i-1; var c = y+1; var d = y-1;
		var c1 = 0; var c2 = 0; var c3 = 0; var c4 = 0;
		while (isDef(a, y, array) && c1<1){ // Right
			if (array[a][y] == "N"){
				attackArray[a][y] = "x";
				a+=1;
			} else {
				c1 += 1;
			}
		}
		if (isDef(a, y, array)) attackArray[a][y] = "x";
		while (isDef(b, y, array) && c2<1){ // Left
			if (array[b][y] == "N"){
				attackArray[b][y] = "x";
				b-=1;
			} else {
				c2 += 1;
			}
		}
		if (isDef(b, y, array)) attackArray[b][y] = "x";
		while (isDef(i, c, array) && c3<1){ // Down
			if (array[i][c] == "N"){
				attackArray[i][c] = "x";
				c+=1;
			} else {
				c3 += 1;
			}
		}
		if (isDef(i, c, array)) attackArray[i][c] = "x";
		while (isDef(i, d, array) && c4<1){ // Up
			if (array[i][d] == "N"){
				attackArray[i][d] = "x";
				d-=1;
			} else {
				c4 += 1;
			}
		}
		if (isDef(i, d, array)) attackArray[i][d] = "x";
	};


//***************************************************//
// findAttackedSquaresW                              //
// Finds squares attacked by piece at location       //
//***************************************************//
	function findAttackedSquares(i, y, array, attackArray){
		if(array[i][y] == "Bp"){ // Black Pawn
			if (isDef(i+1, y-1, array)) attackArray[i+1][y-1]="x";
			if (isDef(i+1, y+1, array)) attackArray[i+1][y+1]="x";
		}
		if(array[i][y] == "Wp"){ // White Pawn
			if (isDef(i-1, y-1, array)) attackArray[i-1][y-1]="x";
			if (isDef(i-1, y+1, array)) attackArray[i-1][y+1]="x";
		}
		if(array[i][y] == "Bk" || array[i][y] == "Wk"){ // Knight
			if (isDef(i+2, y+1, array)) attackArray[i+2][y+1]="x";
			if (isDef(i+2, y-1, array)) attackArray[i+2][y-1]="x";
			if (isDef(i-2, y+1, array)) attackArray[i-2][y+1]="x";
			if (isDef(i-2, y-1, array)) attackArray[i-2][y-1]="x";
			if (isDef(i+1, y+2, array)) attackArray[i+1][y+2]="x";
			if (isDef(i+1, y-2, array)) attackArray[i+1][y-2]="x";
			if (isDef(i-1, y+2, array)) attackArray[i-1][y+2]="x";
			if (isDef(i-1, y-2, array)) attackArray[i-1][y-2]="x";
		}
		if(array[i][y] == "Bking" || array[i][y] == "Wking"){ // King
			if (isDef(i+1, y+1, array)) attackArray[i+1][y+1]="x";
			if (isDef(i+1, y, array)) attackArray[i+1][y]="x"; 
			if (isDef(i+1, y-1, array)) attackArray[i+1][y-1]="x"; 
			if (isDef(i, y+1, array)) attackArray[i][y+1]="x"; 
			if (isDef(i, y-1, array)) attackArray[i][y-1]="x"; 
			if (isDef(i-1, y+1, array)) attackArray[i-1][y+1]="x";
			if (isDef(i-1, y, array)) attackArray[i-1][y]="x";
			if (isDef(i-1, y-1, array)) attackArray[i-1][y-1]="x";
		}
		if(array[i][y] == "Wb" || array[i][y] == "Bb"){ // Bishop
			bishopAttack(i, y, array, attackArray);
		}
		if(array[i][y] == "Wr" || array[i][y] == "Br"){ // Rook
			rookAttack(i, y, array, attackArray);
		}
		if (array[i][y] == "Wq" || array[i][y] == "Bq"){ // Queen
			bishopAttack(i, y, array, attackArray);
			rookAttack(i, y, array, attackArray);
		}
	};
	
//***************************************************//
// updateAttackedSquares                             //
// Updates arrays of attacked squares                //
//***************************************************//
	function updateAttackedSquares(array, attackArrayA, attackArrayB) {
		for (var x = 0; x<8; x++){ // Populate attack arrays
			for (var z = 0; z<8; z++){
				attackArrayA[x][z] = "o";
				attackArrayB[x][z] = "o";
			}
		}
		for (var i = 0; i < 8; i++){
			for (var y = 0; y < 8; y++){
				if ($.inArray(array[i][y], blackPieces) > -1) { // Populate black attack array
					findAttackedSquares(i,y, array, attackArrayB);
				} 
				if ($.inArray(array[i][y], whitePieces) > -1){ // Populate white attack array
					findAttackedSquares(i,y, array, attackArrayA);
				}
			}
		}
	};
	
	
//***************************************************//
// isCheck                                           //
// Returns true if king is in attacked square        //
//***************************************************//
	var isCheck = function(array, kingPosI, kingPosY){
		if(array[kingPosI][kingPosY] == "x") return true;
		return false;
	};
	
//***************************************//	
// resetBoards                           //
// Copies real boards to temp boards     //
//***************************************//
	var resetBoards = function () {
		tempPositions = JSON.parse(JSON.stringify(positions));
		attackedPosTempW = JSON.parse(JSON.stringify(attackedPosW));
		attackedPosTempB = JSON.parse(JSON.stringify(attackedPosB));
	}
	
//********************************************//	
// WbishopCheck                               //
// Checks if white bishop can block checkmate //
//********************************************//
	var WbishopCheck = function(i, y) {
		resetBoards();
		var a = i+1; var b = i+1; var c = i-1; var d = i-1; var c1 = 0; var c2 = 0;
		var e = y+1; var f = y-1; var g = y+1; var h = y-1; var c3 = 0; var c4 = 0;
		while(isDef(a, e, tempPositions) && c1 < 1){
			Dr = a; Dc = e;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				a += 1; e +=1;
				resetBoards();
			} else {
				c1 += 1;
			}
		}
		while(isDef(b, f, tempPositions) && c2 < 1){
			Dr = b; Dc = f;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				b += 1; f -=1;
				resetBoards();
			} else {
				c2 += 1;
			}
		}
		while(isDef(c, g, tempPositions) && c3 < 1){
			Dr = c; Dc = g;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				c -= 1; g +=1;
				resetBoards();
			} else {
				c3 += 1;
			}
		}
		while(isDef(d, h, tempPositions) && c4 < 1){
			Dr = d; Dc = h;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				d -= 1; h -=1;
				resetBoards();
			} else {
				c4 += 1;
			}
		}
		return true;
	}
	
//********************************************//	
// BbishopCheck                               //
// Checks if black bishop can block checkmate //
//********************************************//
	var BbishopCheck = function(i, y) {
		resetBoards();
		var a = i+1; var b = i+1; var c = i-1; var d = i-1; var c1 = 0; var c2 = 0;
		var e = y+1; var f = y-1; var g = y+1; var h = y-1; var c3 = 0; var c4 = 0;
		while(isDef(a, e, tempPositions) && c1 < 1){
			Dr = a; Dc = e;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				a += 1; e +=1;
				resetBoards();
			} else {
				c1 += 1;
			}
		}
		while(isDef(b, f, tempPositions) && c2 < 1){
			Dr = b; Dc = f;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				b += 1; f -=1;
				resetBoards();
			} else {
				c2 += 1;
			}
		}
		while(isDef(c, g, tempPositions) && c3 < 1){
			Dr = c; Dc = g;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				c -= 1; g +=1;
				resetBoards();
			} else {
				c3 += 1;
			}
		}
		while(isDef(d, h, tempPositions) && c4 < 1){
			Dr = d; Dc = h;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				d -= 1; h -=1;
				resetBoards();
			} else {
				c4 += 1;
			}
		}
		return true;
	}
	
//******************************************//	
// WrookCheck                               //
// Checks if white rook can block checkmate //
//******************************************//
	var WrookCheck = function(i, y) {
		resetBoards();
		var c1 = 0; var c2 = 0; var c3 = 0; var c4 = 0;
		var a = i-1; var b = i+1; var c = y+1; var d = y-1;
		while(isDef(a, y, tempPositions) && c1 < 1){ // Up
			Dr = a; Dc = y;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				a -=1;
				resetBoards();
				
			} else {
				c1 += 1;
			}
		}
		while(isDef(b, y, tempPositions) && c2 < 1){ // Down
			Dr = b; Dc = y;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				b +=1;
				resetBoards();
			} else {
				c2 += 1;
			}
		}
		while(isDef(i, c, tempPositions) && c3 < 1){ // Right
			Dr = i; Dc = c;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				c +=1;
				resetBoards();
			} else {
				c3 += 1;
			}
		}
		while(isDef(i, d, tempPositions) && c4 < 1){ // Left
			Dr = i; Dc = d;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
				d -=1;
				resetBoards();
			} else {
				c4 += 1;
			}
		}
		return true;
	}
	
	
//******************************************//	
// BrookCheck                               //
// Checks if black rook can block checkmate //
//******************************************//
	var BrookCheck = function(i, y) {
		resetBoards();
		var c1 = 0; var c2 = 0; var c3 = 0; var c4 = 0;
		var a = i-1; var b = i+1; var c = y+1; var d = y-1;
		while(isDef(a, y, tempPositions) && c1 < 1){ // Up
			Dr = a; Dc = y;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				a -=1;
				resetBoards();
				
			} else {
				c1 += 1;
			}
		}
		while(isDef(b, y, tempPositions) && c2 < 1){ // Down
			Dr = b; Dc = y;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				b +=1;
				resetBoards();
			} else {
				c2 += 1;
			}
		}
		while(isDef(i, c, tempPositions) && c3 < 1){ // Right
			Dr = i; Dc = c;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				c +=1;
				resetBoards();
			} else {
				c3 += 1;
			}
		}
		while(isDef(i, d, tempPositions) && c4 < 1){ // Left
			Dr = i; Dc = d;
			endPiece = tempPositions[Dr][Dc];
			if (canMove()){
				movePiece(tempPositions);
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
				d -=1;
				resetBoards();
			} else {
				c4 += 1;
			}
		}
		return true;
	}

	
//*************************************************************************************//
// checkIfCheck                                                                        //
// Checks if every possible move for a piece results in own king still being in check  //
//*************************************************************************************//
	var checkIfCheck = function(i, y){
		resetBoards();
		startPiece = tempPositions[i][y];
		Fr = i; Fc = y; 
		if (whiteToMove){
			if (startPiece == "Wp"){ // Check if white pawns can stop check mate
				if (isDef(i-1, y, tempPositions)){ // Move pawn forwards
					Dr = i-1; Dc = y;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-1, y-1, tempPositions)){ // Capture piece to left
					resetBoards();
					Dr = i-1; Dc = y-1;
					endPiece = tempPositions[i-1][y-1];
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-1, y+1, tempPositions)){ // Capture piece to right
					resetBoards();
					Dr = i-1; Dc = y+1;
					endPiece = tempPositions[i-1][y+1];
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (i==6){ // Two squares forwards
					resetBoards();
					endPiece = tempPositions[i-2][y];
					Dr = i-2; Dc = y;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				} 
			}
			if (startPiece == "Wk"){ // Check if knight can stop checkmate
				if (isDef(i+1, y+2, tempPositions)){ // Right bottom
					endPiece = tempPositions[i+1][y+1];
					Dr = i+1; Dc = y+2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i+1, y-2, tempPositions)){ // Left bottom
					resetBoards();
					endPiece = tempPositions[i+1][y-2];
					Dr = i+1; Dc = y-2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-1, y-2, tempPositions)){ // Left top
					resetBoards();
					endPiece = tempPositions[i-1][y-2];
					Dr = i-1; Dc = y-2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-1, y+2, tempPositions)){ // Right top
					resetBoards();
					endPiece = tempPositions[i-1][y+2];
					Dr = i-1; Dc = y+2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i+2, y-1, tempPositions)){ // Bottom left
					resetBoards();
					endPiece = tempPositions[i+2][y-1];
					Dr = i+2; Dc = y-1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i+2, y+1, tempPositions)){ // Bottom right
					resetBoards();
					endPiece = tempPositions[i+2][y+1];
					Dr = i+2; Dc = y+1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-2, y-1, tempPositions)){ // Top left
					resetBoards();
					endPiece = tempPositions[i-2][y-1];
					Dr = i-2; Dc = y-1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
				if (isDef(i-2, y+1, tempPositions)){ // Top right
					resetBoards();
					endPiece = tempPositions[i-2][y+1];
					Dr = i-2; Dc = y+1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempB, kingWposI, kingWposY)) return false;
					}
				}
			}
			if (startPiece == "Wr"){ // Check if rook can stop checkmate
				if (!WrookCheck(i, y)) return false;
			}
			if (startPiece == "Wb"){ // Check if bishop can stop checkmate
				if (!WbishopCheck(i, y)) return false;
			}
			if (startPiece == "Wq"){ // Check if queen can stop checkmate
				if (!WbishopCheck(i, y) || !WrookCheck(i, y)) return false;
			}
		}
		
//************************ Black Pieces **********************//
		else {
			if (startPiece == "Bp"){ // Check if black pawns can stop check mate
				if (isDef(i+1, y, tempPositions)){ // Move pawn forwards
					Dr = i+1; Dc = y;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i+1, y-1, tempPositions)){ // Capture piece to left
					resetBoards();
					Dr = i+1; Dc = y-1;
					endPiece = tempPositions[i+1][y-1];
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i+1, y+1, tempPositions)){ // Capture piece to right
					resetBoards();
					Dr = i+1; Dc = y+1;
					endPiece = tempPositions[i+1][y+1];
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (i==1){ // Two squares forwards
					resetBoards();
					endPiece = tempPositions[i+2][y];
					Dr = i+2; Dc = y;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				} 
			}
			if (startPiece == "Bk"){ // Check if knight can stop checkmate
				if (isDef(i+1, y+2, tempPositions)){ // Right bottom
					endPiece = tempPositions[i+1][y+1];
					Dr = i+1; Dc = y+2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i+1, y-2, tempPositions)){ // Left bottom
					resetBoards();
					endPiece = tempPositions[i+1][y-2];
					Dr = i+1; Dc = y-2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i-1, y-2, tempPositions)){ // Left top
					resetBoards();
					endPiece = tempPositions[i-1][y-2];
					Dr = i-1; Dc = y-2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i-1, y+2, tempPositions)){ // Right top
					resetBoards();
					endPiece = tempPositions[i-1][y+2];
					Dr = i-1; Dc = y+2;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i+2, y-1, tempPositions)){ // Bottom left
					resetBoards();
					endPiece = tempPositions[i+2][y-1];
					Dr = i+2; Dc = y-1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i+2, y+1, tempPositions)){ // Bottom right
					resetBoards();
					endPiece = tempPositions[i+2][y+1];
					Dr = i+2; Dc = y+1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i-2, y-1, tempPositions)){ // Top left
					resetBoards();
					endPiece = tempPositions[i-2][y-1];
					Dr = i-2; Dc = y-1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
				if (isDef(i-2, y+1, tempPositions)){ // Top right
					resetBoards();
					endPiece = tempPositions[i-2][y+1];
					Dr = i-2; Dc = y+1;
					if (canMove()){
						movePiece(tempPositions);
						updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
						if (!isCheck(attackedPosTempW, kingBposI, kingBposY)) return false;
					}
				}
			}
			if (startPiece == "Br"){ // Check if rook can stop checkmate
				if (!BrookCheck(i, y)) return false;
			}
			if (startPiece == "Bb"){ // Check if bishop can stop checkmate
				if (!BbishopCheck(i, y)) return false;
			}
			if (startPiece == "Bq"){ // Check if queen can stop checkmate
				if (!BbishopCheck(i, y) || !BrookCheck(i, y)) return false;
			}
		}
		return true; // Could not find piece that blocks checkmate
	}
	
//***************************************************//
// isCheckmate                                       //
// Returns true if king is in checkmate              //
//***************************************************//
	var isCheckmate = function(){
		if (whiteToMove){ // White to move
			resetBoards();
			tempPositions[kingWposI][kingWposY] = "N";
			updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
			if (isDef(kingWposI+1, kingWposY+1, positions)) // See if king can move into non-attacked square
				if (attackedPosB[kingWposI+1][kingWposY+1] != "x" && $.inArray(positions[kingWposI+1][kingWposY+1], whitePieces) < 0){
					if (attackedPosTempB[kingWposI+1][kingWposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI+1, kingWposY, positions))
				if (attackedPosB[kingWposI+1][kingWposY] != "x" && $.inArray(positions[kingWposI+1][kingWposY], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI+1][kingWposY] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI+1, kingWposY-1, positions))
				if (attackedPosB[kingWposI+1][kingWposY-1] != "x" && $.inArray(positions[kingWposI+1][kingWposY-1], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI+1][kingWposY-1] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI, kingWposY+1, positions))
				if (attackedPosB[kingWposI][kingWposY+1] != "x" && $.inArray(positions[kingWposI][kingWposY+1], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI][kingWposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI, kingWposY-1, positions))
				if (attackedPosB[kingWposI][kingWposY-1] != "x" && $.inArray(positions[kingWposI][kingWposY-1], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI][kingWposY-1] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI-1, kingWposY+1, positions))
				if (attackedPosB[kingWposI-1][kingWposY+1] != "x" && $.inArray(positions[kingWposI-1][kingWposY+1], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI-1][kingWposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI-1, kingWposY, positions))
				if (attackedPosB[kingWposI-1][kingWposY] != "x" && $.inArray(positions[kingWposI-1][kingWposY], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI-1][kingWposY] != "x"){
						return false;
					}
				}
			if (isDef(kingWposI-1, kingWposY-1, positions))
				if (attackedPosB[kingWposI-1][kingWposY-1] != "x" && $.inArray(positions[kingWposI-1][kingWposY-1], whitePieces) < 0) {
					if (attackedPosTempB[kingWposI-1][kingWposY-1] != "x"){
						return false;
					}
				}
			for (var i = 0; i < 8; i++){ // Check remaining pieces
				for (var y = 0; y < 8; y++){
					if (!checkIfCheck(i, y)) {
						return false;
					} // Check if piece at location can stop checkmate
				}
			}
			return true; // Its Checkmate!	
		} else { // Black to move
			resetBoards();
			tempPositions[kingBposI][kingBposY] = "N";
			updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
			if (isDef(kingBposI+1, kingBposY+1, positions)) // See if king can move into non-attacked square
				if (attackedPosW[kingBposI+1][kingBposY+1] != "x" && $.inArray(positions[kingBposI+1][kingBposY+1], blackPieces) < 0){
					if (attackedPosTempW[kingBposI+1][kingBposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI+1, kingBposY, positions))
				if (attackedPosW[kingBposI+1][kingBposY] != "x" && $.inArray(positions[kingBposI+1][kingBposY], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI+1][kingBposY] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI+1, kingBposY-1, positions))
				if (attackedPosW[kingBposI+1][kingBposY-1] != "x" && $.inArray(positions[kingBposI+1][kingBposY-1], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI+1][kingBposY-1] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI, kingBposY+1, positions))
				if (attackedPosW[kingBposI][kingBposY+1] != "x" && $.inArray(positions[kingBposI][kingBposY+1], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI][kingBposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI, kingBposY-1, positions))
				if (attackedPosW[kingBposI][kingBposY-1] != "x" && $.inArray(positions[kingBposI][kingBposY-1], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI][kingBposY-1] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI-1, kingBposY+1, positions))
				if (attackedPosW[kingBposI-1][kingBposY+1] != "x" && $.inArray(positions[kingBposI-1][kingBposY+1], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI-1][kingBposY+1] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI-1, kingBposY, positions))
				if (attackedPosW[kingBposI-1][kingBposY] != "x" && $.inArray(positions[kingBposI-1][kingBposY], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI-1][kingBposY] != "x"){
						return false;
					}
				}
			if (isDef(kingBposI-1, kingBposY-1, positions))
				if (attackedPosW[kingBposI-1][kingBposY-1] != "x" && $.inArray(positions[kingBposI-1][kingBposY-1], blackPieces) < 0) {
					if (attackedPosTempW[kingBposI-1][kingBposY-1] != "x"){
						return false;
					}
				}
			for (var i = 0; i < 8; i++){ // Check remaining pieces
				for (var y = 0; y < 8; y++){
					if (!checkIfCheck(i, y)){
						return false; // Check if piece at location can stop checkmate
					}
				}
			}
			return true; // Its Checkmate!
		}
	}
	
	
//******************//
// Random variables //
//******************//
	initBoard();
	var whitePieces = ["Wp", "Wr", "Wb", "Wk", "Wq", "Wking"]; // List of white pieces
	var blackPieces = ["Bp", "Br", "Bb", "Bk", "Bq", "Bking"]; // List of black pieces
	var firstTouch = false;
	var check = false;
	var startPiece = "N";
	var endPiece = "N";
	var Fr = -1; // First Row
	var Fc = -1; // First Column
	var firstAttr = "";
	var secondAttr = "";
	var Dr = -1; // Destination Row
	var Dc = -1; // Destination Column
	var firstID = 0;
	var destID = 0;
	var lastSqrColor = "none";
	var posStr = "";
	var whiteToMove = true;
	var kingBposI = 0; var kingBposY = 4;
	var kingWposI = 7; var kingWposY = 4;
	var kingBposTempI = 0; var kingBposTempY = 4;
	var kingWposTempI = 7; var kingWposTempY = 4;
	var BkingMoved = false; // For checking if king moved for castling
	var WkingMoved = false; // For checking if king moved for castling
	var WrookMovedK = false; // King side white rook moved
	var WrookMovedQ = false; // Queen side white rook moved
	var BrookMovedK = false; // King side black rook moved
	var BrookMovedQ = false; // Queen side black rook moved
	var castleBK = false; // Black castling king side
	var castleBQ = false; // Black castling queen side
	var castleWK = false; // White castling king side
	var castleWQ = false; // White castling queen side
	var checkMate = false;
	var myId = 0;
	var sqrA;
	var sqrB;
	
	
//*********************************************************//
// Square Clicks                                           //
// Checks if user is pressing piece to move or destination //
// then performs check to see if move is legal             //
//*********************************************************//
	$('.square').click(function(){
		var r = parseInt($(this).attr('row'));
		var c = parseInt($(this).attr('col'));
		var i = parseInt($(this).attr('id'));
		if (!checkMate){
			if (whiteToMove && myId == 1) handleLogic(r, c, i);
			if (!whiteToMove && myId == 2) handleLogic(r, c, i);
		}
	});
	
	
//*****************************//
// Handle Logic                //
// Calls necessary validations //
// upon requested move         //
//*****************************//
	function handleLogic(r, c, i){
		if(!firstTouch && !checkMate){ // If user is pressing piece to be moved
			Fr = r
			Fc = c
			if (positions[Fr][Fc] != "N"){ // Check user is pressing on piece
				startPiece = positions[Fr][Fc]; 
				if (whiteToMove){ // If white to move
					if ($.inArray(startPiece, whitePieces) > -1){ // Makes sure player pressed white piece
						sqrA = makeSquare(Fr, Fc, i);
						firstTouch = true;
						firstID = i;
						posStr = positions[Fr][Fc];
						firstAttr = pieceDict[posStr][0]; // Get html attribute from piece dictionary
						if($("#"+firstID).hasClass('light')) lastSqrColor = 'light';
						else lastSqrColor = 'dark';
						$("#"+firstID).removeClass(lastSqrColor);
						$("#"+firstID).addClass('selected'); // Make selected square blue
					}
				} else { // If black to move
					if ($.inArray(startPiece, blackPieces) > -1){ // Makes sure player pressed black piece
						sqrA = makeSquare(Fr, Fc, i);
						firstTouch = true;
						firstID = i;
						posStr = positions[Fr][Fc];
						firstAttr = pieceDict[posStr][0]; // Get html attribute from piece dictionary
						if($("#"+firstID).hasClass('light')) lastSqrColor = 'light';
						else lastSqrColor = 'dark';
						$("#"+firstID).removeClass(lastSqrColor);
						$("#"+firstID).addClass('selected'); // Make selected square blue
					}
				}
			} 
		} else { // If user is pressing square to move piece
			$("#"+firstID).removeClass('selected');
			$("#"+firstID).addClass(lastSqrColor); // Turn piece square back to original color
			Dr = r;
			Dc = c;
			destID = i;
			posStr = positions[Dr][Dc];
			endPiece = positions[Dr][Dc];
			secondAttr = pieceDict[posStr][0];
			if (check && firstID != destID && canMove()){ // If king is in check
				tempPositions = JSON.parse(JSON.stringify(positions)); // Copying arrays to temp arrays
				attackedPosTempB = JSON.parse(JSON.stringify(attackedPosB));
				attackedPosTempW = JSON.parse(JSON.stringify(attackedPosW));
				if(startPiece=="Bking"){ // Change temporary king position if king moved
					kingBposTempI = Dr;
					kingBposTempY = Dc;
				}
				if(startPiece=="Wking"){ // Change temporary king position if king moved
					kingWposTempI = Dr;
					kingWposTempY = Dc;
				}
				movePiece(tempPositions); // Move pieces on temporary board
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB); // Update attacked squares on temporary boards
				if (whiteToMove){ // If white to move
					if (!isCheck(attackedPosTempB, kingWposTempI, kingWposTempY)){ // Check if temporary move resulted in check --> no check
						sqrB = makeSquare(Dr, Dc, i);
						socket.emit("move", {sqrA, sqrB});
						if (startPiece == "Wr" && Fc == 7) WrookMovedK = true;
						if (startPiece == "Wr" && Fc == 0) WrookMovedQ = true;
						if (startPiece == "Wking") WkingMoved = true;
						$("#checkText").text("");
						$("#toMove").text('Black to move');
						kingWposI = kingWposTempI;
						kingWposY = kingWposTempY;
						check = false;
						movePiece(positions) // Move pieces on real board
						whiteToMove = false;
						updateAttackedSquares(positions, attackedPosW, attackedPosB);
					} else { // If still check, move kings position to original position
						kingWposTempI = kingWposI;
						kingWposTempY = kingWposY;
					}
				} else { // If black to move
					if (!isCheck(attackedPosTempW, kingBposTempI, kingBposTempY)){ // Check if temporary move resulted in check --> no check
						sqrB = makeSquare(Dr, Dc, i);
						socket.emit("move", {sqrA, sqrB});
						if (startPiece == "Br" && Fc == 7) BrookMovedK = true;
						if (startPiece == "Br" && Fc == 0) BrookMovedQ = true;
						if (startPiece == "Bking") BkingMoved = true;
						$("#checkText").text("");
						$("#toMove").text('White to move');
						kingBposI = kingBposTempI;
						kingBposY = kingBposTempY;
						check = false;
						movePiece(positions) // Move pieces on real board
						whiteToMove = true;
						updateAttackedSquares(positions, attackedPosW, attackedPosB);
					} else { // If still check, move kings position to original position
						kingBposTempI = kingBposI;
						kingBposTempY = kingBposY;
					}
				}
			}
			
			else if(firstID != destID && canMove() && !check){ // Normal move, checks requested move doesn't make own king in check
				tempPositions = JSON.parse(JSON.stringify(positions)); // Copying arrays to temp arrays
				attackedPosTempW = JSON.parse(JSON.stringify(attackedPosW));
				attackedPosTempB = JSON.parse(JSON.stringify(attackedPosB));
				if (startPiece == "Bking"){ // Move temp king position if king move is requested
					kingBposTempI = Dr;
					kingBposTempY = Dc;
				}
				if (startPiece == "Wking"){ // Move temp king position if king move is requested
					kingWposTempI = Dr;
					kingWposTempY = Dc;
				}
				movePiece(tempPositions); // Make requested move on temp board
				updateAttackedSquares(tempPositions, attackedPosTempW, attackedPosTempB);
				if (whiteToMove){ // If white to move
					if (!isCheck(attackedPosTempB, kingWposTempI, kingWposTempY)){ // Check move didn't put white king in check
						sqrB = makeSquare(Dr, Dc, i);
						socket.emit("move", {sqrA, sqrB});
						if (startPiece == "Wr" && Fc == 7) WrookMovedK = true;
						if (startPiece == "Wr" && Fc == 0) WrookMovedQ = true;
						if (startPiece == "Wking") WkingMoved = true;
						$("#toMove").text("Black to move");
						kingWposI = kingWposTempI;
						kingWposY = kingWposTempY;
						movePiece(positions); // Update positions on real board
						castleWK = false;
						castleWQ = false;
						whiteToMove = false;
						updateAttackedSquares(positions, attackedPosW, attackedPosB);
					} else { // Requested move put own king in check (illegal)
						resetBoards();
						kingWposTempI = kingWposI;
						kingWposTempY = kingWposY;
					}
				} else { // If black to move
					if (!isCheck(attackedPosTempW, kingBposTempI, kingBposTempY)){ // Check move didn't put black king in check
						sqrB = makeSquare(Dr, Dc, i);
						socket.emit("move", {sqrA, sqrB});
						if (startPiece == "Br" && Fc == 7) BrookMovedK = true;
						if (startPiece == "Br" && Fc == 0) BrookMovedQ = true;
						if (startPiece == "Bking") BkingMoved = true;
						$("#toMove").text("White to move");
						kingBposI = kingBposTempI;
						kingBposY = kingBposTempY;
						movePiece(positions); // Update positions on real board
						castleBK = false;
						castleBQ = false;
						whiteToMove = true;
						updateAttackedSquares(positions, attackedPosW, attackedPosB);
					} else { // Requested move put own king in check (illegal)
						resetBoards();
						kingBposTempI = kingBposI;
						kingBposTempY = kingBposY;
					}
				}			
			} else{
				
			}
			firstTouch = false;
			if (isCheck(attackedPosB, kingWposI, kingWposY)){ // Checks if move resulted in check
				check = true;
				$("#checkText").text("Check!");
				if (isCheckmate()){
					$("#toMove").addClass("makeRed");
					$("#toMove").text('Checkmate');
					$("#checkText").text("");
					checkMate = true;
					$("#playAgain").toggle();
				}
			}
			if (isCheck(attackedPosW, kingBposI, kingBposY)){ // Checks if move resulted in check
				check = true;
				$("#checkText").text("Check!");
				if (isCheckmate()){
					$("#toMove").addClass("makeRed");
					$("#toMove").text('Checkmate');
					$("#checkText").text("");
					checkMate = true;
					$("#playAgain").toggle();
				}
			}
		}
	}
	
	
//**************************//
// Play Again               //
// Resets board after user  //
// clicks play again button //
//**************************//	
	$("#playAgain").click(function(){
		initBoard();
		whiteToMove = true;
		kingBposI = 0; var kingBposY = 4;
		kingWposI = 7; var kingWposY = 4;
		kingBposTempI = 0; var kingBposTempY = 4;
		kingWposTempI = 7; var kingWposTempY = 4;
		BkingMoved = false; // For checking if king moved for castling
		WkingMoved = false; // For checking if king moved for castling
		WrookMovedK = false; // King side white rook moved
		WrookMovedQ = false; // Queen side white rook moved
		BrookMovedK = false; // King side black rook moved
		BrookMovedQ = false; // Queen side black rook moved
		castleBK = false; // Black castling king side
		castleBQ = false; // Black castling queen side
		castleWK = false; // White castling king side
		castleWQ = false; // White castling queen side
		checkMate = false;
		check = false;
		$("#toMove").removeClass("makeRed");
		$("#toMove").text('White to move');
		$("#checkText").text("");
		for (var i = 1; i<65; i++){
			$("#"+i).removeClass('rookB rookA knightB knightA bishopB bishopA pawnB pawnA kingB kingA queenB queenA');
		}
		
		for (var i = 1; i<65; i++){
			if (i==1 || i==8){
				$("#"+i).addClass("rookB");
				$("#"+i).attr('data-chess-piece', 'rookB');
			}
			if (i==2 || i==7){
				$("#"+i).addClass("knightB");
				$("#"+i).attr('data-chess-piece', 'knightB');
			}
			if (i==3 || i==6){
				$("#"+i).addClass('bishopB');
				$("#"+i).attr('data-chess-piece', 'bishopB');
			} 
			if (i==4){
				$("#"+i).addClass('queenB');
				$("#"+i).attr('data-chess-piece', 'queenB');
			}
			if (i==5){
				$("#"+i).addClass('kingB');
				$("#"+i).attr('data-chess-piece', 'kingB');
			}
			if (i>=9 && i<=16){
				$("#"+i).addClass('pawnB');
				$("#"+i).attr('data-chess-piece', 'pawnB');
			}
			if (i>=17 && i<=48){
				$("#"+i).attr('data-chess-piece', 'none');
			}
			if (i>48 && i<57){
				$("#"+i).addClass('pawnA');
				$("#"+i).attr('data-chess-piece', 'pawnA');
			}
			if (i==57 || i==64){
				$("#"+i).addClass("rookA");
				$("#"+i).attr('data-chess-piece', 'rookA');
			}
			if (i==58 || i==63){
				$("#"+i).addClass("knightA");
				$("#"+i).attr('data-chess-piece', 'knightA');
			}
			if(i==59 || i==62){
				$("#"+i).addClass('bishopA');
				$("#"+i).attr('data-chess-piece', 'bishopA');
			}
			if (i==60){
				$("#"+i).addClass('queenA');
				$("#"+i).attr('data-chess-piece', 'queenA');
			}
			if (i==61){
				$("#"+i).addClass('kingA');
				$("#"+i).attr('data-chess-piece', 'kingA');
			}
		
		}
		
	});

//*************************//
// Make Square             //
// Used to make opponent's //
// move on own board       //
//*************************//	
	function makeSquare(row, col, id){
		var sqr =[];
		sqr.push(row, col, id);
		return sqr;
	}
	
//************************//
// Gets what color you're //
// playing as from server //
//************************//
	socket.on("joined", function(data){
		myId = data;
		$("#joinButton").toggle();
		if (myId == 1){
			$("#byText").text("Playing as white");
			$("#byText").css({color: '#708090'});
		}
		if (myId == 2){
			$("#byText").text("Playing as black");
			$("#byText").css({color: '#708090'});
		}
		if (myId == 0){
			$("#byText").text("Game full, please refresh in a few minutes");
			$("#byText").css({color: '#708090'});
		}
	});
	
//************************//
// Makes move opponent    //
// played from server     //
//************************//
	socket.on("moveMade", function(data){
		handleLogic(data.sqrA[0], data.sqrA[1], data.sqrA[2]);
		handleLogic(data.sqrB[0], data.sqrB[1], data.sqrB[2]);
	});
	
	
//***************************************************************************//
// Dictionary to obtain html attribute names from values in positions array  //
//***************************************************************************//
	var pieceDict = {
		"Br":["rookB"], "Bk":["knightB"], "Bq":["queenB"], "Bp":["pawnB"], "Bb":["bishopB"], "Bking":["kingB"],
		"Wr":["rookA"], "Wk":["knightA"], "Wq":["queenA"], "Wp":["pawnA"], "Wb":["bishopA"], "Wking":["kingA"],
		"N":["none"]
	};
	
	
};

$(document).ready(main);


//*************************//
// Join                    //
// When join button is     //
// pressed, send to server //
//*************************//
function join(){
	$("#joinButton").attr('disabled', true);
	socket.emit("playerJoining");
}