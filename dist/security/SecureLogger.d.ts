/**
 * @fileoverview Secure Logger implementation with comprehensive security controls
 * @module SecureLogger
 * @description Production-ready logger with security hardening following OWASP guidelines
 */
import { ILogger, LogLevel, LogDestination, LoggerConfig, LogMetadata } from '../interfaces/ILogger';
/**
 * Security configuration for the logger
 */
export interface SecurityConfig {
    /** Enable input sanitization */
    sanitizeInput: boolean;
    /** Enable sensitive data detection */
    detectSensitiveData: boolean;
    /** Enable rate limiting */
    enableRateLimit: boolean;
    /** Maximum logs per minute */
    maxLogsPerMinute: number;
    /** Maximum message size in bytes */
    maxMessageSize: number;
    /** Maximum metadata size in bytes */
    maxMetadataSize: number;
    /** Enable cryptographic signatures */
    enableSignatures: boolean;
    /** Secret key for signatures (should be stored securely) */
    signatureKey?: string;
    /** Enable encryption at rest */
    enableEncryption: boolean;
    /** Encryption key (should be from secure key management) */
    encryptionKey?: string;
    /** File permissions mode (octal) */
    filePermissions: string;
    /** Allowed file paths (whitelist) */
    allowedPaths: string[];
    /** Enable security event logging */
    enableSecurityEvents: boolean;
    /** PII patterns to detect and mask */
    piiPatterns: RegExp[];
    /** Sensitive field names to redact */
    sensitiveFields: string[];
}
/**
 * Secure Logger implementation with comprehensive security controls
 */
export declare class SecureLogger implements ILogger {
    private static instance;
    private config;
    private securityConfig;
    private rateLimiter?;
    private sensitiveDataHandler;
    private integrityHandler?;
    private securityEventHandlers;
    constructor(config?: LoggerConfig, securityConfig?: Partial<SecurityConfig>);
    /**
     * Merges configuration with secure defaults
     * @private
     */
    private mergeConfig;
    /**
     * Validates security configuration
     * @private
     */
    private validateSecurityConfig;
    /**
     * Initializes the logger securely
     * @private
     */
    private initializeSecurely;
    /**
     * Creates a log file with secure permissions
     * @private
     */
    private createSecureLogFile;
    /**
     * Logs a security event
     * @private
     */
    private logSecurityEvent;
    /**
     * Processes and secures a log entry
     * @private
     */
    private processLogEntry;
    /**
     * Internal secure logging method
     * @private
     */
    private log;
    /**
     * Writes log entry securely to destinations
     * @private
     */
    private writeSecurely;
    /**
     * Writes to console
     * @private
     */
    private writeToConsole;
    /**
     * Writes to file securely
     * @private
     */
    private writeToFileSecurely;
    /**
     * Encrypts data (simplified - use proper KMS in production)
     * @private
     */
    private encrypt;
    debug(message: string, metadata?: LogMetadata): void;
    info(message: string, metadata?: LogMetadata): void;
    warn(message: string, metadata?: LogMetadata): void;
    error(message: string, metadata?: LogMetadata): void;
    fatal(message: string, metadata?: LogMetadata): void;
    child(context: string): ILogger;
    setLevel(level: LogLevel): void;
    setDestinations(destinations: LogDestination[], filePath?: string): void;
    getConfig(): LoggerConfig;
    flush(): void;
    /**
     * Registers a security event handler
     * @param handler - Handler function for security events
     */
    onSecurityEvent(handler: (event: SecurityEvent) => void): void;
    /**
     * Gets singleton instance
     */
    static getInstance(config?: LoggerConfig, securityConfig?: Partial<SecurityConfig>): SecureLogger;
}
/**
 * Security event interface
 */
export interface SecurityEvent {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp?: string;
    component?: string;
    details?: any;
}
/**
 * Factory function for creating secure logger instances
 */
export declare function createSecureLogger(config?: LoggerConfig, securityConfig?: Partial<SecurityConfig>): ILogger;
//# sourceMappingURL=SecureLogger.d.ts.map