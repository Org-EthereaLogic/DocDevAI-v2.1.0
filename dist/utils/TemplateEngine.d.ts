/**
 * Simple template engine for loading and rendering markdown templates
 * with variable substitution using {{variable}} syntax
 */
export declare class TemplateEngine {
    private templatesDir;
    /**
     * Initialize template engine with templates directory
     * @param templatesDir - Directory containing template files (default: './templates')
     */
    constructor(templatesDir?: string);
    /**
     * Render a template with the provided variables
     * @param templateName - Name of the template file (with or without .md extension)
     * @param variables - Object containing variable replacements
     * @returns Rendered template string
     */
    render(templateName: string, variables?: Record<string, any>): string;
    /**
     * Load template content from file
     * @param templateName - Name of the template file
     * @returns Template content
     */
    private loadTemplate;
    /**
     * Resolve template path, adding .md extension if not present
     * @param templateName - Template name
     * @returns Full template path
     */
    private resolveTemplatePath;
    /**
     * Replace variables in template content
     * @param template - Template content
     * @param variables - Variables to replace
     * @returns Template with replaced variables
     */
    private replaceVariables;
}
