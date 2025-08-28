#!/usr/bin/env node
/**
 * Interface for parsed command structure
 */
interface ParsedCommand {
    command: string;
    args: string[];
    options: Record<string, string>;
}
/**
 * CLI class for DevDocAI - provides command-line interface for document generation
 * Supports generating documents and listing available templates
 */
export declare class CLI {
    private documentGenerator;
    constructor();
    /**
     * Parse command line arguments into structured format
     * @param args - Command line arguments
     * @returns Parsed command structure
     */
    parseCommand(args: string[]): ParsedCommand;
    /**
     * Execute a command with given arguments
     * @param args - Command line arguments to execute
     */
    executeCommand(args: string[]): Promise<void>;
    /**
     * Handle the generate command
     * @param args - Command arguments
     * @param options - Command options
     */
    private handleGenerateCommand;
    /**
     * Handle the list command
     */
    private handleListCommand;
    /**
     * Handle unknown commands with suggestions
     * @param command - The unknown command
     */
    private handleUnknownCommand;
    /**
     * Display help information
     */
    private showHelp;
    /**
     * Display version information
     */
    private showVersion;
}
export {};
