board = Array.from({length: 120}, _=>100);
castlePermissions = 0;
fiftyMoves = 0;
hisPly = 0;
pieceColors = [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
pieceIsABishopOrAQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
pieceIsAKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
pieceIsAKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
pieceIsAPawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];
pieceIsARookOrAQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
pieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];
pieceValues = [0, 100, 325, 325, 500, 900, 50000, 100, 325, 325, 500, 900, 50000];
ply = 0;
side = 0;
thisIsABigPiece = [false, false, true, true, true, true, true, false, true, true, true, true, true];
thisIsAMajorPeece = [false, false, false, false, true, true, true, false, false, false, true, true, true];
thisIsAMinorPIece = [false, false, true, true, false, false, false, false, true, true, false, false, false];

function init(){
	console.log(`init() called`);
	initiateFilesAndRanks();
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

init();
console.log(`Main Init called`);
