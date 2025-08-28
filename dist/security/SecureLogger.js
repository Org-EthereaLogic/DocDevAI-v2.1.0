"use strict";
/**
 * @fileoverview Secure Logger implementation with comprehensive security controls
 * @module SecureLogger
 * @description Production-ready logger with security hardening following OWASP guidelines
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
exports.SecureLogger = void 0;
exports.createSecureLogger = createSecureLogger;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const ILogger_1 = require("../interfaces/ILogger");
/**
 * Default security configuration
 */
const DEFAULT_SECURITY_CONFIG = {
    sanitizeInput: true,
    detectSensitiveData: true,
    enableRateLimit: true,
    maxLogsPerMinute: 1000,
    maxMessageSize: 10 * 1024, // 10KB
    maxMetadataSize: 5 * 1024, // 5KB
    enableSignatures: false,
    signatureKey: undefined,
    enableEncryption: false,
    encryptionKey: undefined,
    filePermissions: '0640', // rw-r----- (owner read/write, group read, others none)
    allowedPaths: ['./logs', '/var/log/app'],
    enableSecurityEvents: true,
    piiPatterns: [
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
        /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // Phone
        /\b(?:password|pwd|passwd|pass)[\s]*[:=][\s]*\S+/gi, // Passwords
        /\b(?:api[_-]?key|apikey|api[_-]?token)[\s]*[:=][\s]*\S+/gi, // API keys
        /\b(?:Bearer|Basic)\s+[A-Za-z0-9+/=]+\b/g, // Auth tokens
    ],
    sensitiveFields: [
        'password', 'pwd', 'passwd', 'pass',
        'token', 'apiKey', 'api_key', 'apiToken', 'api_token',
        'secret', 'secretKey', 'secret_key',
        'creditCard', 'credit_card', 'ccn',
        'ssn', 'socialSecurityNumber', 'social_security_number',
        'email', 'emailAddress', 'email_address',
        'phone', 'phoneNumber', 'phone_number',
        'dob', 'dateOfBirth', 'date_of_birth',
        'salary', 'compensation',
    ]
};
/**
 * Rate limiter for DoS protection
 */
class RateLimiter {
    constructor(maxPerMinute, windowMs = 60000) {
        this.maxPerMinute = maxPerMinute;
        this.windowMs = windowMs;
        this.counters = new Map();
    }
    /**
     * Checks if operation is allowed under rate limit
     * @param key - Rate limit key
     * @returns True if allowed, false if rate limited
     */
    isAllowed(key = 'global') {
        const now = Date.now();
        const counter = this.counters.get(key);
        if (!counter || now >= counter.resetTime) {
            this.counters.set(key, { count: 1, resetTime: now + this.windowMs });
            return true;
        }
        if (counter.count >= this.maxPerMinute) {
            return false;
        }
        counter.count++;
        return true;
    }
    /**
     * Cleans up expired counters
     */
    cleanup() {
        const now = Date.now();
        for (const [key, counter] of this.counters) {
            if (now >= counter.resetTime) {
                this.counters.delete(key);
            }
        }
    }
}
/**
 * Input sanitizer for preventing log injection
 */
