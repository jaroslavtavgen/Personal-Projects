let board = Array.from({length:120},_=>5);
let color = [ 2, 0, 0, 1, 1, 2 ];
let historical_ply = 0;
let jump_list_start = Array.from({length:1000},_=>0);
let jumps = Array.from({length:1000},_=>0);
let jumps_only = false;
let number_of_sequences = 0;
let moves = Array.from({length:10000},_=> 0 );
let move_list_start = Array.from({length:10000},_=>0);
let piece_list = Array.from({length:100},_=>0);
let piece_num = [ 0, 0, 0, 0, 0 ]
let ply = 0;
let selected = 0;
let side = 0;
let files = Array.from({length:120},_=>5);
let ranks = Array.from({length:120},_=>5);
for(let row=0;row<8;row++){
    for(let column=0;column<8;column++){
        files [ row * 10 + 21 + column ] = column;
        ranks [ row * 10 + 21 + column ] = row;
        if ( row == 0 || row == 2 ){
            if(column%2==0){
                let piece_type = 1;
                board[row*10+21+column] =  piece_type;
                piece_list[piece_type * 20 + piece_num[piece_type]] =  row*10+21+column;
                piece_num[piece_type] += 1;
            }
        }
        else if ( row == 1 ){
            if ( column%2 == 1 ){
                let piece = 1;
                board[row*10+21+column] = piece;
                piece_list[piece * 20 + piece_num[piece]] =  row*10+21+column;
                piece_num[piece] += 1;
            }
        }
        else if ( row == 5 || row == 7 ){
            if(column%2==1){
                let piece = 3;
                board[row*10+21+column] = piece;
                piece_list[piece * 20 + piece_num[piece]] =  row*10+21+column;
                piece_num[piece] += 1;
            }
        }
        else if ( row == 6 ){
            if ( column%2 == 0 ){
                let piece = 3;
                board[row*10+21+column] = piece;
                piece_list[piece * 20 + piece_num[piece]] = row*10+21+column;
                piece_num[piece]+=1;
            }
        }
        else{
            board[row*10+21+column] = 0;
        }
    }
}
for(let row=0;row<8;row++){
    for(let column=0;column<8;column++){
      let parent1 = document.getElementsByTagName(`span`)[(7-row)*8+column];
      parent1.id = row * 10 + column + 21;
    }
}

