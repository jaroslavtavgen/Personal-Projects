let board = Array.from ( {length:120}, _=>5 );
let currentPlayer;
let numberOfMovesWithoutACapture = 0;
let numberOfRedPieces = 0;
let numberOfRedKings = 0;
let numberOfWhitePieces = 0;
let numberOfWhiteKings = 0;
let ply = 1;
let redKing = 2;
let redMan = 1;
let score = [0, 0, 0, 0, 0, ]
let size = 8;
let whiteKing = 4;
let whiteMan = 3;
currentPlayer = redMan;
for ( let row = 0;row < size; row++ ) {
    for ( let column = 0; column < size; column++ ) {
        let index = 21 + row * 10 + column;
        let square = document.getElementsByClassName(`square`) [ ( 7 - row ) * 8 + column ];
        square.id = index;
        square.addEventListener(`click`, a1);
        if(row==0 || row == 2){
            board[index] = (column+1)%2;
            if(column%2 == 0) score [ 1 ] += 1;
        }
        else if(row==1){
            board[index] = (column)%2;
            if(column%2 == 1) score [ 1 ] += 1;
        }
        else if(row==5 || row == 7){
            board[index] = (column%2) * 3;
            if(column%2 == 1) score [ 3 ] += 1;
        }
        else if(row==6){
            board[index] = ((column+1)%2)*3;
            if(column%2 == 0) score [ 3 ] += 1;
        }
        else{
            board[index] = 0;
        }
    }
}
minimax();
parseBoard();
let legalMoves = generateMoves();
function toggleSide() {
  if ( currentPlayer == redMan ) currentPlayer = whiteMan;
  else currentPlayer = redMan;
}
function minimax(previousMoveWasAJump) {
  let moves = [];
  let playFurther = true;
  if ( ply < 3 ) moves = generateMoves();
  else if ( ply == 3 ) {
    playFurther = false;
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) playFurther = true;
    else {
      if ( previousMoveWasAJump ) playFurther = true;
      else {
        for ( let i = 0; i < moves[0].length; i++ ) {
          let move = moves [ 0 ] [ i ];
          let piece = board [ move [ 0 ] ];
          let to = board [ move [ 0 ] ];
          board [ move [ 1 ] ] = piece;
          board [ move [ 0 ] ] = 0;
          toggleSide();
          let potentialJumps = generateMoves();
          if ( potentialJumps [ 0 ] && potentialJumps [ 0 ] [ 0 ] && potentialJumps [ 0 ] [ 0 ] [ 4 ] ) {
            for ( let j = 0; j < potentialJumps[0].length; j++ ) {
              let jump = potentialJumps [0][ j ];
              let jumper = board [ jump [ 0 ] ];
              let skippedPieces = jump [ 2 ].map ( e=>board [ e ] );
              board [ jump [ 1 ] ] = jumper;
              if ( jump [ 1 ] > 90 && jump [ 1 ] < 99 && currentPlayer == redMan ) {
                board [ jump [ 1 ] ] = redKing;
              }
              if ( jump [ 1 ] < 29 && jump [ 1 ] > 20 && currentPlayer == whiteMan ) {
                board [ jump [ 1 ] ] = whiteKing;
              }
              board [ jump [ 0 ] ] = 0;
              
              for ( let j = 0; j < jump [ 2 ].length; j++ ) {
                board [ jump [ 2 ] [ j ] ] = 0;
              }    
              toggleSide();
              let potentialExchanges = generateMoves();
              for ( let j = 0; j < jump [ 2 ].length; j++ ) {
                board [ jump [ 2 ] [ j ] ] = skippedPieces [ j ];
              }    
              board [ jump [ 0 ] ] = jumper;
              board [ jump [ 1 ] ] = 0;
              toggleSide();
              if ( potentialExchanges [ 0 ] [ 4 ] ) {
                playFurther = true;
                break;
              }
            }
          }
          board [ move [ 0 ] ] = piece;
          board [ move [ 1 ] ] = 0;
          toggleSide();
        }          
      }
    }
  }
  else if ( ply == 4 ) {
    playFurther = false;
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) playFurther = true;
    else {
      if ( true ) {
        for ( let i = 0; i < moves[0].length; i++ ) {
          let move = moves [ 0 ] [ i ];
          let piece = board [ move [ 0 ] ];
          let to = board [ move [ 0 ] ];
          board [ move [ 1 ] ] = piece;
          board [ move [ 0 ] ] = 0;
          toggleSide();
          let potentialJumps = generateMoves();
          if ( potentialJumps [ 0 ] && potentialJumps [ 0 ] [ 0 ] && potentialJumps [ 0 ] [ 0 ] [ 4 ] ) {
            for ( let j = 0; j < potentialJumps[0].length; j++ ) {
              let jump = potentialJumps [0][ j ];
              let jumper = board [ jump [ 0 ] ];
              let skippedPieces = jump [ 2 ].map ( e=>board [ e ] );
              board [ jump [ 1 ] ] = jumper;
              if ( jump [ 1 ] > 90 && jump [ 1 ] < 99 && currentPlayer == redMan ) {
                board [ jump [ 1 ] ] = redKing;
              }
              if ( jump [ 1 ] < 29 && jump [ 1 ] > 20 && currentPlayer == whiteMan ) {
                board [ jump [ 1 ] ] = whiteKing;
              }
              board [ jump [ 0 ] ] = 0;              
              for ( let j = 0; j < jump [ 2 ].length; j++ ) {
                board [ jump [ 2 ] [ j ] ] = 0;
              }    
              toggleSide();
              let potentialExchanges = generateMoves();
              for ( let j = 0; j < jump [ 2 ].length; j++ ) {
                board [ jump [ 2 ] [ j ] ] = skippedPieces [ j ];
              }    
              board [ jump [ 0 ] ] = jumper;
              board [ jump [ 1 ] ] = 0;
              toggleSide();
              if ( potentialExchanges [ 0 ] [ 4 ] ) {
                playFurther = true;
                break;
              }
            }
          }
          board [ move [ 0 ] ] = piece;
          board [ move [ 1 ] ] = 0;
          toggleSide();
        }          
      }
    }
  }
  else if ( ply > 4 && ply < 11 ) {
    playFurther = false;
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) playFurther = true;
  }    
  else if ( ply >= 11 ) {
    playFurther = false;
    moves = generateMoves();
    if ( moves [ 0 ] && moves [ 0 ] [ 0 ] && moves [ 0 ] [ 0 ] [ 4 ] ) {
      if ( Math.abs ( score [ 2 ] - score [ 4 ] ) < 2 ) {
        playFurther = true;
      }
    }
  }
  else if ( ply >= 20 ) {
    playFurther = false;
  }
  if ( !moves.length ) {
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
    if ( move [ 1 ] > 90 && move [ 1 ] < 99 && currentPlayer == redMan ) {
      numberOfMovesWithoutACapture = 0;
      board [ move [ 1 ] ] = redKing;
    }
    if ( move [ 1 ] < 29 && move [ 1 ] > 20 && currentPlayer == whiteMan ) {
      numberOfMovesWithoutACapture = 0;
      board [ move [ 1 ] ] = whiteKing;
    }
    board [ move [ 0 ] ] = 0;
    for ( let j = 0; j < move [ 2 ].length; j++ ) {
      score [ board [ move [ 2 ] [ j ] ] ] -= 1;
      board [ move [ 2 ] [ j ] ] = 0;
    }
    toggleSide();
    ply += 1;
    let currentScore = minimax ( move [ 4 ] );
    ply -= 1;
    numberOfMovesWithoutACapture = oldNumberOfMovesWithoutACapture;
    for ( let j = 0; j < move [ 2 ].length; j++ ) {
      let skippedPiece = skippedPieces [ j ];
      score [ skippedPiece ] += 1;
      board [ move [ 2 ] [ j ] ] = skippedPiece;
    }    
    board [ move [ 0 ] ] = piece;
    board [ move [ 1 ] ] = 0;
    toggleSide();
    if ( currentScore > bestScore ) {
      bestScore = currentScore;
      bestMove = move;
    }
  }
  if ( ply == 1 ) {
    let move = bestMove;
    let piece = board [ move [ 0 ] ];
    let skippedPieces = move[2].map ( e=>board [ e ] );
    board [ move [ 1 ] ] = piece;
    if ( move [ 1 ] > 90 && move [ 1 ] < 99 && currentPlayer == redMan ) {
      board [ move [ 1 ] ] = redKing;
    }
    if ( move [ 1 ] < 29 && move [ 1 ] > 20 && currentPlayer == whiteMan ) {
      board [ move [ 1 ] ] = whiteKing;
    }
    board [ move [ 0 ] ] = 0;
    for ( let j = 0; j < move [ 2 ].length; j++ ) {
      score [ board [ move [ 2 ] [ j ] ] ] -= 1;
      board [ move [ 2 ] [ j ] ] = 0;
    }
    toggleSide();
  }
  return bestScore;
}
function generateMoves ()
{
  return getLegalMoves();
}
function getLegalMoves(){
  let moves = [];
  let playableSquares = [];
  let king = ( currentPlayer == whiteMan ) ? whiteKing: redKing;
  for ( let i = 0; i < size; i++ ) {
    for ( let j = 0; j < size; j++ ) {
      let index = 21 + i * 10 + j;
      let piece = board [ index ];
      if ( piece == currentPlayer || piece == king ) {
        playableSquares.push ( index );
        if ( isAValidJump ( piece, index, index - 9, index - 18 ) ) {
          let validJumps = getJumpLeaves ( piece, index, index - 9, index - 18 );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index + 9, index + 18 ) ) {
          let validJumps = getJumpLeaves ( piece, index, index + 9, index + 18 );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index - 11, index - 22 ) ) {
          let validJumps = getJumpLeaves ( piece, index, index - 11, index - 22 );
          for ( let k = 0; k < validJumps.length; k++ ) {
            let jump = validJumps [ k ];
            moves.push ( jump );
          }
        }
        if ( isAValidJump ( piece, index, index + 11, index + 22 ) ) {
          let validJumps = getJumpLeaves ( piece, index, index + 11, index + 22 );
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
    if ( isAValidMove ( piece, index, index - 9 ) ) {
      moves.push ( [ index, index - 9, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index + 9 ) ) {
      moves.push ( [ index, index + 9, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index - 11 ) ) {
      moves.push ( [ index, index - 11, [], [], false, ] );
    }
    if ( isAValidMove ( piece, index, index + 11 ) ) {
      moves.push ( [ index, index + 11, [], [], false, ] );
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
  if ( isAValidJump ( piece, from, from + 11, from + 22 ) ) {
    moves.push ( [ from, from + 22, [], [ from + 22, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from - 11, from - 22 ) ) {
    moves.push ( [ from, from - 22, [], [ from - 22, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from - 9, from - 18 ) ) {
    moves.push ( [ from, from - 18, [], [ from - 18, from ], true, ] );
  }
  if ( isAValidJump ( piece, from, from + 9, from + 18 ) ) {
    moves.push ( [ from, from + 18, [], [ from + 18, from ], true, ] );
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
      vtr += board[(7-row)*10+column+21]+" ";
    }
    vtr += `\n`
  }
  vtr += `\n`
  console.log(vtr);
}
function parseBoard()
{
  for(let row=0;row<8;row++){
      for(let column=0;column<8;column++){
      let index = row * 10 + column + 21;
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
            board [ id ] = board [ move [ 0 ] ];
            if ( id > 90 && id < 99 && currentPlayer == redMan ) {
              board [ id ] = redKing;
            }
            if ( id < 29 && id > 20 && currentPlayer == whiteMan ) {
              board [ id ] = whiteKing;
            }
            board [ move [ 0 ] ] = 0;
            for ( let j = 0; j < move [ 2 ].length; j++ ) {
              board [ move [ 2 ] [ j ] ] = 0;
            }
            parseBoard();
            toggleSide();
            minimax();
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