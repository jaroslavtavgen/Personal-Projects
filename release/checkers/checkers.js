let board = Array.from ( {length:120}, _=>5 );
let currentPlayer;
let history2 = [];
let multiplicator = 1;
let numberOfMovesWithoutACapture = 0;
let numberOfRedPieces = 0;
let numberOfRedKings = 0;
let numberOfWhitePieces = 0;
let numberOfWhiteKings = 0;
let three = 3;
let four = 4;
let five = 5;
let eleven = 11;
let twenty = 20;
let eight = 8;
if ( Math.random () < 0.5 ) eight = 10;
let seven = eight-1;
let nine = eight+1;
let ten = eight + 2;
let eighteen = nine * 2;
let elevenBoard = ten + 1;
let twentyOne = ten * 2 + 1;
let twenty_two = elevenBoard * 2;
for ( let i = 0; i < eight; i++ ) {
  for ( let j = 0; j < eight; j++ ) {
    let div = document.createElement(`div`);
    div.classList.add(`square`);
    if ( (i%2) != (j%2) ){
      div.classList.add ( `black` );
      let div2 = document.createElement ( `div`);
      div2.classList.add ( `piece` );
      div.appendChild ( div2 );
    }
    document.getElementById(`game`).appendChild ( div );
  }
  document.getElementById(`game`).appendChild ( document.createElement ( `br` ) );
}
let ply = 1;
let redKing = 2;
let redMan = 1;
let score = [0, 0, 0, 0, 0, ]
let size = 8;
let whiteKing = 4;
let whiteMan = 3;
currentPlayer = redMan;
let humanPlayer = redMan;
if ( Math.random () < 0.5 ) humanPlayer = whiteMan;
if ( eight == 8 ) {
  for ( let row = 0;row < eight; row++ ) {
      for ( let column = 0; column < eight; column++ ) {
          let index = twentyOne + row * ten + column;
          let square = document.getElementsByClassName(`square`) [ ( seven - row ) * eight + column ];
          square.id = index;
          square.addEventListener(`click`, a1);
          if(row==0 || row == 2){
              board[index] = (column+1)%2;
              //board [ index ] = 0;
          }
          else if(row==1){
              board[index] = (column)%2;
              //board [ index ] = 0;
          }
          else if(row==5 || row == 7){
              board[index] = (column%2) * 3;
              //board [ index ] = 0;
          }
          else if(row==6){
              board[index] = ((column+1)%2)*3;
              //board [ index ] = 0;
          }
          else{
              board[index] = 0;
          }
      }
  }
}
if ( eight == 10 ) {
  for ( let row = 0;row < eight; row++ ) {
      for ( let column = 0; column < eight; column++ ) {
          let index = twentyOne + row * ten + column;
          let square = document.getElementsByClassName(`square`) [ ( seven - row ) * eight + column ];
          square.id = index;
          square.addEventListener(`click`, a1);
          if(row==0 || row == 2){
              board[index] = (column+1)%2;
              //board [ index ] = 0;
          }
          else if(row==1 || row==3){
              board[index] = (column)%2;
              //board [ index ] = 0;
          }
          else if(row==7 || row ==9){
              board[index] = (column%2) * 3;
              //board [ index ] = 0;
          }
          else if(row==6||row==8){
              board[index] = ((column+1)%2)*3;
              //board [ index ] = 0;
          }
          else{
              board[index] = 0;
          }
      }
  }
}
/*board [ 92 ] = 2;
board [ 94 ] = 2;
board [ 96 ] = 2;
board [ 98 ] = 2;
board[ 21 ] = 4;*/
score = [
  0, 
  board.filter ( e=>e==redMan ).length, 
  board.filter ( e=>e==redKing ).length, 
  board.filter ( e=>e==whiteMan ).length, 
  board.filter ( e=>e==whiteKing ).length
];
let number = 0;
if ( humanPlayer == whiteMan ) minimax ( false, 1, [] );
parseBoard ();
let legalMoves = generateMoves();
function toggleSide() {
  if ( currentPlayer == redMan ) currentPlayer = whiteMan;
  else currentPlayer = redMan;
}
function minimax(previousMoveWasAJump, depth, history1) {
  let moves = [];
  let playFurther = false;
  if ( ply < three * multiplicator ) {
    moves = generateMoves();
    playFurther = true;
  }
  else if ( ply == three * multiplicator ) {
    moves = generateMoves ();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) {
      playFurther = true;
    }
    else if ( previousMoveWasAJump ) {
      playFurther = true;
    }
    else {
      for ( let i = 0; i < moves[0].length; i++ ) {
        let move = moves [ 0 ] [ i ];
        let arr = makeTheMove ( move );
        let potentialJumps = generateMoves();
        if ( potentialJumps [ 0 ] && potentialJumps [ 0 ] [ 0 ] && potentialJumps [ 0 ] [ 0 ] [ 4 ] ) {
          for ( let j = 0; j < potentialJumps[0].length; j++ ) {
            let jump = potentialJumps [ 0 ] [ j ];
            let arr2 = makeTheMove ( jump );
            let potentialExchanges = generateMoves();
            takeBackTheMove ( jump, arr2 [ 0 ], arr2 [ 1 ], arr2 [ 2 ] );
            if ( potentialExchanges [ 0 ] && potentialExchanges [ 0 ] [ 0 ] && potentialExchanges [ 0 ] [ 0 ] [ 4 ] ) {
              playFurther = true;
              break;
            }
          }
        }
        takeBackTheMove ( move, arr [ 0 ], arr [ 1 ], arr [ 2 ] );
      }        
    }
  }
  else if ( ply == four * multiplicator ) {
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) playFurther = true;
    else {
      for ( let i = 0; i < moves[0].length; i++ ) {
        let move = moves [ 0 ] [ i ];
        let arr = makeTheMove ( move );
        let potentialJumps = generateMoves();
        if ( potentialJumps [ 0 ] && potentialJumps [ 0 ] [ 0 ] && potentialJumps [ 0 ] [ 0 ] [ 4 ] ) {
          for ( let j = 0; j < potentialJumps[0].length; j++ ) {
            let jump = potentialJumps [ 0 ] [ j ];
            let arr2 = makeTheMove ( jump );
            let potentialExchanges = generateMoves();
            takeBackTheMove ( jump, arr2 [ 0 ], arr2 [ 1 ], arr2 [ 2 ] );
            if ( potentialExchanges [ 0 ] && potentialExchanges [ 0 ] [ 0 ] && potentialExchanges [ 0 ] [ 0 ] [ 4 ] ) {
              playFurther = true;
              break;
            }
          }
        }
        takeBackTheMove ( move, arr [ 0 ], arr [ 1 ], arr [ 2 ] );
      }
    }
  }
  else if ( ply > four * multiplicator && ply < eleven * multiplicator ) {
    moves = generateMoves ();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) {
      playFurther = true;
    }
  }    
  else if ( ply >= eleven * multiplicator ) {
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) {
      if ( Math.abs ( score [ 2 ] - score [ 4 ] ) < 2 ) {
        playFurther = true;
      }
    }
  }
  else if ( ply >= twenty * multiplicator ) {
    playFurther = true;
    moves = generateMoves ();
  }
  if ( !moves [ 0 ].length ) {
    return -300000;
  }
  if ( !playFurther ) {
    let returnScore = score [ 1 ] + 1.5 * score [ 2 ] - score [ 3 ] - 1.5 * score [ 4 ];
    if ( currentPlayer == whiteMan ) return -returnScore;
    return returnScore;
  }
  let bestMove = -1;
  let bestScore = -Infinity;
  for ( let i = 0; i < moves[0].length; i++ ) {
    let move = moves [0][ i ];
    let arr = makeTheMove ( move );
    let found;
    for ( let j = 0; j < history1.length; j++ ) {
      let currentBoard = history1 [ j ];
      found = true;
      for ( let k = 0; k < currentBoard.length; k++ ) {
        if ( currentBoard [ k ] != board [ k ] ) {
          found = false;
          break;
        }
      }
      if ( found ) break;
    }
    let currentScore;
    if ( found ) {
      takeBackTheMove ( move, arr [ 0 ], arr [ 1 ], arr [ 2 ] );
      currentScore = 0;
    }
    else{
      ply += 1;
      history1.push([...board]);
      currentScore = -minimax ( move [ 4 ], depth + 1, history1 );
      history1.pop();
      ply -= 1;
      takeBackTheMove ( move, arr [ 0 ], arr [ 1 ], arr [ 2 ] );
    }
    if ( currentScore > bestScore ) {
      bestScore = currentScore;
      bestMove = move;
    }  
  }
  if ( ply == 1 ) {
    makeTheMove ( bestMove );
  }
  return bestScore;
}
function makeTheMove ( move ) {
  let piece = board [ move [ 0 ] ];
  let skippedPieces = move[2].map ( e=>board [ e ] );
  let oldNumberOfMovesWithoutACapture = numberOfMovesWithoutACapture;
  if ( move [ 4 ] ) {
    numberOfMovesWithoutACapture = 0;
  }
  else {
    numberOfMovesWithoutACapture++;
  }
  board [ move [ 1 ] ] = piece;
  if ( ( Math.floor ( move [ 1 ] / ten ) - 2 )  == seven && piece == redMan && currentPlayer == redMan ) {
    numberOfMovesWithoutACapture = 0;
    board [ move [ 1 ] ] = redKing;
    score [ redKing ] += 1;
    score [ redMan ] -= 1;
  }
  if ( ( Math.floor ( move [ 1 ] / ten ) - 2 ) == 0 && piece == whiteMan && currentPlayer == whiteMan ) {
    numberOfMovesWithoutACapture = 0;
    board [ move [ 1 ] ] = whiteKing;
    score [ whiteKing ] += 1;
    score [ whiteMan ] -= 1;
  }
  board [ move [ 0 ] ] = 0;
  for ( let j = 0; j < move [ 2 ].length; j++ ) {
    score [ board [ move [ 2 ] [ j ] ] ] -= 1;
    board [ move [ 2 ] [ j ] ] = 0;
  }    
  toggleSide();
  return [ piece, skippedPieces, oldNumberOfMovesWithoutACapture ];
}
function takeBackTheMove ( move, piece, skippedPieces, oldNumberOfMovesWithoutACapture ) {
  numberOfMovesWithoutACapture = oldNumberOfMovesWithoutACapture;
  if ( ( Math.floor ( move [ 1 ] / ten ) - 2 ) == seven && piece == redMan && currentPlayer == redMan ) {
    score [ redKing ] -= 1;
    score [ redMan ] += 1;
  }
  if ( ( Math.floor ( move [ 1 ] / ten ) - 2 ) == 0 && piece == whiteMan && currentPlayer == whiteMan ) {
    score [ whiteKing ] -= 1;
    score [ whiteMan ] += 1;
  }
  for ( let j = 0; j < move [ 2 ].length; j++ ) {
    let skippedPiece = skippedPieces [ j ];
    score [ skippedPiece ] += 1;
    board [ move [ 2 ] [ j ] ] = skippedPiece;
  }
  if ( board [ move [ 1 ] ] > piece ) {
    score [ piece ] += 1;
    score [ board [ move [ 1 ] ] ] -= 1;
  }
  board [ move [ 0 ] ] = piece;
  board [ move [ 1 ] ] = 0;
  toggleSide();
}
function generateMoves ()
{
  return getLegalMoves();
}
function getLegalMoves(){
  let moves = [];
  let playableSquares = [];
  let king = ( currentPlayer == whiteMan ) ? whiteKing: redKing;
  for ( let i = 0; i < eight; i++ ) {
    for ( let j = 0; j < eight; j++ ) {
      let index = twentyOne + i * ten + j;
      let piece = board [ index ];
      if ( piece == currentPlayer || piece == king ) {
        playableSquares.push ( index );
        if ( isAValidJump ( piece, index, index - nine, index - eighteen ) ) {
          let validJumps = getJumpLeaves ( piece, index, index - nine, index - eighteen );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index + nine, index + eighteen ) ) {
          let validJumps = getJumpLeaves ( piece, index, index + nine, index + eighteen );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index - elevenBoard, index - twenty_two ) ) {
          let validJumps = getJumpLeaves ( piece, index, index - elevenBoard, index - twenty_two );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index + elevenBoard, index + twenty_two ) ) {
          let validJumps = getJumpLeaves ( piece, index, index + elevenBoard , index + twenty_two );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
      }
    }
  }
  if ( moves.length > 0 ) return [moves, true];
  for ( let i = 0; i < playableSquares.length; i++ ) {
    let index = playableSquares [ i ];
    let piece = board [ index ];
    if ( isAValidMove ( piece, index, index - nine ) ) {
      moves.push ( [ index, index - nine, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index + nine ) ) {
      moves.push ( [ index, index + nine, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index - elevenBoard ) ) {
      moves.push ( [ index, index - elevenBoard, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index + elevenBoard ) ) {
      moves.push ( [ index, index + elevenBoard, [], [], false, ] );
    }
  }
  return [moves, false];
}
function isAValidJump ( piece, from, skip, to ) {
  if ( board [ to ] == 5 ) return false;
  if ( board [ skip ] == 0 ) return false;
  if ( board [ to ] != 0 ) return false;
  if ( piece == whiteMan || piece == whiteKing ) {
    if ( board [ from ] == whiteMan && to > from ) return false;
    if ( board [ skip ] == whiteMan || board [ skip ] == whiteKing ) return false;
    else return true;
  }
  if ( piece == redMan || piece == redKing ) {
    if ( board [ from ] == redMan && from > to ) return false;
    if ( board [ skip ] == redMan || board [ skip ] == redKing ) return false;
    else return true;
  }  
}
function isAValidMove ( piece, from, to ) {
  if ( board [ to ] == 5 ) return false;
  if ( board [ to ] != 0 ) return false;
  if ( piece == whiteMan || piece == whiteKing ) {
    if ( board [ from ] == whiteMan && to > from ) return false;
    else return true;
  }
  if ( piece == redMan || piece == redKing ) {
    if ( board [ from ] == redMan && from > to ) return false;
    else return true;
  }  
}
function getJumpLeaves( piece, from, skip, to ){
  let stack = [];
  let moves = [];
  let visited = [];
  let previous1 = {};
  previous1 [ to ] = from;
  stack.push ( [ from, to, [], [ to, from ], Math.abs ( from - to ) > 11,  ] );
  visited.push ( from );
  while ( stack.length ) {
    let move1 = stack.pop ();
    let neighbors = getLegalJumps ( piece, move1 [ 1 ] );
    visited = [ ...new Set ( [ ...visited, move1 [ 0 ], move1 [ 1 ] ] ) ]; 
    if ( neighbors.length == 0 || isALeafNode(neighbors, visited) ) {
      let path = getJumpPath ( previous1, from, move1 [ 1 ] );
      let skipped = getSkippedNodes ( previous1, from, move1 [ 1 ] );
      moves.push ( [ from, move1 [ 1 ], skipped, path, true, ] );
      visited.splice(visited.indexOf(move1[1]), 1);
    }
    for (let i = 0; i < neighbors.length; i++ ) {
      let move = neighbors [ i ];
      let to = move [ 1 ];
      if ( !visited.includes ( to ) ) {
        stack.push ( move );
        previous1 [ to ] = move1 [ 1 ];
      }
    }
  }
  if ( moves.length == 0 ) {
    moves.push ( [ from, to, [], [ to, from ], true, ] );
  }
  return moves;
}
function getJumpPath(previous1, from, to ){
  let path = [];
  let key = to;
  while ( key in previous1 ) {
    path.push ( key );
    key = previous1[key];
  }
  path.push(from);
  return path;
}
function getSkippedNodes ( previous1, from, to ) {
  let skipped = [];
  let key = to;
  while ( key in previous1 ) {
    let coordinate1 = key;
    key = previous1[key];
    let coordinate2 = key;
    skipped.push ( coordinate1 + ( coordinate2 - coordinate1 ) / 2 );
  }
  return skipped;
}
function getLegalJumps ( piece, from ) {
  let current = board [ from ];
  board [ from ] = piece;
  let moves = [];
  let king = ( piece == whiteMan ) ? whiteKing: redKing;
  if ( isAValidJump ( piece, from, from + elevenBoard, from + twenty_two ) ) {
    moves.push ( [ from, from + twenty_two, [], [ from + twenty_two, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from - elevenBoard, from - twenty_two ) ) {
    moves.push ( [ from, from - twenty_two, [], [ from - twenty_two, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from - nine, from - eighteen ) ) {
    moves.push ( [ from, from - eighteen, [], [ from - eighteen, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from + nine, from + eighteen ) ) {
    moves.push ( [ from, from + eighteen, [], [ from + eighteen, from ], true, ] );
  }
  board[from] = current;
  return moves;
}
function isALeafNode(neighbors, visited){
  for (let i = 0; i < neighbors.length; i++ ) {
    let move = neighbors [ i ];
    let to = move [ 1 ];
    if ( !visited.includes ( to ) ) {
      return false;
    }
    return true;
  }
}
function displayBoard(){
  let vtr = ``
  for ( let row = 0;row < size; row++ ) {
    for ( let column = 0; column < size; column++ ) {
      vtr += board [ ( seven - row ) * ten + column + twentyOne ] + " ";
    }
    vtr += `\n`
  }
  vtr += `\n`
  console.log(vtr);
}
function parseBoard()
{
  for(let row=0;row<eight;row++){
      for(let column=0;column<eight;column++){
      let index = row * ten + column + twentyOne;
      let square = document.getElementById ( index );
      let piece = square.getElementsByTagName(`div`)[0];
      if ( board [ index ] == 1 ) {
        piece.style.backgroundColor = `red`;
        piece.style.display = `block`;
      }
      else if ( board [ index ] == 2 ) {
        piece.style.backgroundColor = `yellow`;
        piece.style.display = `block`;
      }
      else if ( board [ index ] == 3 ) {
        piece.style.backgroundColor = `white`;
        piece.style.display = `block`;
      }
      else if ( board [ index ] == 4 ) {
        piece.style.backgroundColor = `grey`;
        piece.style.display = `block`;
      }
      else if (square.classList.contains(`black`)){
        piece.style.display = `none`
      }
    }
  }
}
function a1(event){
  if ( numberOfMovesWithoutACapture >= 80 ) return;
  let square;
  if(event.target.classList.contains(`square`)) square = event.target;
  else square = event.target.parentNode;
  let id = +square.id;
  let piece = square.getElementsByTagName(`div`)[0];
  if ( board [ id ] == 0 ) {
    if (  [...document.getElementsByClassName(`selected`)].length ) {
      legalMoves = generateMoves();
      for ( let i = 0; i < legalMoves [ 0].length; i++ ) {
        let move = legalMoves [ 0 ] [ i];
        if ( move [ 1 ] == id ) {
          if ( move [ 0 ] == +[...document.getElementsByClassName(`selected`)][0].id ) {
            let found = false;;
            for ( let j = 0; j < history2.length; j++ ) {
              let currentBoard = history2 [ j ];
              found = true;
              for ( let k = 0; k < currentBoard.length; k++ ) {
                if ( currentBoard [ k ] != board [ k ] ) {
                  found = false;
                  break;
                }
              }
              if ( found ) break;
            }
            if ( !found ) history2.push ( [...board] );
            makeTheMove ( move );
            found = false;;
            for ( let j = 0; j < history2.length; j++ ) {
              let currentBoard = history2 [ j ];
              found = true;
              for ( let k = 0; k < currentBoard.length; k++ ) {
                if ( currentBoard [ k ] != board [ k ] ) {
                  found = false;
                  break;
                }
              }
              if ( found ) break;
            }
            if ( !found ) history2.push ( [...board] );
            parseBoard();
            minimax ( false, 1, history2 );
            found = false;
            for ( let j = 0; j < history2.length; j++ ) {
              let currentBoard = history2 [ j ];
              found = true;
              for ( let k = 0; k < currentBoard.length; k++ ) {
                if ( currentBoard [ k ] != board [ k ] ) {
                  found = false;
                  break;
                }
              }
              if ( found ) break;
            }
            if ( !found ) history2.push ( [...board] );            
            parseBoard();
            break;
          }
        }
      }
    }
    [...document.getElementsByClassName(`selected`)][0].classList.toggle(`selected`);
    return;
  }
  if ( piece.style.display == `none` ) return;
  if ( ( piece.style.backgroundColor == "red" || piece.style.backgroundColor == "yellow" ) && currentPlayer == whiteMan ) return;
  if ( ( piece.style.backgroundColor == "white" || piece.style.backgroundColor == "grey" ) && currentPlayer == redMan ) return;
  let selected = [...document.getElementsByClassName(`selected`)];
  if ( selected.length ) {
    [...document.getElementsByClassName(`selected`)][0].classList.toggle(`selected`);
  }
  square.classList.add(`selected`);
}