#include <iostream>
#include <Windows.h>
#include <tlhelp32.h> // Required for PROCESSENTRY32 and process snapshot functions

int main() {
    // Define the name of the process you want to open
    const char* processName = "cm0102.exe";
    DWORD processID = 0;
    HANDLE hProcess = NULL;
    PROCESSENTRY32 pe32;

    // Get a handle to the snapshot of all processes
    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) {
        std::cerr << "Error creating snapshot: " << GetLastError() << std::endl;
        return 1;
    }

    pe32.dwSize = sizeof(PROCESSENTRY32);

    // Iterate through the processes to find the target one
    if (Process32First(hSnapshot, &pe32)) {
        do {
            if (strcmp(pe32.szExeFile, processName) == 0) {
                processID = pe32.th32ProcessID;
                break;
            }
        } while (Process32Next(hSnapshot, &pe32));
    }

    // Clean up the snapshot handle
    CloseHandle(hSnapshot);

    if (processID == 0) {
        std::cerr << "Process not found!" << std::endl;
        return 1;
    }

    // Open the process with the required access rights
    hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, processID);
    if (hProcess == NULL) {
        std::cerr << "Error opening process: " << GetLastError() << std::endl;
        return 1;
    }

    // Define the address and the new bytes
    BYTE newBytes[6] = { 0xE9, 0x57, 0x02, 0x00, 0x00, 0x90 };
    LPVOID address = (LPVOID)0x8CFA1E; // The address where you want to write the bytes

    // Write the new bytes into the process memory
    SIZE_T bytesWritten;
    if (WriteProcessMemory(hProcess, address, newBytes, sizeof(newBytes), &bytesWritten)) {
        std::cout << "Memory modified successfully!" << std::endl;
    } else {
        std::cerr << "Error writing to process memory: " << GetLastError() << std::endl;
        // Close the process handle before exiting
        CloseHandle(hProcess);
        return 1;
    }

    // Close the handle to the process
    CloseHandle(hProcess);

    return 0;
}
