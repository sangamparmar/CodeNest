import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import glob from "glob";
import chalk from "chalk";

// Convert ES module __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Paths
const clientSrcDir = path.join(__dirname, "client", "src");
const serverSrcDir = path.join(__dirname, "server", "src");
const clientTestDir = path.join(__dirname, "client", "tests");
const serverTestDir = path.join(__dirname, "server", "tests");

// Ensure test output directories exist
[clientTestDir, serverTestDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(chalk.green(`📁 Created test directory: ${dir}`));
    }
});

console.log(chalk.green("🔍 Scanning project for TypeScript files..."));

// Function to process files and generate tests
const processFiles = (srcDir, testDir, isServer = false) => {
    glob(`${srcDir}/**/*.{ts,tsx}`, (err, files) => {
        if (err) {
            console.error(chalk.red("❌ Error scanning files:"), err);
            return;
        }

        if (files.length === 0) {
            console.log(chalk.yellow(`⚠️ No TypeScript files found in ${srcDir}.`));
            return;
        }

        for (const file of files) {
            // Skip existing test files
            if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;

            const content = fs.readFileSync(file, "utf-8");
            const fileName = path.basename(file, path.extname(file));
            const testFilePath = path.join(testDir, `${fileName}.test.tsx`);

            // Skip if test file already exists
            if (fs.existsSync(testFilePath)) {
                console.log(chalk.yellow(`⚠️ Test file already exists: ${testFilePath}. Skipping...`));
                continue;
            }

            // Calculate relative path for imports
            const relativeImportPath = path.relative(testDir, file).replace(/\\/g, "/").replace(/\.tsx?$/, "");

            // Detect React components or API routes
            const isReactComponent = content.includes("import React") || content.includes("<");

            // Generate test content
            let testContent = "";

            if (isServer) {
                testContent += `import request from 'supertest';\n`;
                testContent += `import app from '../server/src/server'; // Update if necessary\n\n`;
            } else if (isReactComponent) {
                testContent += `import { render, screen } from '@testing-library/react';\n`;
                testContent += `import React from 'react';\n`;
                testContent += `import ${fileName} from '${relativeImportPath}';\n\n`;
            }

            testContent += `describe('${fileName} tests', () => {\n`;

            if (isReactComponent) {
                testContent += `  test('renders ${fileName} component', () => {\n`;
                testContent += `    render(<${fileName} />);\n`;
                testContent += `    expect(screen.getByText(/TODO/i)).toBeInTheDocument(); // Update with actual text\n`;
                testContent += `  });\n`;
            } else if (isServer) {
                testContent += `  test('API response for ${fileName}', async () => {\n`;
                testContent += `    const response = await request(app).get('/api/${fileName}'); // Update route\n`;
                testContent += `    expect(response.status).toBe(200);\n`;
                testContent += `  });\n`;
            } else {
                testContent += `  // TODO: No functions detected in ${fileName}. Add manual test cases.\n`;
            }

            testContent += `});\n`;

            // Write the test file
            fs.writeFileSync(testFilePath, testContent);
            console.log(chalk.blue(`✅ Generated test: ${testFilePath}`));
        }

        console.log(chalk.green(`🎉 Test generation completed for ${testDir}`));
    });
};

// Process client and server files
processFiles(clientSrcDir, clientTestDir);
processFiles(serverSrcDir, serverTestDir, true);
