"use strict";
/**
 * @fileoverview Log destination handlers implementing the Strategy pattern
 * @module LogDestinationHandler
 * @description Provides different strategies for writing log entries to various destinations
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
exports.DestinationHandlerFactory = exports.FileDestinationHandler = exports.FileRotationManager = exports.ConsoleDestinationHandler = exports.LogDestinationHandler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ILogger_1 = require("../../interfaces/ILogger");
/**
 * Abstract base class for log destination handlers
 * @abstract
 */
class LogDestinationHandler {
    /**
     * Flushes any buffered data
     */
    flush() {
        // Default implementation does nothing
    }
    /**
     * Closes the destination handler
     */
    close() {
        // Default implementation does nothing
    }
}
exports.LogDestinationHandler = LogDestinationHandler;
/**
 * Console destination handler
 */
class ConsoleDestinationHandler extends LogDestinationHandler {
    /**
     * Writes a log message to the appropriate console method
     * @param message - The formatted log message
     * @param level - The log level
     */
    write(message, level) {
        const output = message.trimEnd();
        if (level <= ILogger_1.LogLevel.INFO) {
            console.log(output);
        }
        else if (level === ILogger_1.LogLevel.WARN) {
            console.warn(output);
        }
        else {
            console.error(output);
        }
    }
}
exports.ConsoleDestinationHandler = ConsoleDestinationHandler;
/**
 * File rotation manager
 */
class FileRotationManager {
    constructor(filePath, maxFileSize, maxFiles) {
        this.filePath = filePath;
        this.maxFileSize = maxFileSize;
        this.maxFiles = maxFiles;
    }
    /**
     * Checks if file rotation is needed and performs it
     */
    checkAndRotate() {
        if (!this.shouldRotate()) {
            return;
        }
        this.rotate();
    }
    /**
     * Determines if rotation is needed
     * @private
     * @returns True if rotation is needed
     */
    shouldRotate() {
        try {
            const stats = fs.statSync(this.filePath);
            return stats.size >= this.maxFileSize;
        }
        catch {
            // File doesn't exist yet
            return false;
        }
    }
    /**
     * Performs file rotation
     * @private
     */
    rotate() {
        const rotatedPath = this.generateRotatedPath();
        fs.renameSync(this.filePath, rotatedPath);
        this.cleanupOldFiles();
    }
    /**
     * Generates a path for the rotated file
     * @private
     * @returns The rotated file path
     */
    generateRotatedPath() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const ext = path.extname(this.filePath);
        const base = path.basename(this.filePath, ext);
        const dir = path.dirname(this.filePath);
        return path.join(dir, `${base}-${timestamp}${ext}`);
    }
    /**
     * Removes old rotated files beyond the maximum count
     * @private
     */
    cleanupOldFiles() {
        const rotatedFiles = this.findRotatedFiles();
        const filesToDelete = rotatedFiles.slice(this.maxFiles - 1);
        filesToDelete.forEach(file => fs.unlinkSync(file.path));
    }
    /**
     * Finds all rotated log files
     * @private
     * @returns Array of rotated files sorted by modification time
     */
    findRotatedFiles() {
        const dir = path.dirname(this.filePath);
        const ext = path.extname(this.filePath);
        const base = path.basename(this.filePath, ext);
        const currentFile = path.basename(this.filePath);
        return fs.readdirSync(dir)
            .filter(f => this.isRotatedFile(f, base, ext, currentFile))
            .map(f => this.getFileInfo(dir, f))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    }
    /**
     * Checks if a file is a rotated log file
     * @private
     */
    isRotatedFile(filename, base, ext, currentFile) {
        return filename.startsWith(base) &&
            filename.endsWith(ext) &&
            filename !== currentFile;
    }
    /**
     * Gets file information
     * @private
     */
    getFileInfo(dir, filename) {
        const filePath = path.join(dir, filename);
        const stats = fs.statSync(filePath);
        return {
            path: filePath,
            mtime: stats.mtime
        };
    }
}
exports.FileRotationManager = FileRotationManager;
/**
 * File destination handler with buffering and rotation support
 */
class FileDestinationHandler extends LogDestinationHandler {
    constructor(filePath, bufferSize = 0, maxFileSize, maxFiles) {
        super();
        this.filePath = filePath;
        this.bufferSize = bufferSize;
        this.buffer = [];
        this.ensureDirectoryExists();
        if (maxFileSize && maxFiles) {
            this.rotationManager = new FileRotationManager(filePath, maxFileSize, maxFiles);
        }
    }
    /**
     * Ensures the log directory exists
     * @private
     */
    ensureDirectoryExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    /**
     * Writes a log message to file
     * @param message - The formatted log message
     */
    write(message) {
        if (this.bufferSize > 0) {
            this.writeBuffered(message);
        }
        else {
            this.writeImmediate(message);
        }
    }
    /**
     * Writes to buffer for batch processing
     * @private
     * @param message - The log message
     */
    writeBuffered(message) {
        this.buffer.push(message);
        if (this.buffer.length >= this.bufferSize) {
            this.flush();
        }
    }
    /**
     * Writes immediately to file
     * @private
     * @param message - The log message
     */
    writeImmediate(message) {
        try {
            this.rotationManager?.checkAndRotate();
            fs.appendFileSync(this.filePath, message, 'utf-8');
        }
        catch (error) {
            this.handleWriteError(error, message);
        }
    }
    /**
     * Handles write errors
     * @private
     * @param error - The error that occurred
     * @param message - The message that failed to write
     */
    handleWriteError(error, message) {
        console.error(`Failed to write to log file: ${error}`);
        // Fallback to console
        console.log(message.trimEnd());
    }
    /**
     * Flushes buffered messages to file
     */
    flush() {
        if (this.buffer.length === 0) {
            return;
        }
        const content = this.buffer.join('');
        this.buffer = [];
        try {
            this.rotationManager?.checkAndRotate();
            fs.appendFileSync(this.filePath, content, 'utf-8');
        }
        catch (error) {
            this.handleWriteError(error, content);
        }
    }
    /**
     * Closes the handler and flushes remaining data
     */
    close() {
        this.flush();
    }
}
exports.FileDestinationHandler = FileDestinationHandler;
/**
 * Factory for creating destination handlers
 */
class DestinationHandlerFactory {
    /**
     * Creates a destination handler
     * @param type - The destination type
     * @param config - Configuration for the handler
     * @returns The destination handler
     */
    static createHandler(type, config) {
        if (type === 'file' && config?.filePath) {
            return new FileDestinationHandler(config.filePath, config.bufferSize || 0, config.maxFileSize, config.maxFiles);
        }
        const factory = this.handlers.get(type);
        if (!factory) {
            throw new Error(`Unknown destination type: ${type}`);
        }
        return factory();
    }
    /**
     * Registers a custom handler factory
     * @param type - The destination type
     * @param factory - Factory function for creating the handler
     */
    static registerHandler(type, factory) {
        this.handlers.set(type, factory);
    }
}
exports.DestinationHandlerFactory = DestinationHandlerFactory;
DestinationHandlerFactory.handlers = new Map([
    ['console', () => new ConsoleDestinationHandler()]
]);
//# sourceMappingURL=LogDestinationHandler.js.map