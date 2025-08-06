board = Array.from({length: 120}, _=>100);
castlePermissions = 0;
fiftyMoves = 0;
hisPly = 0;
ply = 0;
side = 0;

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
