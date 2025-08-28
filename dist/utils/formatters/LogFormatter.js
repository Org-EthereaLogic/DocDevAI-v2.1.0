"use strict";
/**
 * @fileoverview Log formatting strategies implementing the Strategy pattern
 * @module LogFormatter
 * @description Provides formatting strategies for log entries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFormatterFactory = exports.JsonLogFormatter = exports.TextLogFormatter = exports.LogFormatter = void 0;
/**
 * Abstract base class for log formatters
 * @abstract
 */
class LogFormatter {
    /**
     * Filters undefined values from metadata
     * @protected
     * @param metadata - The metadata object
     * @returns Filtered metadata
     */
    filterMetadata(metadata) {
        if (!metadata)
            return {};
        return Object.entries(metadata)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
}
exports.LogFormatter = LogFormatter;
/**
 * Text formatter for human-readable log output
 */
class TextLogFormatter extends LogFormatter {
    /**
     * Formats a log entry as plain text
     * @param entry - The log entry to format
     * @returns Formatted text string
     */
    format(entry) {
        const parts = this.buildLogParts(entry);
        const metadataStr = this.formatMetadata(entry.metadata);
        if (metadataStr) {
            parts.push(`| ${metadataStr}`);
        }
        return parts.join(' ');
    }
    /**
     * Builds the main parts of the log message
     * @private
     * @param entry - The log entry
     * @returns Array of log parts
     */
    buildLogParts(entry) {
        return [
            `[${entry.timestamp}]`,
            entry.context ? `[${entry.context}]` : '',
            `[${entry.level}]`,
            entry.message
        ].filter(Boolean);
    }
    /**
     * Formats metadata into a string representation
     * @private
     * @param metadata - The metadata to format
     * @returns Formatted metadata string
     */
    formatMetadata(metadata) {
        const filtered = this.filterMetadata(metadata);
        if (Object.keys(filtered).length === 0) {
            return '';
        }
        return Object.entries(filtered)
            .map(([key, value]) => this.formatMetadataEntry(key, value))
            .join(' ');
    }
    /**
     * Formats a single metadata entry
     * @private
     * @param key - The metadata key
     * @param value - The metadata value
     * @returns Formatted entry string
     */
    formatMetadataEntry(key, value) {
        if (value === null) {
            return `${key}=null`;
        }
        if (typeof value === 'object') {
            return this.formatObjectValue(key, value);
        }
        return `${key}=${value}`;
    }
    /**
     * Formats object values with circular reference handling
     * @private
     * @param key - The metadata key
     * @param value - The object value
     * @returns Formatted object string
     */
    formatObjectValue(key, value) {
        try {
            return `${key}=${JSON.stringify(value)}`;
        }
        catch {
            return `${key}=[circular]`;
        }
    }
}
exports.TextLogFormatter = TextLogFormatter;
/**
 * JSON formatter for machine-readable log output
 */
class JsonLogFormatter extends LogFormatter {
    constructor() {
        super();
        this.fallbackFormatter = new TextLogFormatter();
    }
    /**
     * Formats a log entry as JSON
     * @param entry - The log entry to format
     * @returns JSON string
     */
    format(entry) {
        try {
            const filtered = this.filterEntry(entry);
            return JSON.stringify(filtered, this.createCircularReplacer());
        }
        catch (error) {
            // Fallback to text format if JSON serialization fails
            return this.fallbackFormatter.format(entry);
        }
    }
    /**
     * Filters an entry to remove undefined values
     * @private
     * @param entry - The log entry
     * @returns Filtered entry
     */
    filterEntry(entry) {
        const filtered = {
            timestamp: entry.timestamp,
            level: entry.level,
            message: entry.message
        };
        if (entry.context)
            filtered.context = entry.context;
        if (entry.metadata)
            filtered.metadata = this.filterMetadata(entry.metadata);
        if (entry.stackTrace)
            filtered.stackTrace = entry.stackTrace;
        if (entry.pid !== undefined)
            filtered.pid = entry.pid;
        if (entry.hostname)
            filtered.hostname = entry.hostname;
        return filtered;
    }
    /**
     * Creates a replacer function for handling circular references
     * @private
     * @returns Replacer function
     */
    createCircularReplacer() {
        const seen = new WeakSet();
        return (_key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        };
    }
}
exports.JsonLogFormatter = JsonLogFormatter;
/**
 * Factory for creating log formatters
 */
class LogFormatterFactory {
    /**
     * Gets a formatter by format type
     * @param format - The format type
     * @returns The formatter instance
     */
    static getFormatter(format) {
        return this.formatters.get(format) || this.formatters.get('text');
    }
    /**
     * Registers a custom formatter
     * @param format - The format identifier
     * @param formatter - The formatter instance
     */
    static registerFormatter(format, formatter) {
        this.formatters.set(format, formatter);
    }
}
exports.LogFormatterFactory = LogFormatterFactory;
LogFormatterFactory.formatters = new Map([
    ['text', new TextLogFormatter()],
    ['json', new JsonLogFormatter()]
]);
//# sourceMappingURL=LogFormatter.js.map