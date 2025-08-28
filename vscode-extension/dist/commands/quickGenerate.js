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
exports.generateQuickDocument = void 0;
const vscode = __importStar(require("vscode"));
const documentGenerator_1 = require("../services/documentGenerator");
const workspaceAnalyzer_1 = require("../services/workspaceAnalyzer");
/**
 * Quick document generation for specific document types
 */
async function generateQuickDocument(docType) {
    try {
        const documentGenerator = new documentGenerator_1.VSCodeDocumentGenerator();
        const workspaceAnalyzer = new workspaceAnalyzer_1.WorkspaceAnalyzer();
        // Auto-detect workspace data
        const documentData = await workspaceAnalyzer.getSuggestedData(docType);
        // Generate with progress indication
        const result = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Generating ${docType}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Analyzing workspace...' });
            progress.report({ increment: 50, message: 'Generating content...' });
            const filePath = await documentGenerator.generateAndSave(docType, documentData);
            progress.report({ increment: 100, message: 'Complete!' });
            return filePath;
        });
        // Show success notification with actions
        const action = await vscode.window.showInformationMessage(`✅ Generated ${docType}.md successfully!`, 'Open File', 'Show in Explorer');
        // Handle user action
        if (action === 'Open File') {
            const doc = await vscode.workspace.openTextDocument(result);
            await vscode.window.showTextDocument(doc);
        }
        else if (action === 'Show in Explorer') {
            const uri = vscode.Uri.file(result);
            await vscode.commands.executeCommand('revealFileInOS', uri);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`Failed to generate ${docType}: ${errorMessage}`);
        console.error(`DevDocAI ${docType} generation error:`, error);
    }
}
exports.generateQuickDocument = generateQuickDocument;
//# sourceMappingURL=quickGenerate.js.map