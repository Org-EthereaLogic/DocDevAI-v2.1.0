export declare class VSCodeDocumentGenerator {
    private workspaceRoot;
    constructor();
    /**
     * Generate document content using the core DocumentGenerator
     */
    generateDocument(docType: string, data?: Record<string, any>): Promise<string>;
    /**
     * Generate and save document to the workspace
     */
    generateAndSave(docType: string, data?: Record<string, any>, outputPath?: string): Promise<string>;
    /**
     * Get available document types
     */
    getAvailableDocTypes(): string[];
    /**
     * Mock document generator for MVP
     * In production, this would use the actual DocumentGenerator
     */
    private generateMockDocument;
    /**
     * Extract project name from workspace
     */
    private getProjectName;
    private generateReadmeTemplate;
    private generateApiTemplate;
    private generateChangelogTemplate;
    private generateContributingTemplate;
    private generateLicenseTemplate;
}
//# sourceMappingURL=documentGenerator.d.ts.map