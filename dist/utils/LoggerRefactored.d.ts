/**
 * @fileoverview Refactored Logger implementation with improved architecture
 * @module LoggerRefactored
 * @description Clean, maintainable logger implementation following SOLID principles
 */
import { ILogger, LogLevel, LogDestination, LoggerConfig } from '../interfaces/ILogger';
/**
 * Refactored Logger implementation with improved architecture
 * @class LoggerRefactored
 * @implements {ILogger}
 */
export declare class LoggerRefactored implements ILogger {
    private static instance;
    private config;
    private readonly entryBuilder;
    private readonly destinationManager;
    private formatter;
    /**
     * Creates a new Logger instance
     * @param config - Optional configuration for the logger
     */
    constructor(config?: LoggerConfig);
    /**
     * Initializes the logger
     * @private
     */
    private initialize;
    /**
     * Gets or creates the singleton logger instance
     * @param config - Optional configuration for the singleton instance
     * @returns The logger instance
     */
    static getInstance(config?: LoggerConfig): LoggerRefactored;
    /**
     * Updates logger configuration
     * @private
     * @param config - New configuration values
     */
    private updateConfig;
    /**
     * Determines if a message should be logged based on current level
     * @private
     * @param level - The level of the message
     * @returns True if the message should be logged
     */
    private shouldLog;
    /**
     * Internal logging method
     * @private
     * @param level - Log level
     * @param message - Log message
     * @param metadata - Optional metadata
     */
    private log;
    debug(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    error(message: string, metadata?: Record<string, any>): void;
    fatal(message: string, metadata?: Record<string, any>): void;
    child(context: string): ILogger;
    setLevel(level: LogLevel): void;
    setDestinations(destinations: LogDestination[], filePath?: string): void;
    getConfig(): LoggerConfig;
    flush(): void;
}
/**
 * Factory function for creating logger instances
 */
export declare function createLogger(config?: LoggerConfig): ILogger;
/**
 * Default logger instance for convenience
 */
export declare const defaultLogger: LoggerRefactored;
//# sourceMappingURL=LoggerRefactored.d.ts.map