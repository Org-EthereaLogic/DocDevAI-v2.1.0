"use strict";
/**
 * @fileoverview Logger interface definitions and types
 * @module ILogger
 * @description Defines the contract for logging functionality throughout the application.
 *              Supports different log levels, multiple output destinations, and contextual logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDestination = exports.LogLevel = void 0;
exports.isValidLogLevel = isValidLogLevel;
exports.isValidLogDestination = isValidLogDestination;
exports.isValidLogFormat = isValidLogFormat;
exports.isError = isError;
exports.isValidMetadata = isValidMetadata;
exports.getLogLevelName = getLogLevelName;
exports.parseLogLevel = parseLogLevel;
exports.sanitizeMetadata = sanitizeMetadata;
/**
 * Enumeration of available log levels
 * @enum {number}
 */
var LogLevel;
(function (LogLevel) {
    /** Most detailed logging level for debugging purposes */
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    /** Informational messages about application state */
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    /** Warning messages for potentially harmful situations */
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    /** Error messages for error events */
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    /** Fatal messages for severe errors causing premature termination */
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Available destinations for log output
 * @enum {string}
 */
var LogDestination;
(function (LogDestination) {
    /** Output to console (stdout/stderr) */
    LogDestination["CONSOLE"] = "console";
    /** Output to file */
    LogDestination["FILE"] = "file";
    /** Output to remote logging service (future enhancement) */
    LogDestination["REMOTE"] = "remote";
})(LogDestination || (exports.LogDestination = LogDestination = {}));
/**
 * Type guard to check if a value is a valid LogLevel
 * @param value - Value to check
 * @returns True if value is a valid LogLevel
 */
function isValidLogLevel(value) {
    return typeof value === 'number' && Object.values(LogLevel).includes(value);
}
/**
 * Type guard to check if a value is a valid LogDestination
 * @param value - Value to check
 * @returns True if value is a valid LogDestination
 */
function isValidLogDestination(value) {
    return typeof value === 'string' && Object.values(LogDestination).includes(value);
}
/**
 * Type guard to check if a value is a valid LogFormat
 * @param value - Value to check
 * @returns True if value is a valid LogFormat
 */
function isValidLogFormat(value) {
    return value === 'text' || value === 'json';
}
/**
 * Type guard to check if a value is an Error object
 * @param value - Value to check
 * @returns True if value is an Error
 */
function isError(value) {
    return value instanceof Error ||
        (typeof value === 'object' &&
            value !== null &&
            'message' in value &&
            'name' in value);
}
/**
 * Type guard to check if metadata is valid
 * @param value - Value to check
 * @returns True if value is valid metadata
 */
function isValidMetadata(value) {
    return typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value);
}
/**
 * Utility function to get log level name from enum value
 * @param level - The log level enum value
 * @returns The string representation of the log level
 */
function getLogLevelName(level) {
    return LogLevel[level];
}
/**
 * Utility function to parse log level from string
 * @param levelStr - String representation of log level
 * @returns The LogLevel enum value or undefined if invalid
 */
function parseLogLevel(levelStr) {
    if (typeof levelStr !== 'string') {
        return undefined;
    }
    const upperStr = levelStr.toUpperCase();
    const level = LogLevel[upperStr];
    return isValidLogLevel(level) ? level : undefined;
}
/**
 * Sanitizes metadata to ensure type safety
 * @param metadata - Raw metadata
 * @returns Sanitized metadata
 */
function sanitizeMetadata(metadata) {
    if (!isValidMetadata(metadata)) {
        return {};
    }
    // Remove undefined values and ensure type safety
    return Object.entries(metadata).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
//# sourceMappingURL=ILogger.js.map