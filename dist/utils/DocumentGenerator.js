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
exports.DocumentGenerator = void 0;
const Logger_1 = require("./Logger");
const Config_1 = require("./Config");
const TemplateEngine_1 = require("./TemplateEngine");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Document Generator for creating documentation from templates
 * Integrates Logger, Config, and TemplateEngine to generate various document types
 */
class DocumentGenerator {
    /**
     * Initialize DocumentGenerator with configuration and dependencies
     */
    constructor() {
        this.supportedDocTypes = [
            'README', 'API', 'CHANGELOG', 'CONTRIBUTING', 'LICENSE',
            'CODE_OF_CONDUCT', 'SECURITY', 'PULL_REQUEST_TEMPLATE',
            'ISSUE_TEMPLATE', 'TESTING', 'ARCHITECTURE', 'FAQ'
        ];
        this.config = new Config_1.Config();
        // Initialize logger with config options
        const loggerOptions = {
            logLevel: this.config.get('logLevel'),
            logFile: this.config.get('logFile')
        };
        this.logger = new Logger_1.Logger(loggerOptions);
        // Initialize template engine with templates directory from config
        this.templateEngine = new TemplateEngine_1.TemplateEngine(this.config.get('templates'));
    }
    /**
     * Generate a document from template with computed fields
     * @param docType - Type of document to generate (README, API, CHANGELOG, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, SECURITY, PULL_REQUEST_TEMPLATE, ISSUE_TEMPLATE, TESTING, ARCHITECTURE, FAQ)
     * @param data - Data to populate the template
     * @returns Generated document content
     */
    generate(docType, data = {}) {
        try {
            this.logger.info(`Generating document: ${docType}`);
            // Add computed fields
            const enrichedData = {
                ...data,
                generatedAt: new Date().toISOString(),
                generatedBy: 'DevDocAI'
            };
            // Render template with enriched data
            const content = this.templateEngine.render(docType, enrichedData);
            this.logger.debug(`Document generated successfully: ${docType}`);
            return content;
        }
        catch (error) {
            const errorMessage = `Failed to generate document: ${error.message}`;
            this.logger.error(errorMessage);
            throw new Error(error.message);
        }
    }
    /**
     * Generate a document and save it to the file system
     * @param docType - Type of document to generate
     * @param data - Data to populate the template
     * @param outputPath - Optional output path (uses config default if not provided)
     * @returns Path where the document was saved
     */
    generateAndSave(docType, data = {}, outputPath) {
        try {
            // Generate the document
            const content = this.generate(docType, data);
            // Determine output path
            const finalPath = outputPath || path.join(this.config.get('output'), `${docType}.md`);
            this.logger.debug(`Saving document to: ${finalPath}`);
            // Create directory if it doesn't exist
            const dir = path.dirname(finalPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            // Save the document
            fs.writeFileSync(finalPath, content, 'utf-8');
            this.logger.info(`Document saved to: ${finalPath}`);
            return finalPath;
        }
        catch (error) {
            const errorMessage = `Failed to save document: ${error.message}`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
    /**
     * Get list of available document types
     * @returns Array of supported document type names
     */
    getAvailableDocTypes() {
        return [...this.supportedDocTypes];
    }
}
exports.DocumentGenerator = DocumentGenerator;
//# sourceMappingURL=DocumentGenerator.js.map