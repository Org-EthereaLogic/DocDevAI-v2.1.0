/**
 * @fileoverview Log destination handlers implementing the Strategy pattern
 * @module LogDestinationHandler
 * @description Provides different strategies for writing log entries to various destinations
 */
import { LogLevel } from '../../interfaces/ILogger';
/**
 * Abstract base class for log destination handlers
 * @abstract
 */
export declare abstract class LogDestinationHandler {
    /**
     * Writes a formatted log message to the destination
     * @param message - The formatted log message
     * @param level - The log level
     * @abstract
     */
    abstract write(message: string, level: LogLevel): void;
    /**
     * Flushes any buffered data
     */
    flush(): void;
    /**
     * Closes the destination handler
     */
    close(): void;
}
/**
 * Console destination handler
 */
export declare class ConsoleDestinationHandler extends LogDestinationHandler {
    /**
     * Writes a log message to the appropriate console method
     * @param message - The formatted log message
     * @param level - The log level
     */
    write(message: string, level: LogLevel): void;
}
/**
 * File rotation manager
 */
export declare class FileRotationManager {
    private readonly filePath;
    private readonly maxFileSize;
    private readonly maxFiles;
    constructor(filePath: string, maxFileSize: number, maxFiles: number);
    /**
     * Checks if file rotation is needed and performs it
     */
    checkAndRotate(): void;
    /**
     * Determines if rotation is needed
     * @private
     * @returns True if rotation is needed
     */
    private shouldRotate;
    /**
     * Performs file rotation
     * @private
     */
    private rotate;
    /**
     * Generates a path for the rotated file
     * @private
     * @returns The rotated file path
     */
    private generateRotatedPath;
    /**
     * Removes old rotated files beyond the maximum count
     * @private
     */
    private cleanupOldFiles;
    /**
     * Finds all rotated log files
     * @private
     * @returns Array of rotated files sorted by modification time
     */
    private findRotatedFiles;
    /**
     * Checks if a file is a rotated log file
     * @private
     */
    private isRotatedFile;
    /**
     * Gets file information
     * @private
     */
    private getFileInfo;
}
/**
 * File destination handler with buffering and rotation support
 */
export declare class FileDestinationHandler extends LogDestinationHandler {
    private readonly filePath;
    private readonly bufferSize;
    private buffer;
    private rotationManager?;
    constructor(filePath: string, bufferSize?: number, maxFileSize?: number, maxFiles?: number);
    /**
     * Ensures the log directory exists
     * @private
     */
    private ensureDirectoryExists;
    /**
     * Writes a log message to file
     * @param message - The formatted log message
     */
    write(message: string): void;
    /**
     * Writes to buffer for batch processing
     * @private
     * @param message - The log message
     */
    private writeBuffered;
    /**
     * Writes immediately to file
     * @private
     * @param message - The log message
     */
    private writeImmediate;
    /**
     * Handles write errors
     * @private
     * @param error - The error that occurred
     * @param message - The message that failed to write
     */
    private handleWriteError;
    /**
     * Flushes buffered messages to file
     */
    flush(): void;
    /**
     * Closes the handler and flushes remaining data
     */
    close(): void;
}
/**
 * Factory for creating destination handlers
 */
export declare class DestinationHandlerFactory {
    private static handlers;
    /**
     * Creates a destination handler
     * @param type - The destination type
     * @param config - Configuration for the handler
     * @returns The destination handler
     */
    static createHandler(type: string, config?: any): LogDestinationHandler;
    /**
     * Registers a custom handler factory
     * @param type - The destination type
     * @param factory - Factory function for creating the handler
     */
    static registerHandler(type: string, factory: () => LogDestinationHandler): void;
}
//# sourceMappingURL=LogDestinationHandler.d.ts.map