class InputSanitizer {
    /**
     * Sanitizes input to prevent log injection
     * @param input - Input to sanitize
     * @param maxLength - Maximum allowed length
     * @returns Sanitized input
     */
    static sanitize(input, maxLength) {
        if (typeof input !== 'string') {
            return String(input);
        }
        // Truncate to max length
        let sanitized = input.substring(0, maxLength);
        // Remove dangerous control characters
        sanitized = sanitized.replace(this.DANGEROUS_CHARS, '');
        // Replace line breaks with safe representation
        sanitized = sanitized.replace(this.LINE_BREAKS, ' [LF] ');
        // Escape special characters
        sanitized = sanitized.replace(/\\/g, '\\\\');
        return sanitized;
    }
    /**
     * Sanitizes metadata object
     * @param metadata - Metadata to sanitize
     * @param maxSize - Maximum allowed size in bytes
     * @returns Sanitized metadata
     */
    static sanitizeMetadata(metadata, maxSize) {
        if (!metadata)
            return {};
        try {
            // Check size before processing
            const jsonStr = JSON.stringify(metadata);
            if (jsonStr.length > maxSize) {
                return { error: 'Metadata too large', truncated: true };
            }
            return this.sanitizeObject(metadata);
        }
        catch {
            return { error: 'Invalid metadata' };
        }
    }
    /**
     * Recursively sanitizes an object
     * @private
     */
    static sanitizeObject(obj, depth = 0) {
        if (depth > 10) {
            return '[Max depth exceeded]';
        }
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (typeof obj === 'string') {
            return this.sanitize(obj, 1000);
        }
        if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                return obj.map(item => this.sanitizeObject(item, depth + 1));
            }
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                const sanitizedKey = this.sanitize(key, 100);
                sanitized[sanitizedKey] = this.sanitizeObject(value, depth + 1);
            }
            return sanitized;
        }
        return obj;
    }
}
InputSanitizer.DANGEROUS_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
InputSanitizer.LINE_BREAKS = /[\r\n]+/g;
InputSanitizer.ESCAPE_SEQUENCES = /\\[nrtbfv\\'"]/g;
/**
 * Sensitive data detector and masker
 */
class SensitiveDataHandler {
    constructor(piiPatterns, sensitiveFields) {
        this.piiPatterns = piiPatterns;
        this.sensitiveFields = sensitiveFields;
    }
    /**
     * Masks sensitive data in a string
     * @param input - Input string
     * @returns Masked string
     */
    maskString(input) {
        let masked = input;
        // Apply PII pattern masking
        for (const pattern of this.piiPatterns) {
            masked = masked.replace(pattern, '[REDACTED]');
        }
        return masked;
    }
    /**
     * Masks sensitive fields in an object
     * @param obj - Object to mask
     * @returns Masked object
     */
    maskObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.maskObject(item));
        }
        const masked = {};
        for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase();
            // Check if field is sensitive
            if (this.sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
                masked[key] = '[REDACTED]';
            }
            else if (typeof value === 'string') {
                masked[key] = this.maskString(value);
            }
            else if (typeof value === 'object') {
                masked[key] = this.maskObject(value);
            }
            else {
                masked[key] = value;
            }
        }
        return masked;
    }
}
/**
 * Path validator to prevent directory traversal
 */
class PathValidator {
    /**
     * Validates and normalizes a file path
     * @param filePath - Path to validate
     * @param allowedPaths - List of allowed base paths
     * @returns Validated path or throws error
     */
    static validatePath(filePath, allowedPaths) {
        if (!filePath) {
            throw new Error('File path cannot be empty');
        }
        // Normalize and resolve the path
        const normalizedPath = path.normalize(filePath);
        const absolutePath = path.resolve(normalizedPath);
        // Check for directory traversal attempts
        if (normalizedPath.includes('..') || normalizedPath.includes('./')) {
            throw new Error('Directory traversal detected in file path');
        }
        // Check if path is within allowed directories
        const isAllowed = allowedPaths.some(allowedPath => {
            const allowedAbsolute = path.resolve(allowedPath);
            return absolutePath.startsWith(allowedAbsolute);
        });
        if (!isAllowed) {
            throw new Error(`File path not in allowed directories: ${allowedPaths.join(', ')}`);
        }
        return absolutePath;
    }
}
/**
 * Cryptographic integrity handler
 */
class IntegrityHandler {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }
    /**
     * Signs a log entry
     * @param entry - Log entry to sign
     * @returns Signature
     */
    sign(entry) {
        const hmac = crypto.createHmac('sha256', this.secretKey);
        const data = JSON.stringify({
            timestamp: entry.timestamp,
            level: entry.level,
            message: entry.message,
            context: entry.context
        });
        hmac.update(data);
        return hmac.digest('hex');
    }
    /**
     * Verifies a log entry signature
     * @param entry - Log entry to verify
     * @param signature - Signature to verify
     * @returns True if valid
     */
    verify(entry, signature) {
        const expectedSignature = this.sign(entry);
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    }
}
/**
 * Secure Logger implementation with comprehensive security controls
 */
