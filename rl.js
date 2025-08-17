let EMPTY_SQUARE = 0;
let MOUSE = 1;
let CAT = 2;
let CHEESE = 3;
let THREE_CHEESE = 4;
let OFFBOARD = 5;

let bestMoveSequence = [];
let bestScore = -1000000000;
let board = [];
let directions = [-1, +1, -6, +6, +5, +7, -5, -7];
let gamme = 0.95;
let rewards = [0, 0, -1000, 1, 3];
function opponent(who){
	if(who==MOUSE) return CAT;
	if(who==CAT) return MOUSE;
	return -1;
}
for (epochs=0;epochs<1000000; epochs++){
	board = [
		OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD,
		OFFBOARD, CAT, THREE_CHEESE, EMPTY_SQUARE, THREE_CHEESE, EMPTY_SQUARE, THREE_CHEESE, EMPTY_SQUARE,
		OFFBOARD, EMPTY_SQUARE, EMPTY_SQUARE, EMPTY_SQUARE, EMPTY_SQUARE,OFFBOARD,
		OFFBOARD, EMPTY_SQUARE, EMPTY_SQUARE, EMPTY_SQUARE, EMPTY_SQUARE,OFFBOARD,
		OFFBOARD, EMPTY_SQUARE, CHEESE, CHEESE, CHEESE, EMPTY_SQUARE,OFFBOARD,
		OFFBOARD, EMPTY_SQUARE, CHEESE, MOUSE, CHEESE, EMPTY_SQUARE,OFFBOARD,
		OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD, OFFBOARD,
	];
	let catPosition = 7;
	let moveSequence = [];
	let mousePosition = 33;
	let score = 0;
	while(true){
		let whoseTurn = [MOUSE, CAT][Math.floor(Math.random()*2)];
		if (whoseTurn == CAT ) {
			let catNewPosition = OFFBOARD;
			while ( catNewPosition == OFFBOARD ) {
				catNewPosition = catPosition + directions[Math.floor(Math.random()*directions.length)];
			}
			catPosition = catNewPosition;
			if (catPosition == mousePosition){
				score -= 1000;
				if ( score > bestScore ) {
					bestScore = score;
					bestMoveSequence = [...moveSequence];
					console.log(`bestMoveSequence = [${bestMoveSequence}] bestScore = ${bestScore}`);
				}
				break;
			}
			let mouseNewPosition = OFFBOARD;
			while ( mouseNewPosition == OFFBOARD ) {
				mouseNewPosition = mousePosition + directions[Math.floor(Math.random()*directions.length)];
			}
			mousePosition = mouseNewPosition;
			moveSequence.push(mousePosition);
			if ( moveSequence.length >= 1000000) break;
			if (catPosition == mousePosition){
				score -= 1000;
				if ( score > bestScore ) {
					bestScore = score;
					bestMoveSequence = [...moveSequence];
					console.log(`bestMoveSequence = [${bestMoveSequence}] bestScore = ${bestScore}`);
				}
				break;
			}
			score += rewards[board[mousePosition]];
			if ( [CHEESE, THREE_CHEESE].includes ( board [ mousePosition ] ) ) board [ mousePosition ] = EMPTY_SQUARE;
		}
	}
}