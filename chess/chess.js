board = Array.from({length: 120}, _=>100);
castleKeys = Array.from({length: 16}, _=>0);
castlePermissions = 0;
enPassant = 0;
fiftyMoves = 0;
fileCharacters = `abcdefgh`
hisPly = 0;
listOfMoves = Array.from({length: 64 * 256}, _=>0);
material = [0,0];
moveListStart = Array.from({length: 64}, _=>0);
moveScores = Array.from({length: 64 * 256}, _=>0);
numbersOfPieces = Array.from({length: 13}, _=>0);
pieceCharacters = `.PNBRQKpnbrqk`
pieceColors = [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
pieceIsABishopOrAQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
pieceIsAKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
pieceIsAKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
pieceIsAPawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];
pieceIsARookOrAQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
pieceKeys = Array.from({length: 14 * 120}, _=>0);
pieceList = Array.from({length: 10 * 14}, _=>0);
pieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];
pieceValues = [0, 100, 325, 325, 500, 900, 50000, 100, 325, 325, 500, 900, 50000];
ply = 0;
positionKey = 0;
rankCharacters = `12345678`
side = 0;
sideCharacters = `wb-`
sideKey = 0;
startFen = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
thisIsABigPiece = [false, false, true, true, true, true, true, false, true, true, true, true, true];
thisIsAMajorPeece = [false, false, false, false, true, true, true, false, false, false, true, true, true];
thisIsAMinorPIece = [false, false, true, true, false, false, false, false, true, true, false, false, false];

function generatePositionKey(){
	let finalKey = 0;
	for(let square = 0; square < 120; square++ ){
		let piece = board[square];
		if ( piece != 0 && piece != 100 ) {
			finalKey ^= pieceKeys[piece * 120 + square];
		}
	}
	if ( side == 0 ) {
		finalKey ^= sideKey;
	}
	if ( enPassant != 99 ) {
		finalKey ^= pieceKeys[enPassant];
	}
	finalKey ^= castleKeys [ castlePermissions ];
	return finalKey
}

function init(){
	console.log(`init() called`);
	initiateFilesAndRanks();
	initiateHashKeys();
}

function initiateFilesAndRanks(){
	files = Array.from({length: 120}, _=>100);
	ranks = Array.from({length: 120}, _=>100);	
	for ( let rank = 0; rank < 8; rank++ ) {
		for ( let file = 0; file < 8; file++ ) {
			files [ rank * 10 + file + 21 ] = file;
			ranks [ rank * 10 + file + 21 ] = rank;
		}
	}
	console.log(`files[0]:${files[0]} ranks[0]:${ranks[0]}`)	
	console.log(`files[21]:${files[21]} ranks[21]:${ranks[21]}`)	
	console.log(`files[95]:${files[95]} ranks[95]:${ranks[95]}`)
}

function initiateHashKeys(){
	for ( let index=0;index<14 * 120; index++ ){
		pieceKeys[index] = rand();
	}
	sideKey = rand();
	for ( let index=0;index<14 * 120; index++ ){
		castleKeys[index] = rand();
	}
}

function parseFen(fen){
	
	resetBoard();
	
	let rank = 7	
	let file = 0
	let count = 0
	let fenCount = 0
	let piece=0
	while((rank >= 0) && fenCount < fen.length){
		count=1
		switch(fen[fenCount]){
			case 'p': piece = 7; break;
			case 'n': piece = 8; break;
			case 'b': piece = 9; break;
			case 'r': piece = 10; break;
			case 'q': piece = 11; break;
			case 'k': piece = 12; break;
			case 'P': piece = 1; break;
			case 'N': piece = 2; break;
			case 'B': piece = 3; break;
			case 'R': piece = 4; break;
			case 'Q': piece = 5; break;
			case 'K': piece = 6; break;
			
			case '1': 
			case '2': 
			case '3': 
			case '4': 
			case '5': 
			case '6': 
			case '7': 
			case '8':
				piece = 0
				count = fen[fenCount].charCodeAt() - '0'.charCodeAt()
				break
			case '/': 
			case ' ':
				rank--
				file = 0
				fenCount++
				continue
			default:
				console.log(`FEN error`);
				return
		}
		for(let i=0;i<count;i++){
			board[rank*10+file+21]=piece
			file++
		}
		fenCount++
	}
	side = (fen[fenCount] == 'w') ? 0:1;
	fenCount += 2
	for (let i=0;i<4;i++){
		if (fen[fenCount] == ' ') break;
		switch(fen[fenCount]){
			case 'K': castlePermissions |= 1;
			case 'Q': castlePermissions |= 2;
			case 'k': castlePermissions |= 4;
			case 'q': castlePermissions |= 8;
			default: break;
		}
		fenCount++
	}
	fenCount++
	if(fen[fenCount] != '-' ){
		file = fen[fenCount].charCodeAt() - 'a'.charCodeAt()
		rank = fen[fenCount+1].charCodeAt() - '0'.charCodeAt()
		console.log(`fen[fenCount]: ${fen[fenCount]} File: ${file} Rank: ${rank}`)
		enPassant = rank * 10 + file + 21;
	}
	positionKey = generatePositionKey()
}

function printBoard(){
	for (let rank=7; rank>-1; rank--){
		let line = `${rankCharacters[rank]}  `	
		for ( let file=0;file<7;file++){
			let piece = board[rank*10+file+21]
			line += ` ${pieceCharacters[piece]} `
		}
		console.log(line)
	}
	console.log(``)
	let line = `  `
	for ( let file=0;file<7;file++){
		line += ` ${fileCharacters[file]} `
	}
	console.log(line)
	console.log(`side: ${sideCharacters[side]}`)
	console.log(`en passant: ${enPassant}`)
	line = ""
	if(castlePermissions & 1) line += `K`
	if(castlePermissions & 2) line += `Q`
	if(castlePermissions & 4) line += `k`
	if(castlePermissions & 8) line += `q`
	console.log(`castle: ${line}`)
	console.log(`key: ${positionKey.toString(16)}`)
}
function rand(){
	return ( Math.floor ( ( Math.random () * 255 ) + 1 ) << 23 ) | ( Math.floor ( ( Math.random () * 255 ) + 1 ) << 16 ) | ( Math.floor ( ( Math.random () * 255 ) + 1 ) << 8 ) | Math.floor ( ( Math.random () * 255 ) + 1 );
}

function resetBoard() {
	board = Array.from({length: 120}, _=>100);
	for ( let row=0;row<8;row++){
		for(let col=0;col<8;col++){
			board[row*10+col+21] = 0
		}
	}
	for(let i=0;i<14*120;i++){
		pieceList[i]=0;
	}
	for(let i=0;i<2;i++){
		material[i] = 0;
	}
	for(let i=0;i<13;i++){
		numbersOfPieces[i]=0;
	}
	side = 2;
	enPassant = 99;
	fiftyMoves=0;
	ply=0
	hisPly=0
	castlePermissions=0
	positionKey=0
	moveListStart[ply] = 0
}


init();
console.log(`Main Init called`);
parseFen(startFen)
printBoard()