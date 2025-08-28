#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const DocumentGenerator_1 = require("../utils/DocumentGenerator");
/**
 * CLI class for DevDocAI - provides command-line interface for document generation
 * Supports generating documents and listing available templates
 */
class CLI {
    constructor() {
        this.documentGenerator = new DocumentGenerator_1.DocumentGenerator();
    }
    /**
     * Parse command line arguments into structured format
     * @param args - Command line arguments
     * @returns Parsed command structure
     */
    parseCommand(args) {
        if (args.length === 0) {
            return { command: '', args: [], options: {} };
        }
        const command = args[0] || '';
        const remaining = args.slice(1);
        const parsedArgs = [];
        const options = {};
        for (let i = 0; i < remaining.length; i++) {
            const arg = remaining[i];
            // Handle flags
            if (arg.startsWith('--')) {
                const key = arg.substring(2);
                const value = remaining[i + 1];
                if (value && !value.startsWith('-')) {
                    options[key] = value;
                    i++; // Skip next argument as it's the value
                }
            }
            else if (arg.startsWith('-') && arg.length === 2) {
                // Handle short flags
                const shortFlag = arg.substring(1);
                const value = remaining[i + 1];
                // Map short flags to long flags
                const flagMap = {
                    'o': 'output',
                    'd': 'data',
                    'h': 'help',
                    'v': 'version'
                };
                const key = flagMap[shortFlag] || shortFlag;
                if (key === 'help' || key === 'version') {
                    options[key] = 'true';
                }
                else if (value && !value.startsWith('-')) {
                    options[key] = value;
                    i++; // Skip next argument as it's the value
                }
            }
            else {
                // Regular argument
                parsedArgs.push(arg);
            }
        }
        return { command, args: parsedArgs, options };
    }
    /**
     * Execute a command with given arguments
     * @param args - Command line arguments to execute
     */
    async executeCommand(args) {
        try {
            const parsed = this.parseCommand(args);
            // Handle help and version flags first
            if (parsed.options.help === 'true' || parsed.command === '--help' || parsed.command === '-h') {
                this.showHelp();
                return;
            }
            if (parsed.options.version === 'true' || parsed.command === '--version' || parsed.command === '-v') {
                this.showVersion();
                return;
            }
            // Handle empty command
            if (!parsed.command) {
                this.showHelp();
                return;
            }
            switch (parsed.command) {
                case 'generate':
                    await this.handleGenerateCommand(parsed.args, parsed.options);
                    break;
                case 'list':
                    await this.handleListCommand();
                    break;
                default:
                    this.handleUnknownCommand(parsed.command);
                    break;
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }
    /**
     * Handle the generate command
     * @param args - Command arguments
     * @param options - Command options
     */
    async handleGenerateCommand(args, options) {
        if (args.length === 0) {
            throw new Error('Document type is required');
        }
        const docType = args[0];
        let data = {};
        // Parse JSON data if provided
        if (options.data) {
            try {
                data = JSON.parse(options.data);
            }
            catch (error) {
                throw new Error('Invalid JSON data provided');
            }
        }
        // Determine output path
        const outputPath = options.output || `./${docType}.md`;
        try {
            // Generate and save the document
            const savedPath = await this.documentGenerator.generateAndSave(docType, data, outputPath);
            console.log(`✓ Generated ${docType} at ${savedPath}`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Handle the list command
     */
    async handleListCommand() {
        try {
            const availableTypes = this.documentGenerator.getAvailableDocTypes();
            console.log('Available templates:');
            if (availableTypes.length === 0) {
                console.log('  No templates found');
            }
            else {
                availableTypes.forEach(type => {
                    console.log(`  - ${type}`);
                });
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Handle unknown commands with suggestions
     * @param command - The unknown command
     */
    handleUnknownCommand(command) {
        console.error(`Error: Unknown command: ${command}`);
        // Provide suggestions for common typos
        const suggestions = {
            'generat': 'generate',
            'generaet': 'generate',
            'gen': 'generate',
            'lst': 'list',
            'ls': 'list'
        };
        if (suggestions[command]) {
            console.log(`Did you mean: ${suggestions[command]}?`);
        }
        throw new Error(`Unknown command: ${command}`);
    }
    /**
     * Display help information
     */
    showHelp() {
        console.log(`DevDocAI - Documentation Generator

Usage:
  devdocai <command> [options]

Commands:
  generate <type>    Generate a document of specified type
  list              List available templates
  help              Show this help message
  version           Show version information

Options:
  -o, --output <path>   Output path for generated document
  -d, --data <json>     Data as JSON string to populate template
  -h, --help           Show help
  -v, --version        Show version

Examples:
  devdocai generate README
  devdocai generate API --output ./docs/api.md
  devdocai generate README --data '{"name":"MyProject","version":"1.0.0"}'
  devdocai list

For more information, visit: https://github.com/Org-EthereaLogic/DocDevAI-v2.1.0`);
    }
    /**
     * Display version information
     */
    showVersion() {
        // Read version from package.json
        const packageJson = require('../../package.json');
        console.log(`DevDocAI v${packageJson.version}`);
    }
}
exports.CLI = CLI;
// If this file is run directly, execute the CLI
if (require.main === module) {
    const cli = new CLI();
    const args = process.argv.slice(2);
    cli.executeCommand(args)
        .catch((error) => {
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map