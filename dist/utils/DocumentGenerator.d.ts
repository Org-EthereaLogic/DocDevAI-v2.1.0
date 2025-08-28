/**
 * Document Generator for creating documentation from templates
 * Integrates Logger, Config, and TemplateEngine to generate various document types
 */
export declare class DocumentGenerator {
    private config;
    private logger;
    private templateEngine;
    private supportedDocTypes;
    /**
     * Initialize DocumentGenerator with configuration and dependencies
     */
    constructor();
    /**
     * Generate a document from template with computed fields
     * @param docType - Type of document to generate (README, API, CHANGELOG, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, SECURITY, PULL_REQUEST_TEMPLATE, ISSUE_TEMPLATE, TESTING, ARCHITECTURE, FAQ)
     * @param data - Data to populate the template
     * @returns Generated document content
     */
    generate(docType: string, data?: Record<string, any>): string;
    /**
     * Generate a document and save it to the file system
     * @param docType - Type of document to generate
     * @param data - Data to populate the template
     * @param outputPath - Optional output path (uses config default if not provided)
     * @returns Path where the document was saved
     */
    generateAndSave(docType: string, data?: Record<string, any>, outputPath?: string): string;
    /**
     * Get list of available document types
     * @returns Array of supported document type names
     */
    getAvailableDocTypes(): string[];
}
