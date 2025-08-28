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
exports.generateDocument = void 0;
const vscode = __importStar(require("vscode"));
const documentGenerator_1 = require("../services/documentGenerator");
const workspaceAnalyzer_1 = require("../services/workspaceAnalyzer");
async function generateDocument() {
    try {
        const documentGenerator = new documentGenerator_1.VSCodeDocumentGenerator();
        const workspaceAnalyzer = new workspaceAnalyzer_1.WorkspaceAnalyzer();
        // Step 1: Document Type Selection
        const docTypes = documentGenerator.getAvailableDocTypes();
        const selectedDocType = await vscode.window.showQuickPick(docTypes.map(type => ({
            label: `📄 ${type}.md`,
            description: getDocumentDescription(type),
            detail: getDocumentDetail(type),
            value: type
        })), {
            placeHolder: 'Select the type of document to generate',
            title: 'DevDocAI: Document Generator'
        });
        if (!selectedDocType) {
            return; // User cancelled
        }
        // Step 2: Data Input Method Selection
        const dataInputMethod = await vscode.window.showQuickPick([
            {
                label: '🤖 Auto-detect from workspace',
                description: 'Recommended',
                detail: 'Analyze package.json, git config, and workspace files',
                value: 'auto'
            },
            {
                label: '⚡ Use project defaults',
                description: 'Quick generation',
                detail: 'Use basic defaults with project name',
                value: 'defaults'
            },
            {
                label: '✏️ Manual JSON input',
                description: 'Custom data',
                detail: 'Provide custom template variables',
                value: 'manual'
            }
        ], {
            placeHolder: 'How would you like to provide template data?',
            title: 'DevDocAI: Data Input Method'
        });
        if (!dataInputMethod) {
            return; // User cancelled
        }
        // Step 3: Get Document Data
        let documentData = {};
        switch (dataInputMethod.value) {
            case 'auto':
                documentData = await workspaceAnalyzer.getSuggestedData(selectedDocType.value);
                break;
            case 'defaults':
                const workspaceInfo = await workspaceAnalyzer.analyzeWorkspace();
                documentData = {
                    projectName: workspaceInfo.projectName,
                    description: `${workspaceInfo.projectName} - A project generated with DevDocAI`,
                    author: 'Developer',
                    version: '1.0.0',
                    license: 'MIT'
                };
                break;
            case 'manual':
                const jsonInput = await vscode.window.showInputBox({
                    prompt: 'Enter template data as JSON',
                    placeHolder: '{"projectName": "MyProject", "description": "A great project", "author": "Your Name"}',
                    validateInput: (value) => {
                        try {
                            JSON.parse(value);
                            return null; // Valid JSON
                        }
                        catch (error) {
                            return 'Invalid JSON format';
                        }
                    }
                });
                if (!jsonInput) {
                    return; // User cancelled
                }
                try {
                    documentData = JSON.parse(jsonInput);
                }
                catch (error) {
                    vscode.window.showErrorMessage('Invalid JSON data provided');
                    return;
                }
                break;
        }
        // Step 4: Output Location Selection
        const config = vscode.workspace.getConfiguration('devdocai');
        const defaultPath = config.get('defaultOutputPath', './');
        const outputOptions = [
            {
                label: '📁 Current workspace root',
                description: 'Recommended',
                detail: `Save as ${selectedDocType.value}.md in workspace root`,
                value: 'workspace'
            },
            {
                label: '📂 docs/ folder',
                description: 'Documentation folder',
                detail: `Save as docs/${selectedDocType.value}.md`,
                value: 'docs'
            },
            {
                label: '💾 Custom path...',
                description: 'Choose specific location',
                detail: 'Select custom file path',
                value: 'custom'
            }
        ];
        const outputChoice = await vscode.window.showQuickPick(outputOptions, {
            placeHolder: 'Where should we save the document?',
            title: 'DevDocAI: Output Location'
        });
        if (!outputChoice) {
            return; // User cancelled
        }
        let outputPath;
        switch (outputChoice.value) {
            case 'workspace':
                outputPath = undefined; // Use default
                break;
            case 'docs':
                outputPath = `./docs/${selectedDocType.value}.md`;
                break;
            case 'custom':
                const customPath = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(`${selectedDocType.value}.md`),
                    filters: {
                        'Markdown files': ['md'],
                        'All files': ['*']
                    }
                });
                if (!customPath) {
                    return; // User cancelled
                }
                outputPath = customPath.fsPath;
                break;
        }
        // Step 5: Generate Document with Progress
        const result = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Generating ${selectedDocType.value} document...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Analyzing workspace...' });
            progress.report({ increment: 25, message: 'Loading template...' });
            progress.report({ increment: 50, message: 'Generating content...' });
            const filePath = await documentGenerator.generateAndSave(selectedDocType.value, documentData, outputPath);
            progress.report({ increment: 100, message: 'Complete!' });
            return filePath;
        });
        // Step 6: Show Success and Open Document
        const action = await vscode.window.showInformationMessage(`✅ Successfully generated ${selectedDocType.value} document!`, 'Open Document', 'Open Folder');
        if (action === 'Open Document') {
            const doc = await vscode.workspace.openTextDocument(result);
            await vscode.window.showTextDocument(doc);
        }
        else if (action === 'Open Folder') {
            const uri = vscode.Uri.file(result);
            await vscode.commands.executeCommand('revealFileInOS', uri);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`DevDocAI Error: ${errorMessage}`);
        console.error('DevDocAI Error:', error);
    }
}
exports.generateDocument = generateDocument;
/**
 * Get description for document type
 */
function getDocumentDescription(docType) {
    switch (docType) {
        case 'README':
            return 'Project overview & setup guide';
        case 'API':
            return 'API documentation & endpoints';
        case 'CHANGELOG':
            return 'Version history & changes';
        case 'CONTRIBUTING':
            return 'Contribution guidelines';
        case 'LICENSE':
            return 'Project license file';
        default:
            return 'Documentation file';
    }
}
/**
 * Get detailed description for document type
 */
function getDocumentDetail(docType) {
    switch (docType) {
        case 'README':
            return 'Create a comprehensive README with installation, usage, and project information';
        case 'API':
            return 'Generate API documentation with endpoints, authentication, and examples';
        case 'CHANGELOG':
            return 'Create a changelog following Keep a Changelog format';
        case 'CONTRIBUTING':
            return 'Generate contribution guidelines for open source projects';
        case 'LICENSE':
            return 'Create a license file with copyright information';
        default:
            return 'Generate documentation for your project';
    }
}
//# sourceMappingURL=generateDocument.js.map