class SecureLogger {
    constructor(config, securityConfig) {
        this.securityEventHandlers = [];
        this.config = this.mergeConfig(config);
        this.securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...securityConfig };
        // Initialize security components
        this.sensitiveDataHandler = new SensitiveDataHandler(this.securityConfig.piiPatterns, this.securityConfig.sensitiveFields);
        if (this.securityConfig.enableRateLimit) {
            this.rateLimiter = new RateLimiter(this.securityConfig.maxLogsPerMinute);
        }
        if (this.securityConfig.enableSignatures && this.securityConfig.signatureKey) {
            this.integrityHandler = new IntegrityHandler(this.securityConfig.signatureKey);
        }
        this.validateSecurityConfig();
        this.initializeSecurely();
    }
    /**
     * Merges configuration with secure defaults
     * @private
     */
    mergeConfig(config) {
        return {
            level: ILogger_1.LogLevel.INFO,
            destinations: [ILogger_1.LogDestination.CONSOLE],
            filePath: '',
            maxFileSize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            context: '',
            format: 'json', // JSON by default for security
            bufferSize: 0,
            includeStackTrace: false, // Disabled by default for security
            defaultMetadata: {},
            ...config
        };
    }
    /**
     * Validates security configuration
     * @private
     */
    validateSecurityConfig() {
        if (this.securityConfig.maxMessageSize < 1 || this.securityConfig.maxMessageSize > 1024 * 1024) {
            throw new Error('Invalid maxMessageSize: must be between 1 byte and 1MB');
        }
        if (this.securityConfig.maxLogsPerMinute < 1 || this.securityConfig.maxLogsPerMinute > 100000) {
            throw new Error('Invalid maxLogsPerMinute: must be between 1 and 100000');
        }
        if (this.securityConfig.allowedPaths.length === 0) {
            throw new Error('At least one allowed path must be configured');
        }
    }
    /**
     * Initializes the logger securely
     * @private
     */
    initializeSecurely() {
        // Validate file path if using file destination
        if (this.config.destinations.includes(ILogger_1.LogDestination.FILE) && this.config.filePath) {
            try {
                this.config.filePath = PathValidator.validatePath(this.config.filePath, this.securityConfig.allowedPaths);
                this.createSecureLogFile();
            }
            catch (error) {
                this.logSecurityEvent({
                    type: 'PATH_VALIDATION_FAILED',
                    severity: 'HIGH',
                    details: { error: error.message }
                });
                throw error;
            }
        }
    }
    /**
     * Creates a log file with secure permissions
     * @private
     */
    createSecureLogFile() {
        const dir = path.dirname(this.config.filePath);
        // Create directory with secure permissions
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true,
                mode: parseInt('0750', 8) // rwxr-x---
            });
        }
        // Create or update file permissions
        if (!fs.existsSync(this.config.filePath)) {
            fs.writeFileSync(this.config.filePath, '', {
                mode: parseInt(this.securityConfig.filePermissions, 8)
            });
        }
        else {
            fs.chmodSync(this.config.filePath, parseInt(this.securityConfig.filePermissions, 8));
        }
    }
    /**
     * Logs a security event
     * @private
     */
    logSecurityEvent(event) {
        if (!this.securityConfig.enableSecurityEvents)
            return;
        const fullEvent = {
            ...event,
            timestamp: new Date().toISOString(),
            component: 'SecureLogger'
        };
        // Notify handlers
        for (const handler of this.securityEventHandlers) {
            try {
                handler(fullEvent);
            }
            catch (error) {
                console.error('Security event handler error:', error);
            }
        }
        // Log to console for immediate visibility
        console.warn('[SECURITY EVENT]', JSON.stringify(fullEvent));
    }
    /**
     * Processes and secures a log entry
     * @private
     */
    processLogEntry(level, message, metadata) {
        // Rate limiting check
        if (this.rateLimiter && !this.rateLimiter.isAllowed()) {
            this.logSecurityEvent({
                type: 'RATE_LIMIT_EXCEEDED',
                severity: 'MEDIUM',
                details: { level: (0, ILogger_1.getLogLevelName)(level) }
            });
            return null;
        }
        // Sanitize message
        let secureMessage = message;
        if (this.securityConfig.sanitizeInput) {
            secureMessage = InputSanitizer.sanitize(message, this.securityConfig.maxMessageSize);
        }
        // Sanitize and mask metadata
        let secureMetadata = metadata;
        if (metadata) {
            secureMetadata = InputSanitizer.sanitizeMetadata(metadata, this.securityConfig.maxMetadataSize);
            if (this.securityConfig.detectSensitiveData) {
                secureMetadata = this.sensitiveDataHandler.maskObject(secureMetadata);
            }
        }
        // Mask sensitive data in message
        if (this.securityConfig.detectSensitiveData) {
            secureMessage = this.sensitiveDataHandler.maskString(secureMessage);
        }
        // Create log entry
        const entry = {
            timestamp: new Date().toISOString(),
            level: (0, ILogger_1.getLogLevelName)(level),
            message: secureMessage,
            context: this.config.context,
            metadata: { ...this.config.defaultMetadata, ...secureMetadata },
            pid: process.pid,
            hostname: os.hostname()
        };
        // Add signature if enabled
        if (this.integrityHandler) {
            entry.metadata.signature = this.integrityHandler.sign(entry);
        }
        return entry;
    }
    /**
     * Internal secure logging method
     * @private
     */
    log(level, message, metadata) {
        if (level < this.config.level)
            return;
        try {
            const entry = this.processLogEntry(level, message, metadata);
            if (!entry)
                return; // Rate limited or processing failed
            // Write to destinations (implement secure writing)
            this.writeSecurely(entry, level);
        }
        catch (error) {
            this.logSecurityEvent({
                type: 'LOG_PROCESSING_ERROR',
                severity: 'HIGH',
                details: { error: error.message }
            });
        }
    }
    /**
     * Writes log entry securely to destinations
     * @private
     */
    writeSecurely(entry, level) {
        const formatted = JSON.stringify(entry);
        for (const destination of this.config.destinations) {
            switch (destination) {
                case ILogger_1.LogDestination.CONSOLE:
                    this.writeToConsole(formatted, level);
                    break;
                case ILogger_1.LogDestination.FILE:
                    this.writeToFileSecurely(formatted);
                    break;
                case ILogger_1.LogDestination.REMOTE:
                    // Implement secure remote logging
                    break;
            }
        }
    }
    /**
     * Writes to console
     * @private
     */
    writeToConsole(message, level) {
        if (level <= ILogger_1.LogLevel.INFO) {
            console.log(message);
        }
        else if (level === ILogger_1.LogLevel.WARN) {
            console.warn(message);
        }
        else {
            console.error(message);
        }
    }
    /**
     * Writes to file securely
     * @private
     */
    writeToFileSecurely(message) {
        if (!this.config.filePath)
            return;
        try {
            // Encrypt if enabled
            let data = message + '\n';
            if (this.securityConfig.enableEncryption && this.securityConfig.encryptionKey) {
                data = this.encrypt(data);
            }
            // Write with secure permissions
            fs.appendFileSync(this.config.filePath, data, {
                mode: parseInt(this.securityConfig.filePermissions, 8)
            });
        }
        catch (error) {
            this.logSecurityEvent({
                type: 'FILE_WRITE_ERROR',
                severity: 'HIGH',
                details: { error: error.message }
            });
        }
    }
    /**
     * Encrypts data (simplified - use proper KMS in production)
     * @private
     */
    encrypt(data) {
        if (!this.securityConfig.encryptionKey)
            return data;
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(this.securityConfig.encryptionKey, 'hex'), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return JSON.stringify({
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            data: encrypted
        }) + '\n';
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
        return new SecureLogger({ ...this.config, context: childContext }, this.securityConfig);
    }
    setLevel(level) {
        this.config.level = level;
    }
    setDestinations(destinations, filePath) {
        // Validate new file path if provided
        if (filePath) {
            try {
                const validatedPath = PathValidator.validatePath(filePath, this.securityConfig.allowedPaths);
                this.config.filePath = validatedPath;
            }
            catch (error) {
                this.logSecurityEvent({
                    type: 'DESTINATION_CHANGE_BLOCKED',
                    severity: 'MEDIUM',
                    details: { error: error.message }
                });
                throw error;
            }
        }
        this.config.destinations = destinations;
        this.initializeSecurely();
    }
    getConfig() {
        // Return config without sensitive security information
        const { signatureKey, encryptionKey, ...safeSecurityConfig } = this.securityConfig;
        return {
            ...this.config,
            // Add security info without sensitive keys
            security: safeSecurityConfig
        };
    }
    flush() {
        // Implement secure flush
        if (this.rateLimiter) {
            this.rateLimiter.cleanup();
        }
    }
    /**
     * Registers a security event handler
     * @param handler - Handler function for security events
     */
    onSecurityEvent(handler) {
        this.securityEventHandlers.push(handler);
    }
    /**
     * Gets singleton instance
     */
    static getInstance(config, securityConfig) {
        if (!SecureLogger.instance) {
            SecureLogger.instance = new SecureLogger(config, securityConfig);
        }
        return SecureLogger.instance;
    }
}
exports.SecureLogger = SecureLogger;
SecureLogger.instance = null;
/**
 * Factory function for creating secure logger instances
 */
function createSecureLogger(config, securityConfig) {
    return new SecureLogger(config, securityConfig);
}
//# sourceMappingURL=SecureLogger.js.map