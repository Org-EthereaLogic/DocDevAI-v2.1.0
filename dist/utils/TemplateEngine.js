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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Simple template engine for loading and rendering markdown templates
 * with variable substitution using {{variable}} syntax
 */
class TemplateEngine {
    /**
     * Initialize template engine with templates directory
     * @param templatesDir - Directory containing template files (default: './templates')
     */
    constructor(templatesDir = './templates') {
        this.templatesDir = templatesDir;
    }
    /**
     * Render a template with the provided variables
     * @param templateName - Name of the template file (with or without .md extension)
     * @param variables - Object containing variable replacements
     * @returns Rendered template string
     */
    render(templateName, variables = {}) {
        const templateContent = this.loadTemplate(templateName);
        return this.replaceVariables(templateContent, variables);
    }
    /**
     * Load template content from file
     * @param templateName - Name of the template file
     * @returns Template content
     */
    loadTemplate(templateName) {
        const templatePath = this.resolveTemplatePath(templateName);
        if (!fs.existsSync(templatePath)) {
            const fileName = path.basename(templatePath);
            throw new Error(`Template not found: ${fileName}`);
        }
        return fs.readFileSync(templatePath, 'utf-8');
    }
    /**
     * Resolve template path, adding .md extension if not present
     * @param templateName - Template name
     * @returns Full template path
     */
    resolveTemplatePath(templateName) {
        // Add .md extension if not present
        const fileName = templateName.endsWith('.md')
            ? templateName
            : `${templateName}.md`;
        return path.join(this.templatesDir, fileName);
    }
    /**
     * Replace variables in template content
     * @param template - Template content
     * @param variables - Variables to replace
     * @returns Template with replaced variables
     */
    replaceVariables(template, variables) {
        let result = template;
        // Find all {{variable}} patterns and replace them
        const variablePattern = /\{\{(\w+)\}\}/g;
        result = template.replace(variablePattern, (match, varName) => {
            // Check if variable exists in the provided variables
            if (varName in variables) {
                const value = variables[varName];
                // Handle null and undefined as empty strings
                return value === null || value === undefined ? '' : String(value);
            }
            // Return the original placeholder if variable not found
            return match;
        });
        return result;
    }
}
exports.TemplateEngine = TemplateEngine;
//# sourceMappingURL=TemplateEngine.js.map