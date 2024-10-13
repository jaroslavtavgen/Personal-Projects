#include <iostream>
#include <stdio.h>      /* printf, scanf, puts, NULL */
#include <stdlib.h>     /* srand, rand */
#include <time.h>       /* time */

struct ListNode {
  int val;
  ListNode *next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    return l1;
}


int main(){
  int a = 0xaabbcc;
  srand (time(NULL));
  int max = 2;
  do{
    int one = rand()%max;
    int power = one * one;
    int input;
    std::cout << one << " ** 2 = ";
    std::cin >> input;
    if(input != power)
    {
      break;
    }
    max *= 2;
  } while(1);
  /*ListNode* b = new ListNode(2);
  ListNode* c = new ListNode(3);
  ListNode* d = new ListNode(4);
  b->next = d;
  d->next = c;
  addTwoNumbers(b,c);*/
}
