#include <iostream>
#include <fstream>
#include <vector>

// Function to create a backup of the file
bool createBackup(const char* originalFile, const char* backupFile) {
    std::ifstream src(originalFile, std::ios::binary);
    std::ofstream dst(backupFile, std::ios::binary);

    if (!src) {
        std::cerr << "Error: Unable to open the original file " << originalFile << " for backup." << std::endl;
        return false;
    }
    
    if (!dst) {
        std::cerr << "Error: Unable to create the backup file " << backupFile << std::endl;
        return false;
    }
    
    dst << src.rdbuf();  // Copy contents from the source file to the destination (backup) file

    // Close the files
    src.close();
    dst.close();

    std::cout << "Backup created successfully as " << backupFile << std::endl;
    return true;
}

int main() {
    // File name
    const char* originalFile = "cm0102.exe";
    const char* backupFile = "cm0102 Backup.exe";
    
    // The offset to modify
    std::streampos offset = 0x4CFA1E;
    
    // Bytes to write (6 bytes)
    std::vector<unsigned char> bytes = {0xE9, 0x57, 0x02, 0x00, 0x00, 0x90};
    
    // Create a backup of the file before modifying
    if (!createBackup(originalFile, backupFile)) {
        return 1; // Exit if the backup fails
    }
    
    // Open the file in binary read/write mode
    std::fstream file(originalFile, std::ios::in | std::ios::out | std::ios::binary);
    
    if (!file) {
        std::cerr << "Error: Unable to open the file " << originalFile << std::endl;
        return 1;
    }
    
    // Move the file pointer to the offset
    file.seekp(offset);
    
    if (file.fail()) {
        std::cerr << "Error: Unable to seek to the offset " << std::hex << offset << std::endl;
        return 1;
    }
    
    // Write the bytes to the file
    file.write(reinterpret_cast<const char*>(bytes.data()), bytes.size());
    
    if (file.fail()) {
        std::cerr << "Error: Unable to write to the file " << originalFile << std::endl;
        return 1;
    }
    
    // Close the file
    file.close();
    
    std::cout << "Bytes written successfully to " << originalFile << std::endl;
    return 0;
}
