void parseFen(char * fen, char * board, int *caslePermissions, char * pieces, int * whose_turn){
  int file = 0;
  int row = 8;
  int cursor = 0;
  while(fen[cursor] != ' ')  {
    if(file==8)
    {
      file = 0;
      row++;
    }
    if ( fen[cursor] >= '0' && fen[cursor] <= '8' )
    {
      int number_of_empty_squares = (int)board[cursor];
      for(int i=0;i<number_of_empty_squares;i++)
      {
        board[21 + row * 10 + i] = '\0';
        file++;
      }
      cursor++;
      continue;
    }
    for(int i=1;i<13;i++)
    {
      if(fen[cursor] == pieces[i])
      {
        board[21 + row*10 + file] = (char)i;
        break;
      }
      file++;
    }
    cursor++;
  }
  if(fen[++cursor]=='w') *whose_turn = 0;
  else *whose_turn = 1;
  cursor += 2;
  *castlePermissions = 0;
  while(fen[cursor]!=' ')
  {
    if(fen[cursor] == 'K') castlePermissions |= 1;
    if(fen[cursor] == 'Q') castlePermissions |= 2;
    if(fen[cursor] == 'k') castlePermissions |= 4;
    if(fen[cursor] == 'q') castlePermissions |= 8;
    cursor++;
  }
  if(fen[++cursor] != '-')
  {
    
  }
}
int main()
{
  char board[120];
  int castlePermissions[] = {15};
  int enPassant[] = {0};
  char pieces[] = {'\0', 'p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'};
'K'};
  int whose_turn[] = {0};
  for(int i=0;i<120;i++) board[i]=0;
  parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board, pieces, whose_turn);
  return 0;
}