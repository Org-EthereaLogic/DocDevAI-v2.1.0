/**
 * @fileoverview Logger interface definitions and types
 * @module ILogger
 * @description Defines the contract for logging functionality throughout the application.
 *              Supports different log levels, multiple output destinations, and contextual logging.
 */
/**
 * Enumeration of available log levels
 * @enum {number}
 */
export declare enum LogLevel {
    /** Most detailed logging level for debugging purposes */
    DEBUG = 0,
    /** Informational messages about application state */
    INFO = 1,
    /** Warning messages for potentially harmful situations */
    WARN = 2,
    /** Error messages for error events */
    ERROR = 3,
    /** Fatal messages for severe errors causing premature termination */
    FATAL = 4
}
/**
 * Available destinations for log output
 * @enum {string}
 */
export declare enum LogDestination {
    /** Output to console (stdout/stderr) */
    CONSOLE = "console",
    /** Output to file */
    FILE = "file",
    /** Output to remote logging service (future enhancement) */
    REMOTE = "remote"
}
/**
 * Log format types
 * @enum {string}
 */
export type LogFormat = 'text' | 'json';
/**
 * Configuration options for the logger
 * @interface LoggerConfig
 */
export interface LoggerConfig {
    /** Minimum log level to output */
    level?: LogLevel;
    /** Array of destinations where logs should be sent */
    destinations?: LogDestination[];
    /** File path for file-based logging */
    filePath?: string;
    /** Maximum file size in bytes before rotation (default: 10MB) */
    maxFileSize?: number;
    /** Number of rotated files to keep (default: 5) */
    maxFiles?: number;
    /** Context string to include with all log messages */
    context?: string;
    /** Format for log output */
    format?: LogFormat;
    /** Buffer size for batching file writes (default: 0 - no buffering) */
    bufferSize?: number;
    /** Whether to include stack traces for errors */
    includeStackTrace?: boolean;
    /** Custom metadata to include with every log entry */
    defaultMetadata?: Record<string, unknown>;
}
/**
 * Required configuration with all optional fields filled
 * @interface RequiredLoggerConfig
 */
export type RequiredLoggerConfig = Required<LoggerConfig>;
/**
 * Structure of a log entry
 * @interface LogEntry
 */
export interface LogEntry {
    /** ISO 8601 timestamp */
    timestamp: string;
    /** Log level as string */
    level: string;
    /** Log message */
    message: string;
    /** Optional context identifier */
    context?: string;
    /** Optional metadata associated with the log */
    metadata?: Record<string, unknown>;
    /** Stack trace for errors */
    stackTrace?: string;
    /** Process ID */
    pid?: number;
    /** Hostname */
    hostname?: string;
}
/**
 * Serialized error object
 * @interface SerializedError
 */
export interface SerializedError {
    /** Error message */
    message: string;
    /** Error name/type */
    name: string;
    /** Stack trace */
    stack?: string;
    /** Additional error properties */
    [key: string]: unknown;
}
/**
 * Metadata type for log entries
 */
export type LogMetadata = Record<string, unknown>;
/**
 * Logger interface defining the contract for logging implementations
 * @interface ILogger
 */
export interface ILogger {
    /**
     * Logs a debug level message
     * @param message - The message to log
     * @param metadata - Optional metadata to include
     */
    debug(message: string, metadata?: LogMetadata): void;
    /**
     * Logs an info level message
     * @param message - The message to log
     * @param metadata - Optional metadata to include
     */
    info(message: string, metadata?: LogMetadata): void;
    /**
     * Logs a warning level message
     * @param message - The message to log
     * @param metadata - Optional metadata to include
     */
    warn(message: string, metadata?: LogMetadata): void;
    /**
     * Logs an error level message
     * @param message - The message to log
     * @param metadata - Optional metadata to include
     */
    error(message: string, metadata?: LogMetadata): void;
    /**
     * Logs a fatal level message
     * @param message - The message to log
     * @param metadata - Optional metadata to include
     */
    fatal(message: string, metadata?: LogMetadata): void;
    /**
     * Creates a child logger with additional context
     * @param context - Additional context for the child logger
     * @returns A new logger instance with combined context
     */
    child(context: string): ILogger;
    /**
     * Dynamically updates the log level
     * @param level - The new log level
     */
    setLevel(level: LogLevel): void;
    /**
     * Dynamically updates the log destinations
     * @param destinations - Array of new destinations
     * @param filePath - Optional file path if FILE destination is included
     */
    setDestinations(destinations: LogDestination[], filePath?: string): void;
    /**
     * Gets the current logger configuration
     * @returns The current configuration
     */
    getConfig(): LoggerConfig;
    /**
     * Flushes any buffered logs to their destinations
     */
    flush(): void;
}
/**
 * Factory function type for creating logger instances
 * @type LoggerFactory
 */
export type LoggerFactory = (config?: LoggerConfig) => ILogger;
/**
 * Type guard to check if a value is a valid LogLevel
 * @param value - Value to check
 * @returns True if value is a valid LogLevel
 */
export declare function isValidLogLevel(value: unknown): value is LogLevel;
/**
 * Type guard to check if a value is a valid LogDestination
 * @param value - Value to check
 * @returns True if value is a valid LogDestination
 */
export declare function isValidLogDestination(value: unknown): value is LogDestination;
/**
 * Type guard to check if a value is a valid LogFormat
 * @param value - Value to check
 * @returns True if value is a valid LogFormat
 */
export declare function isValidLogFormat(value: unknown): value is LogFormat;
/**
 * Type guard to check if a value is an Error object
 * @param value - Value to check
 * @returns True if value is an Error
 */
export declare function isError(value: unknown): value is Error;
/**
 * Type guard to check if metadata is valid
 * @param value - Value to check
 * @returns True if value is valid metadata
 */
export declare function isValidMetadata(value: unknown): value is LogMetadata;
/**
 * Utility function to get log level name from enum value
 * @param level - The log level enum value
 * @returns The string representation of the log level
 */
export declare function getLogLevelName(level: LogLevel): string;
/**
 * Utility function to parse log level from string
 * @param levelStr - String representation of log level
 * @returns The LogLevel enum value or undefined if invalid
 */
export declare function parseLogLevel(levelStr: string): LogLevel | undefined;
/**
 * Sanitizes metadata to ensure type safety
 * @param metadata - Raw metadata
 * @returns Sanitized metadata
 */
export declare function sanitizeMetadata(metadata: unknown): LogMetadata;
//# sourceMappingURL=ILogger.d.ts.map