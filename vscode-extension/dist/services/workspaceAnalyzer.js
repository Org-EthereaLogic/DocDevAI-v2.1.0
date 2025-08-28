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
exports.WorkspaceAnalyzer = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class WorkspaceAnalyzer {
    constructor() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error('No workspace folder found');
        }
        this.workspaceRoot = workspaceFolders[0].uri.fsPath;
    }
    /**
     * Analyze the current workspace and extract project information
     */
    async analyzeWorkspace() {
        const projectName = this.getProjectName();
        const packageInfo = await this.getPackageJsonInfo();
        const gitInfo = await this.getGitInfo();
        return {
            projectName,
            ...packageInfo,
            hasPackageJson: !!packageInfo.version,
            hasGitRepo: gitInfo.hasGitRepo,
            repository: gitInfo.repository,
            author: packageInfo.author || gitInfo.author
        };
    }
    /**
     * Get suggested data for a specific document type
     */
    async getSuggestedData(docType) {
        const workspaceInfo = await this.analyzeWorkspace();
        const baseData = {
            projectName: workspaceInfo.projectName,
            description: workspaceInfo.description || `${workspaceInfo.projectName} - A project generated with DevDocAI`,
            author: workspaceInfo.author || 'Developer',
            version: workspaceInfo.version || '1.0.0',
            license: workspaceInfo.license || 'MIT'
        };
        // Customize data based on document type
        switch (docType) {
            case 'README':
                return {
                    ...baseData,
                    installation: workspaceInfo.hasPackageJson ? `npm install ${workspaceInfo.projectName}` : 'Installation instructions here',
                    usage: workspaceInfo.main ? `const ${this.toCamelCase(workspaceInfo.projectName)} = require('${workspaceInfo.projectName}');` : 'Usage instructions here',
                    scripts: workspaceInfo.scripts ? Object.keys(workspaceInfo.scripts) : []
                };
            case 'API':
                return {
                    ...baseData,
                    baseUrl: 'https://api.example.com',
                    version: workspaceInfo.version || '1.0.0'
                };
            case 'CHANGELOG':
                return {
                    ...baseData,
                    currentVersion: workspaceInfo.version || '1.0.0',
                    date: new Date().toISOString().split('T')[0]
                };
            case 'CONTRIBUTING':
                return {
                    ...baseData,
                    repository: workspaceInfo.repository,
                    setupCommand: workspaceInfo.scripts?.install || 'npm install',
                    testCommand: workspaceInfo.scripts?.test || 'npm test'
                };
            case 'LICENSE':
                return {
                    ...baseData,
                    year: new Date().getFullYear(),
                    licenseType: workspaceInfo.license || 'MIT'
                };
            default:
                return baseData;
        }
    }
    /**
     * Extract project name from workspace folder
     */
    getProjectName() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return 'My Project';
        }
        return path.basename(workspaceFolder.uri.fsPath);
    }
    /**
     * Read and parse package.json if it exists
     */
    async getPackageJsonInfo() {
        try {
            const packageJsonUri = vscode.Uri.file(path.join(this.workspaceRoot, 'package.json'));
            const content = await vscode.workspace.fs.readFile(packageJsonUri);
            const packageJson = JSON.parse(content.toString());
            return {
                description: packageJson.description,
                version: packageJson.version,
                author: this.extractAuthor(packageJson.author),
                license: packageJson.license,
                main: packageJson.main,
                scripts: packageJson.scripts,
                dependencies: Object.keys(packageJson.dependencies || {}),
                repository: this.extractRepository(packageJson.repository)
            };
        }
        catch (error) {
            // package.json doesn't exist or is invalid
            return {};
        }
    }
    /**
     * Get git information if available
     */
    async getGitInfo() {
        try {
            const gitConfigUri = vscode.Uri.file(path.join(this.workspaceRoot, '.git', 'config'));
            await vscode.workspace.fs.stat(gitConfigUri);
            // Git repo exists, try to get user info
            // Note: For MVP, we'll use a simplified approach
            // In production, you might want to use git commands or read .git/config
            return {
                hasGitRepo: true,
                // These would be extracted from git config in a full implementation
                author: undefined,
                repository: undefined
            };
        }
        catch (error) {
            return { hasGitRepo: false };
        }
    }
    /**
     * Extract author name from various package.json author formats
     */
    extractAuthor(author) {
        if (typeof author === 'string') {
            // "John Doe <john@example.com>"
            const match = author.match(/^([^<]+)/);
            return match ? match[1].trim() : author;
        }
        else if (typeof author === 'object' && author.name) {
            return author.name;
        }
        return undefined;
    }
    /**
     * Extract repository URL from various package.json repository formats
     */
    extractRepository(repository) {
        if (typeof repository === 'string') {
            return repository;
        }
        else if (typeof repository === 'object' && repository.url) {
            return repository.url;
        }
        return undefined;
    }
    /**
     * Convert string to camelCase
     */
    toCamelCase(str) {
        return str
            .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
            .replace(/^(.)/, (_, char) => char ? char.toLowerCase() : '');
    }
}
exports.WorkspaceAnalyzer = WorkspaceAnalyzer;
//# sourceMappingURL=workspaceAnalyzer.js.map