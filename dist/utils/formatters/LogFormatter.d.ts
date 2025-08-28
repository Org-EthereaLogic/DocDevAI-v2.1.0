/**
 * @fileoverview Log formatting strategies implementing the Strategy pattern
 * @module LogFormatter
 * @description Provides formatting strategies for log entries
 */
import { LogEntry } from '../../interfaces/ILogger';
/**
 * Abstract base class for log formatters
 * @abstract
 */
export declare abstract class LogFormatter {
    /**
     * Formats a log entry
     * @param entry - The log entry to format
     * @returns Formatted string
     */
    abstract format(entry: LogEntry): string;
    /**
     * Filters undefined values from metadata
     * @protected
     * @param metadata - The metadata object
     * @returns Filtered metadata
     */
    protected filterMetadata(metadata?: Record<string, any>): Record<string, any>;
}
/**
 * Text formatter for human-readable log output
 */
export declare class TextLogFormatter extends LogFormatter {
    /**
     * Formats a log entry as plain text
     * @param entry - The log entry to format
     * @returns Formatted text string
     */
    format(entry: LogEntry): string;
    /**
     * Builds the main parts of the log message
     * @private
     * @param entry - The log entry
     * @returns Array of log parts
     */
    private buildLogParts;
    /**
     * Formats metadata into a string representation
     * @private
     * @param metadata - The metadata to format
     * @returns Formatted metadata string
     */
    private formatMetadata;
    /**
     * Formats a single metadata entry
     * @private
     * @param key - The metadata key
     * @param value - The metadata value
     * @returns Formatted entry string
     */
    private formatMetadataEntry;
    /**
     * Formats object values with circular reference handling
     * @private
     * @param key - The metadata key
     * @param value - The object value
     * @returns Formatted object string
     */
    private formatObjectValue;
}
/**
 * JSON formatter for machine-readable log output
 */
export declare class JsonLogFormatter extends LogFormatter {
    private readonly fallbackFormatter;
    constructor();
    /**
     * Formats a log entry as JSON
     * @param entry - The log entry to format
     * @returns JSON string
     */
    format(entry: LogEntry): string;
    /**
     * Filters an entry to remove undefined values
     * @private
     * @param entry - The log entry
     * @returns Filtered entry
     */
    private filterEntry;
    /**
     * Creates a replacer function for handling circular references
     * @private
     * @returns Replacer function
     */
    private createCircularReplacer;
}
/**
 * Factory for creating log formatters
 */
export declare class LogFormatterFactory {
    private static formatters;
    /**
     * Gets a formatter by format type
     * @param format - The format type
     * @returns The formatter instance
     */
    static getFormatter(format: string): LogFormatter;
    /**
     * Registers a custom formatter
     * @param format - The format identifier
     * @param formatter - The formatter instance
     */
    static registerFormatter(format: string, formatter: LogFormatter): void;
}
//# sourceMappingURL=LogFormatter.d.ts.map