function parse_board()
{
  for(let row=0;row<8;row++){
      for(let column=0;column<8;column++){
        if ( ![ 0, 5 ].includes ( board [ row * 10 + column + 21] ) )
        {
              let parent1 = document.getElementsByTagName(`span`)[(7-row)*8+column];
              const canvas = document.createElement("canvas");
              canvas.dataset.selected = false;
              
              canvas.addEventListener(`click`, select_piece);
              canvas.width = 60;
              canvas.height = 60;
              // Append the canvas to the span
              parent1.appendChild(canvas);

              // Get the drawing context
              const ctx = canvas.getContext("2d");

              // Draw a white circle with a black border
              ctx.beginPath();
              ctx.arc(30, 30, 25, 0, Math.PI * 2); // x=30, y=30, radius=25
              if ( board [ row * 10 + column + 21] == 1 )
              {
                canvas.dataset.color = 0;
                ctx.fillStyle = "red";
                
              }
              else if ( board [ row * 10 + column + 21] == 2 )
              {
                canvas.dataset.color = 0;
                ctx.fillStyle = "yellow";
                
              }
              else if ( board [ row * 10 + column + 21] == 3 )
              {
                canvas.dataset.color = 1;
                ctx.fillStyle = "white";
                
              }
              else if ( board [ row * 10 + column + 21] == 4 )
              {
                canvas.dataset.color = 1;
                ctx.fillStyle = "grey";
              }
              ctx.fill();
              ctx.strokeStyle = "black";
              ctx.lineWidth = 2;
              ctx.stroke();
        }
        else{
          let parent1 = document.getElementsByTagName(`span`)[(7-row)*8+column];
          parent1.addEventListener(`click`, select_empty_square);
        }
      }
  }
}
function select_piece(event){
  if ( jumps_only ) return;
  if(side== +event.target.dataset.color ){
    if(selected != 0 ){
      document.getElementById(selected).style.backgroundColor = `green`
    }
    event.target.parentNode.style.backgroundColor = `blue`;
    selected = +event.target.parentNode.id;
                                           
  }
}
function select_empty_square(event){
  let clicked_square = +event.target.id;
  if(selected != 0){
    move_list_start [ ply + 1 ] = move_list_start [ ply ];
    for(let piece = 1 + 2 * side; piece <= 2 + 2 * side; piece++){
      for ( let i = 0; i < piece_num [ piece ]; i++ ){
        let coordinates = piece_list [ 20 * piece + i ];
        if ( side == 0 || ( piece == 2 + 2 * side ) ){
          if ( color [ board [ coordinates + 9 ] ] == ( side ^ 1 ) ){
            if ( board [ coordinates + 18 ] == 0 ){
              let move = coordinates | ( ( coordinates + 18 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move;
            }
          }
          if ( color [ board [ coordinates + 11 ] ] == ( side ^ 1 ) ){
            if ( board [ coordinates + 22 ] == 0 ){
              let move = coordinates | ( ( coordinates + 22 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move;
            }
          }
        }
        if ( side == 1 || ( piece == 2 + 2 * side ) ){
          if ( color [ board [ coordinates - 9 ] ] == ( side ^ 1 ) ){
            if ( board [ coordinates - 18 ] == 0 ){
              let move = coordinates | ( ( coordinates - 18 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move;
            }
          }
          if ( color [ board [ coordinates - 11 ] ] == ( side ^ 1 ) ){
            if ( board [ coordinates - 22 ] == 0 ){
              let move = coordinates | ( ( coordinates - 22 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move;
            }
          }
        }        
      }
    }
    if( move_list_start [ ply + 1 ] == move_list_start [ ply ] ){
      for(let piece = 1 + 2 * side; piece <= 2 + 2 * side; piece++){
        for ( let i = 0; i < piece_num [ piece ]; i++ ){
          let coordinates = piece_list [ 20 * piece + i ];
          if ( side == 0 || ( piece == 2 + 2 * side ) ){
            if ( board [ coordinates + 9 ] == 0 ){
              let move = coordinates | ( ( coordinates + 9 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move; 
            }
            if ( board [ coordinates + 11 ] == 0 ){
              let move = coordinates | ( ( coordinates + 11 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move; 
            }
          }        
          if ( side == 1 || ( piece == 2 + 2 * side ) ){
            if ( board [ coordinates - 9 ] == 0 ){
              let move = coordinates | ( ( coordinates - 9 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move; 
            }
            if ( board [ coordinates - 11 ] == 0 ){
              let move = coordinates | ( ( coordinates - 11 ) << 7 );
              moves [ move_list_start [ ply + 1 ]++ ] = move; 
            }
          }        
        }
      }
    }
    for(let i=move_list_start[ply];i<move_list_start[ply+1];i++){
      let move = moves [ i ];
      let from = move & 0x7f;
      let to = move >> 7;
      if ( from == selected && to == clicked_square ){
        let piece_from = board [ from ];
        let piece_to = piece_from;
        if ( piece_to == 1 && ( Math.floor (to/10) == 9 ) ) piece_to = 2;
        if ( piece_to == 3 && ( Math.floor (to/10) == 2 ) ) piece_to = 4;
        // Begin the process of moving
        board [ from ] = 0;
        board [ to ] = piece_to;
        document.getElementById(selected).style.backgroundColor = `green`;
        [...document.getElementsByTagName(`canvas`)].map(e=>e.parentNode.removeChild(e));
        var old_element = document.getElementById("game");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        let offset = 0;
        if ( ( from - to ) == 18 ) offset = -18;
        else if ( ( from - to ) == 22 ) offset = -22;
        else if ( ( to - from ) == 18 ) offset = 18;
        else if ( ( to - from ) == 22 ) offset = 22;
        if ( offset != 0 ){
          let piece_intermediatery = board [ from + offset/2 ];
          board [ from + offset/2 ] = 0;
          for ( let j=0;j<piece_num[piece_intermediatery];j++){            
            if ( piece_list [ piece_intermediatery * 20 + j] == ( from +offset/2 ) ){
              piece_list [ piece_intermediatery * 20 + j] = piece_list [ piece_intermediatery * 20 + piece_num[piece_intermediatery]-1];
              piece_list [ piece_intermediatery * 20 + piece_num[piece_intermediatery]-1] = 0;
              piece_num[piece_intermediatery] -= 1;
              break;
            }
          }
          move_list_start [ ply + 1 ] = move_list_start [ ply ];
          let coordinates = to;
          if ( side == 0 || ( piece_to == 2 + 2 * side ) ){
            if ( color [ board [ coordinates + 9 ] ] == ( side ^ 1 ) ){
              if ( board [ coordinates + 18 ] == 0 ){
                let move = coordinates | ( ( coordinates + 18 ) << 7 );
                moves [ move_list_start [ ply + 1 ]++ ] = move;
              }
            }
            if ( color [ board [ coordinates + 11 ] ] == ( side ^ 1 ) ){
              if ( board [ coordinates + 22 ] == 0 ){
                let move = coordinates | ( ( coordinates + 22 ) << 7 );
                moves [ move_list_start [ ply + 1 ]++ ] = move;
              }
            }
          }
          if ( side == 1 || ( piece_to == 2 + 2 * side ) ){
            if ( color [ board [ coordinates - 9 ] ] == ( side ^ 1 ) ){
              if ( board [ coordinates - 18 ] == 0 ){
                let move = coordinates | ( ( coordinates - 18 ) << 7 );
                moves [ move_list_start [ ply + 1 ]++ ] = move;
              }
            }
            if ( color [ board [ coordinates - 11 ] ] == ( side ^ 1 ) ){
              if ( board [ coordinates - 22 ] == 0 ){
                let move = coordinates | ( ( coordinates - 22 ) << 7 );
                moves [ move_list_start [ ply + 1 ]++ ] = move;
              }
            }
          }
          if( move_list_start [ ply + 1 ] == move_list_start [ ply ] ){
            jumps_only = false;
            selected = 0;
          }
          else{
            jumps_only = true;
            selected = to;
            side ^= 1;
          }
          
        }
        for ( let j=0;j<piece_num[piece_from];j++){
          if ( piece_list [ piece_from * 20 + j] == from ){
            if ( piece_from == piece_to ){
              piece_list [ piece_from * 20 + j] = to;
            }
            else{
              piece_list [ piece_from * 20 + j] = piece_list [ piece_from * 20 + piece_num[piece_from]-1];
              piece_list [ piece_from * 20 + piece_num[piece_from]-1] = 0;
              piece_num[piece_from]--;
              piece_list [ (piece_from+1) * 20 + piece_num[(piece_from+1)]] = to;
              piece_num[piece_from+1]++;
              
            }
            break;
          }
        }
        side ^= 1;
        parse_board(); 
        break;
      }
    }
  }
}
parse_board();
// PIECE LIST