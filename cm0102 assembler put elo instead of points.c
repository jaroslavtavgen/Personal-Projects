#include "stdlib.h"

int codeBlock = 0x9660e5;
int dataBlock = 0x987000;

int main() {
asm(

"mov dword ptr [0x987000],eax\n\t"
"cmp dword ptr [esi],0x34\n\t"
"jne 1f\n\t"
"mov eax, dword ptr [eax]\n\t"
"fld dword ptr [eax+0x28]\n\t"
"mov eax,0x945640\n\t"
"call eax\n\t"
"mov ecx, dword ptr [0x987000]\n\t"
"mov word ptr [ecx+0x19],ax\n\t"
"2:\n\t"
"mov eax, dword ptr[esp+0x30]\n\t"
"mov ecx, 0x6864b6\n\t"
"jmp ecx\n\t"
"1:\n\t"
"mov word ptr [eax+0x19],cx\n\t"
"jmp 2b\n\t"

);

    int a = 0xabce;
    return 0;
}