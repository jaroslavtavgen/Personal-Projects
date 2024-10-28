void parseFen(char * board, char * pieces, char * piece_numbers){
  int file = 0;
  int row = 8;
  int cursor = 0;
  while(board[cursor] != ' ')  {
    if ( board[cursor] >= '0' && board[cursor] <= '8')
    {
      int limit = (int)board[cursor];
      for(int i=0;i<limit;i++)
      {
        board[21 + row * 10 + i] = 0;
        file++;
      }
      cursor++;
      continue;
    }
    int found = 0;
    for(int i=0;i<12;i++)
    {
      if(fen[cursor] == pieces[i])
      {
        found = 1;
        break;
      }
      if(found){
        for(int i=0;i<14;i++)
        {
          
        }
        board[21 + row*10 + file]
      }
    }
}
int main()
{
  char board[120];
  char pieces[] = {'p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'};
  char piece_numbers[] = {0, 'p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'};
  for(int i=0;i<120;i++) board[i]=0;
  return 0;
}