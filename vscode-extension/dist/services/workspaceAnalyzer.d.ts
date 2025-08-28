export interface WorkspaceInfo {
    projectName: string;
    description?: string;
    version?: string;
    author?: string;
    license?: string;
    repository?: string;
    main?: string;
    scripts?: Record<string, string>;
    dependencies?: string[];
    hasPackageJson: boolean;
    hasGitRepo: boolean;
}
export declare class WorkspaceAnalyzer {
    private workspaceRoot;
    constructor();
    /**
     * Analyze the current workspace and extract project information
     */
    analyzeWorkspace(): Promise<WorkspaceInfo>;
    /**
     * Get suggested data for a specific document type
     */
    getSuggestedData(docType: string): Promise<Record<string, any>>;
    /**
     * Extract project name from workspace folder
     */
    private getProjectName;
    /**
     * Read and parse package.json if it exists
     */
    private getPackageJsonInfo;
    /**
     * Get git information if available
     */
    private getGitInfo;
    /**
     * Extract author name from various package.json author formats
     */
    private extractAuthor;
    /**
     * Extract repository URL from various package.json repository formats
     */
    private extractRepository;
    /**
     * Convert string to camelCase
     */
    private toCamelCase;
}
//# sourceMappingURL=workspaceAnalyzer.d.ts.map