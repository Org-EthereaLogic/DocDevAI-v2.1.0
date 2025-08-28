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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const generateDocument_1 = require("./commands/generateDocument");
const quickGenerate_1 = require("./commands/quickGenerate");
function activate(context) {
    console.log('DevDocAI extension is now active!');
    // Register the main document generation command
    const generateDocumentCommand = vscode.commands.registerCommand('devdocai.generateDocument', generateDocument_1.generateDocument);
    // Register quick generation commands
    const generateReadmeCommand = vscode.commands.registerCommand('devdocai.generateReadme', () => (0, quickGenerate_1.generateQuickDocument)('README'));
    const generateApiCommand = vscode.commands.registerCommand('devdocai.generateApi', () => (0, quickGenerate_1.generateQuickDocument)('API'));
    const generateChangelogCommand = vscode.commands.registerCommand('devdocai.generateChangelog', () => (0, quickGenerate_1.generateQuickDocument)('CHANGELOG'));
    const generateContributingCommand = vscode.commands.registerCommand('devdocai.generateContributing', () => (0, quickGenerate_1.generateQuickDocument)('CONTRIBUTING'));
    const generateLicenseCommand = vscode.commands.registerCommand('devdocai.generateLicense', () => (0, quickGenerate_1.generateQuickDocument)('LICENSE'));
    // Add all commands to subscriptions
    context.subscriptions.push(generateDocumentCommand, generateReadmeCommand, generateApiCommand, generateChangelogCommand, generateContributingCommand, generateLicenseCommand);
    // Show activation message
    vscode.window.showInformationMessage('DevDocAI is ready to generate documentation!');
}
exports.activate = activate;
function deactivate() {
    console.log('DevDocAI extension is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map