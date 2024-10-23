#include <windows.h>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>

// Global variables for window and controls
HWND hTextBox, hButton;
std::string exePath;  // Path where the program is running

const DWORD OFFSET_TO_MODIFY = 0x56D808;  // Offset to be modified

// Function to get the directory of the current executable
std::string GetExecutablePath() {
    char buffer[MAX_PATH];
    GetModuleFileName(NULL, buffer, MAX_PATH);
    std::string fullPath(buffer);
    size_t pos = fullPath.find_last_of("\\/");
    return (std::string::npos == pos) ? "" : fullPath.substr(0, pos + 1);
}

// Function to backup the original file
bool BackupFile(const std::string& exeFile, const std::string& backupFile) {
    std::ifstream src(exeFile, std::ios::binary);
    std::ofstream dst(backupFile, std::ios::binary);
    
    if (!src || !dst) {
        MessageBox(NULL, "Error creating backup.", "Error", MB_ICONERROR);
        return false;
    }
    dst << src.rdbuf();  // Copy the file content
    src.close();
    dst.close();
    return true;
}

// Function to modify the file at the given offset
bool ModifyFile(const std::string& exeFile, float value) {
    std::fstream file(exeFile, std::ios::in | std::ios::out | std::ios::binary);
    if (!file) {
        MessageBox(NULL, "Failed to open cm0102.exe.", "Error", MB_ICONERROR);
        return false;
    }
    
    // Move to the specific offset
    file.seekp(OFFSET_TO_MODIFY, std::ios::beg);
    if (file.fail()) {
        MessageBox(NULL, "Error seeking the position in the file.", "Error", MB_ICONERROR);
        return false;
    }
    
    // Write the double value at the specified offset
    file.write(reinterpret_cast<char*>(&value), sizeof(float));
    file.close();
    
    if (file.fail()) {
        MessageBox(NULL, "Error writing to the file.", "Error", MB_ICONERROR);
        return false;
    }
    
    return true;
}

// Function to convert user input to double and perform the operations
void ProcessInput() {
    char buffer[256];
    GetWindowText(hTextBox, buffer, 256);  // Get text from the input box
    
    try {
        float inputValue = std::stof(buffer);  // Convert to double

        std::string exeFilePath = exePath + "cm0102.exe";
        std::string backupFilePath = exePath + "cm0102_backup.exe";

        if (BackupFile(exeFilePath, backupFilePath) && ModifyFile(exeFilePath, inputValue)) {
            MessageBox(NULL, "File modification successful!", "Success", MB_ICONINFORMATION);
        }
    } catch (...) {
        MessageBox(NULL, "Invalid input. Please enter a valid number.", "Error", MB_ICONERROR);
    }
}

// Window procedure function
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
        case WM_CREATE:
            // Create text input box with default value "71"
            hTextBox = CreateWindow("EDIT", "", WS_CHILD | WS_VISIBLE | WS_BORDER,
                                    50, 50, 200, 20, hwnd, NULL, NULL, NULL);
            SetWindowText(hTextBox, "71");  // Set default text value to "71"
            
            // Create button
            hButton = CreateWindow("BUTTON", "Modify File", WS_CHILD | WS_VISIBLE,
                                   50, 100, 100, 30, hwnd, (HMENU)1, NULL, NULL);
            break;
        
        case WM_COMMAND:
            if (LOWORD(wParam) == 1) {  // Button clicked
                ProcessInput();
            }
            break;
        
        case WM_DESTROY:
            PostQuitMessage(0);
            break;
        
        default:
            return DefWindowProc(hwnd, uMsg, wParam, lParam);
    }
    return 0;
}

// WinMain: Entry point for a Windows application
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    const char CLASS_NAME[] = "FileModifierWindowClass";
    
    WNDCLASS wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = CLASS_NAME;
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    
    // Register the window class
    RegisterClass(&wc);
    
    // Get the path of the current executable
    exePath = GetExecutablePath();
    
    // Create the window
    HWND hwnd = CreateWindowEx(0, CLASS_NAME, "File Modifier", WS_OVERLAPPEDWINDOW,
                               CW_USEDEFAULT, CW_USEDEFAULT, 300, 200,
                               NULL, NULL, hInstance, NULL);
    
    if (hwnd == NULL) {
        return 0;
    }
    
    ShowWindow(hwnd, nCmdShow);
    
    // Run the message loop
    MSG msg = {};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    
    return 0;
}
