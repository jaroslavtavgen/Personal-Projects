let EMPTY_SQUARE = 0;
let MOUSE = 1;
let CAT = 2;
let TRAP = 2;
let CHEESE = 3;
let INFINITE_CHEESE = 3
let THREE_CHEESE = 4;
let OFFBOARD = 5;

let bestMoveSequence = [];
let bestScore = -1000000000;
let board = [];
let boardSideLength = 7;
let boardLength = boardSideLength * boardSideLength;
let directions = [-1, +1, -boardSideLength, +boardSideLength, boardSideLength-1, boardSideLength+1, -(boardSideLength-1), -(boardSideLength+1)];
let gamma = 0.95;
let rewards = [0, 0, -1000000, 1, 1000];
function opponent(who){
	if(who==MOUSE) return CAT;
	if(who==CAT) return MOUSE;
	return -1;
}
let start = performance.now();
while ( true ){
	board = Array.from({length: boardLength}, _=>OFFBOARD);
	for ( let row=1;row<boardSideLength-1;row++){
		for ( let col=0;col<boardSideLength-2; col++){
			board [ row * boardSideLength + col ] = EMPTY_SQUARE;
		}
	}
	board [ boardSideLength ] = THREE_CHEESE;
	board [ boardSideLength + 1 ] = TRAP;
	board [ boardSideLength * 2 + 1 ] = TRAP;
	board [ boardSideLength * 4 + 1 ] = INFINITE_CHEESE;
	board [ boardSideLength * 4 + 2 ] = INFINITE_CHEESE;
	board [ boardSideLength * 5 + 1 ] = INFINITE_CHEESE;
	board [ boardSideLength * 5 + 2 ] = MOUSE;
	let moveSequence = [];
	let mousePosition = board.indexOf(MOUSE);
	let score = 0;
	while(true){
		let mouseNewPosition = OFFBOARD;
		while ( mouseNewPosition == OFFBOARD ) {
			mouseNewPosition = mousePosition + directions[Math.floor(Math.random()*directions.length)];
		}
		mousePosition = mouseNewPosition;
		moveSequence.push(mousePosition);
		score += rewards [ board [ mousePosition ] ];
		if ( board [ mousePosition ] == TRAP || moveSequence.length >= 1000000 ) break;
		if ( [	THREE_CHEESE].includes ( board [ mousePosition ] ) ) board [ mousePosition ] = EMPTY_SQUARE;
	}
	if ( score > bestScore ) {
		bestScore = score;
		bestMoveSequence = [...moveSequence];
		console.log(`bestMoveSequence = [${bestMoveSequence}] bestScore = ${bestScore}. Time it took to update: ${(performance.now()-start)/1000} seconds`);
		start = performance.now();	
	}
}
