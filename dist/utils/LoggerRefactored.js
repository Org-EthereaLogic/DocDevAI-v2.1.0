"use strict";
/**
 * @fileoverview Refactored Logger implementation with improved architecture
 * @module LoggerRefactored
 * @description Clean, maintainable logger implementation following SOLID principles
 */
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
exports.defaultLogger = exports.LoggerRefactored = void 0;
exports.createLogger = createLogger;
const os = __importStar(require("os"));
const ILogger_1 = require("../interfaces/ILogger");
const LogFormatter_1 = require("./formatters/LogFormatter");
const LogDestinationHandler_1 = require("./destinations/LogDestinationHandler");
/**
 * Default logger configuration
 */
const DEFAULT_CONFIG = {
    level: ILogger_1.LogLevel.INFO,
    destinations: [ILogger_1.LogDestination.CONSOLE],
    filePath: '',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    context: '',
    format: 'text',
    bufferSize: 0,
    includeStackTrace: true,
    defaultMetadata: {}
};
/**
 * Configuration validator for logger settings
 */
class LoggerConfigValidator {
    /**
     * Validates logger configuration
     * @param config - The configuration to validate
     * @throws {Error} If configuration is invalid
     */
    static validate(config) {
        this.validateFileDestination(config);
    }
    /**
     * Validates file destination configuration
     * @private
     */
    static validateFileDestination(config) {
        if (config.destinations.includes(ILogger_1.LogDestination.FILE) && !config.filePath) {
            throw new Error('File path must be provided when FILE destination is used');
        }
    }
}
/**
 * Log entry builder for creating structured log entries
 */
class LogEntryBuilder {
    constructor() {
        this.hostname = os.hostname();
        this.pid = process.pid;
    }
    /**
     * Builds a log entry
     * @param level - Log level
     * @param message - Log message
     * @param config - Logger configuration
     * @param metadata - Optional metadata
     * @returns The constructed log entry
     */
    build(level, message, config, metadata) {
        const entry = this.createBaseEntry(level, message, config);
        if (metadata) {
            this.enrichWithMetadata(entry, metadata, config);
        }
        return entry;
    }
    /**
     * Creates the base log entry
     * @private
     */
    createBaseEntry(level, message, config) {
        return {
            timestamp: new Date().toISOString(),
            level: (0, ILogger_1.getLogLevelName)(level),
            message,
            context: config.context,
            metadata: { ...config.defaultMetadata },
            pid: this.pid,
            hostname: this.hostname
        };
    }
    /**
     * Enriches entry with metadata and error information
     * @private
     */
    enrichWithMetadata(entry, metadata, config) {
        entry.metadata = { ...entry.metadata, ...metadata };
        if (this.shouldIncludeStackTrace(entry, config)) {
            this.addStackTrace(entry, metadata);
        }
    }
    /**
     * Determines if stack trace should be included
     * @private
     */
    shouldIncludeStackTrace(entry, config) {
        return config.includeStackTrace &&
            entry.level !== 'DEBUG' &&
            entry.level !== 'INFO';
    }
    /**
     * Adds stack trace from error object
     * @private
     */
    addStackTrace(entry, metadata) {
        if (!metadata.error)
            return;
        if (metadata.error instanceof Error) {
            entry.stackTrace = metadata.error.stack;
            entry.metadata.error = {
                message: metadata.error.message,
                name: metadata.error.name,
                stack: metadata.error.stack
            };
        }
    }
}
/**
 * Manages log destination handlers
 */
