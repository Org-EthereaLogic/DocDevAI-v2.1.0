"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSCodeDocumentGenerator = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
class VSCodeDocumentGenerator {
    constructor() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error('No workspace folder found');
        }
        this.workspaceRoot = workspaceFolders[0].uri.fsPath;
    }
    /**
     * Generate document content using the core DocumentGenerator
     */
    async generateDocument(docType, data) {
        try {
            // For MVP, we'll use a simplified generator
            // In production, this would import and use the main DocumentGenerator class
            return this.generateMockDocument(docType, data);
        }
        catch (error) {
            throw new Error(`Failed to generate ${docType}: ${error}`);
        }
    }
    /**
     * Generate and save document to the workspace
     */
    async generateAndSave(docType, data, outputPath) {
        const content = await this.generateDocument(docType, data);
        // Determine output path
        const finalPath = outputPath || path.join(this.workspaceRoot, `${docType}.md`);
        // Create VS Code URI
        const uri = vscode.Uri.file(finalPath);
        // Write the file
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
        return finalPath;
    }
    /**
     * Get available document types
     */
    getAvailableDocTypes() {
        return ['README', 'API', 'CHANGELOG', 'CONTRIBUTING', 'LICENSE'];
    }
    /**
     * Mock document generator for MVP
     * In production, this would use the actual DocumentGenerator
     */
    generateMockDocument(docType, data) {
        const defaultData = {
            projectName: this.getProjectName(),
            description: data?.description || 'A project generated with DevDocAI',
            author: data?.author || 'Developer',
            version: data?.version || '1.0.0',
            license: data?.license || 'MIT',
            generatedAt: new Date().toISOString(),
            generatedBy: 'DevDocAI VS Code Extension v0.1.0'
        };
        const mergedData = { ...defaultData, ...data };
        switch (docType) {
            case 'README':
                return this.generateReadmeTemplate(mergedData);
            case 'API':
                return this.generateApiTemplate(mergedData);
            case 'CHANGELOG':
                return this.generateChangelogTemplate(mergedData);
            case 'CONTRIBUTING':
                return this.generateContributingTemplate(mergedData);
            case 'LICENSE':
                return this.generateLicenseTemplate(mergedData);
            default:
                throw new Error(`Unknown document type: ${docType}`);
        }
    }
    /**
     * Extract project name from workspace
     */
    getProjectName() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return 'My Project';
        }
        return path.basename(workspaceFolder.uri.fsPath);
    }
    // Template generators (MVP versions)
    generateReadmeTemplate(data) {
        return `# ${data.projectName}

${data.description}

## Installation

\`\`\`bash
npm install ${data.projectName.toLowerCase()}
\`\`\`

## Usage

\`\`\`javascript
const ${data.projectName.replace(/[^a-zA-Z0-9]/g, '')} = require('${data.projectName.toLowerCase()}');
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Author

${data.author}

## License

${data.license}

---
Generated on ${data.generatedAt} by ${data.generatedBy}
`;
    }
    generateApiTemplate(data) {
        return `# ${data.projectName} API Documentation

Version: ${data.version}

## Overview

${data.description}

## Authentication

Describe authentication method here.

## Endpoints

### GET /api/example

Description of the endpoint.

**Response:**
\`\`\`json
{
  "message": "Hello World",
  "status": "success"
}
\`\`\`

## Error Handling

Standard HTTP status codes are used.

---
Generated on ${data.generatedAt} by ${data.generatedBy}
`;
    }
    generateChangelogTemplate(data) {
        return `# Changelog

All notable changes to ${data.projectName} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [${data.version}] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release
- Core functionality

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

---
Generated on ${data.generatedAt} by ${data.generatedBy}
`;
    }
    generateContributingTemplate(data) {
        return `# Contributing to ${data.projectName}

Thank you for your interest in contributing to ${data.projectName}!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

\`\`\`bash
git clone https://github.com/yourusername/${data.projectName.toLowerCase()}.git
cd ${data.projectName.toLowerCase()}
npm install
npm test
\`\`\`

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the README.md with details of changes to the interface
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
4. You may merge the Pull Request in once you have the sign-off of two other developers

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---
Generated on ${data.generatedAt} by ${data.generatedBy}
`;
    }
    generateLicenseTemplate(data) {
        return `MIT License

Copyright (c) ${new Date().getFullYear()} ${data.author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
Generated on ${data.generatedAt} by ${data.generatedBy}
`;
    }
}
exports.VSCodeDocumentGenerator = VSCodeDocumentGenerator;
//# sourceMappingURL=documentGenerator.js.map