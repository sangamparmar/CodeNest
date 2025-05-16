import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the source directory
const srcDir = path.join(__dirname, 'client', 'src');
console.log('Source Directory:', srcDir);

// Function to add React import if missing
const addReactImport = (filePath) => {
    const code = fs.readFileSync(filePath, 'utf-8');

    if (!code.includes("import React")) {
        const updatedCode = `import React from "react";\n${code}`;
        fs.writeFileSync(filePath, updatedCode, 'utf-8');
        console.log(`✅ Added React import to ${filePath}`);
    } else {
        console.log(`ℹ️ React import already exists in ${filePath}`);
    }
};

// Recursively process all .jsx and .tsx files in the src directory
const processFiles = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            processFiles(fullPath);
        } else if (file.name.endsWith('.jsx') || file.name.endsWith('.tsx')) {
            addReactImport(fullPath);
        }
    });
};

// Start processing
if (fs.existsSync(srcDir)) {
    processFiles(srcDir);
    console.log('✅ Finished processing files.');
} else {
    console.log('❌ Source directory not found:', srcDir);
}