class DestinationManager {
    constructor() {
        this.handlers = new Map();
    }
    /**
     * Updates destination handlers based on configuration
     * @param destinations - Array of destinations
     * @param config - Logger configuration
     */
    updateDestinations(destinations, config) {
        this.closeOldHandlers(destinations);
        this.createNewHandlers(destinations, config);
    }
    /**
     * Closes handlers that are no longer needed
     * @private
     */
    closeOldHandlers(newDestinations) {
        const newSet = new Set(newDestinations);
        this.handlers.forEach((handler, key) => {
            if (!newSet.has(key)) {
                handler.close();
                this.handlers.delete(key);
            }
        });
    }
    /**
     * Creates new handlers for destinations
     * @private
     */
    createNewHandlers(destinations, config) {
        destinations.forEach(destination => {
            if (!this.handlers.has(destination)) {
                const handler = this.createHandler(destination, config);
                this.handlers.set(destination, handler);
            }
        });
    }
    /**
     * Creates a handler for a destination
     * @private
     */
    createHandler(destination, config) {
        return LogDestinationHandler_1.DestinationHandlerFactory.createHandler(destination, {
            filePath: config.filePath,
            bufferSize: config.bufferSize,
            maxFileSize: config.maxFileSize,
            maxFiles: config.maxFiles
        });
    }
    /**
     * Writes a log entry to all handlers
     * @param message - Formatted message
     * @param level - Log level
     */
    write(message, level) {
        this.handlers.forEach(handler => {
            handler.write(message + '\n', level);
        });
    }
    /**
     * Flushes all handlers
     */
    flush() {
        this.handlers.forEach(handler => handler.flush());
    }
    /**
     * Closes all handlers
     */
    close() {
        this.handlers.forEach(handler => handler.close());
        this.handlers.clear();
    }
}
/**
 * Refactored Logger implementation with improved architecture
 * @class LoggerRefactored
 * @implements {ILogger}
 */
class LoggerRefactored {
    /**
     * Creates a new Logger instance
     * @param config - Optional configuration for the logger
     */
    constructor(config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.entryBuilder = new LogEntryBuilder();
        this.destinationManager = new DestinationManager();
        this.formatter = LogFormatter_1.LogFormatterFactory.getFormatter(this.config.format);
        this.initialize();
    }
    /**
     * Initializes the logger
     * @private
     */
    initialize() {
        LoggerConfigValidator.validate(this.config);
        this.destinationManager.updateDestinations(this.config.destinations, this.config);
    }
    /**
     * Gets or creates the singleton logger instance
     * @param config - Optional configuration for the singleton instance
     * @returns The logger instance
     */
    static getInstance(config) {
        if (!LoggerRefactored.instance) {
            LoggerRefactored.instance = new LoggerRefactored(config);
        }
        else if (config) {
            LoggerRefactored.instance.updateConfig(config);
        }
        return LoggerRefactored.instance;
    }
    /**
     * Updates logger configuration
     * @private
     * @param config - New configuration values
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.formatter = LogFormatter_1.LogFormatterFactory.getFormatter(this.config.format);
        this.initialize();
    }
    /**
     * Determines if a message should be logged based on current level
     * @private
     * @param level - The level of the message
     * @returns True if the message should be logged
     */
    shouldLog(level) {
        return level >= this.config.level;
    }
    /**
     * Internal logging method
     * @private
     * @param level - Log level
     * @param message - Log message
     * @param metadata - Optional metadata
     */
    log(level, message, metadata) {
        if (!this.shouldLog(level))
            return;
        const entry = this.entryBuilder.build(level, message, this.config, metadata);
        const formatted = this.formatter.format(entry);
        this.destinationManager.write(formatted, level);
    }
    // ILogger interface implementation
    debug(message, metadata) {
        this.log(ILogger_1.LogLevel.DEBUG, message, metadata);
    }
    info(message, metadata) {
        this.log(ILogger_1.LogLevel.INFO, message, metadata);
    }
    warn(message, metadata) {
        this.log(ILogger_1.LogLevel.WARN, message, metadata);
    }
    error(message, metadata) {
        this.log(ILogger_1.LogLevel.ERROR, message, metadata);
    }
    fatal(message, metadata) {
        this.log(ILogger_1.LogLevel.FATAL, message, metadata);
    }
    child(context) {
        const childContext = this.config.context
            ? `${this.config.context}:${context}`
            : context;
        return new LoggerRefactored({
            ...this.config,
            context: childContext
        });
    }
    setLevel(level) {
        this.config.level = level;
    }
    setDestinations(destinations, filePath) {
        if (filePath) {
            this.config.filePath = filePath;
        }
        this.config.destinations = destinations;
        this.initialize();
    }
    getConfig() {
        return { ...this.config };
    }
    flush() {
        this.destinationManager.flush();
    }
}
exports.LoggerRefactored = LoggerRefactored;
LoggerRefactored.instance = null;
/**
 * Factory function for creating logger instances
 */
function createLogger(config) {
    return new LoggerRefactored(config);
}
/**
 * Default logger instance for convenience
 */
exports.defaultLogger = LoggerRefactored.getInstance();
//# sourceMappingURL=LoggerRefactored.js.map