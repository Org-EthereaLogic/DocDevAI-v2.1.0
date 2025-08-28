"use strict";
/**
 * @fileoverview Example usage of the Logger implementation
 * @module logger-usage.example
 * @description Demonstrates various features and best practices for using the Logger
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleDefaultLogger = exampleDefaultLogger;
exports.exampleCustomLogger = exampleCustomLogger;
exports.exampleChildLoggers = exampleChildLoggers;
exports.exampleDynamicConfig = exampleDynamicConfig;
exports.exampleMetadataHandling = exampleMetadataHandling;
exports.exampleErrorHandling = exampleErrorHandling;
exports.exampleBufferedLogging = exampleBufferedLogging;
exports.exampleProductionSetup = exampleProductionSetup;
const index_1 = require("../index");
// Example 1: Using the default logger instance
function exampleDefaultLogger() {
    const logger = index_1.Logger.getInstance();
    logger.info('Application started');
    logger.debug('This debug message won\'t show with INFO level');
    logger.warn('Warning: Resource usage is high', { cpu: 85, memory: 92 });
    logger.error('Failed to connect to database', {
        error: new Error('Connection timeout'),
        retryCount: 3
    });
}
// Example 2: Creating a custom configured logger
function exampleCustomLogger() {
    const logger = new index_1.Logger({
        level: index_1.LogLevel.DEBUG,
        destinations: [index_1.LogDestination.CONSOLE, index_1.LogDestination.FILE],
        filePath: './logs/app.log',
        format: 'json',
        context: 'MyApp',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 10
    });
    logger.debug('Debug information', { module: 'auth', action: 'login' });
    logger.info('User logged in successfully', { userId: '12345', username: 'john.doe' });
}
// Example 3: Using child loggers for different modules
function exampleChildLoggers() {
    const mainLogger = new index_1.Logger({
        level: index_1.LogLevel.INFO,
        context: 'Application',
        format: 'text'
    });
    // Create child loggers for different modules
    const authLogger = mainLogger.child('Auth');
    const dbLogger = mainLogger.child('Database');
    const apiLogger = mainLogger.child('API');
    authLogger.info('User authentication successful', { userId: '12345' });
    dbLogger.warn('Query took longer than expected', { query: 'SELECT * FROM users', duration: 1500 });
    apiLogger.error('API rate limit exceeded', { endpoint: '/api/v1/data', requests: 1000 });
}
// Example 4: Dynamic configuration changes
function exampleDynamicConfig() {
    const logger = new index_1.Logger({
        level: index_1.LogLevel.INFO,
        destinations: [index_1.LogDestination.CONSOLE]
    });
    logger.info('Normal operation mode');
    // Enable debug mode dynamically
    logger.setLevel(index_1.LogLevel.DEBUG);
    logger.debug('Debug mode enabled - more detailed logging');
    // Switch to file logging
    logger.setDestinations([index_1.LogDestination.FILE], './logs/debug.log');
    logger.info('Now logging to file');
}
// Example 5: Handling different data types in metadata
function exampleMetadataHandling() {
    const logger = new index_1.Logger({
        level: index_1.LogLevel.INFO,
        format: 'json'
    });
    // Various metadata types
    logger.info('Processing data', {
        count: 100,
        percentage: 45.67,
        isComplete: false,
        tags: ['important', 'batch-process'],
        user: { id: 123, name: 'Alice' },
        timestamp: new Date(),
        nullValue: null,
        undefinedValue: undefined // Will be filtered out
    });
    // Handling circular references
    const circular = { name: 'test' };
    circular.self = circular;
    logger.warn('Circular reference handled gracefully', circular);
}
// Example 6: Error handling and stack traces
function exampleErrorHandling() {
    const logger = new index_1.Logger({
        level: index_1.LogLevel.ERROR,
        includeStackTrace: true,
        format: 'json'
    });
    try {
        throw new Error('Something went wrong');
    }
    catch (error) {
        logger.error('Operation failed', { error, operation: 'dataProcessing' });
    }
    // Non-Error throwables
    logger.error('String error', { error: 'Invalid input' });
    logger.error('Numeric error code', { error: 404 });
}
// Example 7: Buffered file logging for performance
function exampleBufferedLogging() {
    const logger = new index_1.Logger({
        level: index_1.LogLevel.INFO,
        destinations: [index_1.LogDestination.FILE],
        filePath: './logs/buffered.log',
        bufferSize: 100 // Buffer 100 log entries before writing
    });
    // These logs will be buffered
    for (let i = 0; i < 50; i++) {
        logger.info(`Log entry ${i}`, { index: i });
    }
    // Force flush the buffer
    logger.flush();
}
// Example 8: Production-ready logging setup
function exampleProductionSetup() {
    // Development configuration
    const devLogger = new index_1.Logger({
        level: index_1.LogLevel.DEBUG,
        destinations: [index_1.LogDestination.CONSOLE],
        format: 'text',
        context: 'DEV'
    });
    // Production configuration
    const prodLogger = new index_1.Logger({
        level: index_1.LogLevel.WARN,
        destinations: [index_1.LogDestination.FILE],
        filePath: '/var/log/app/production.log',
        format: 'json',
        context: 'PROD',
        maxFileSize: 50 * 1024 * 1024, // 50MB
        maxFiles: 30,
        includeStackTrace: true,
        defaultMetadata: {
            environment: 'production',
            version: '2.1.0',
            service: 'DocDevAI'
        }
    });
    const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
    logger.info('Application configured for environment', {
        env: process.env.NODE_ENV || 'development'
    });
}
// Run examples if this file is executed directly
if (require.main === module) {
    console.log('=== Logger Usage Examples ===\n');
    console.log('1. Default Logger:');
    exampleDefaultLogger();
    console.log('\n2. Custom Logger:');
    exampleCustomLogger();
    console.log('\n3. Child Loggers:');
    exampleChildLoggers();
    console.log('\n4. Dynamic Configuration:');
    exampleDynamicConfig();
    console.log('\n5. Metadata Handling:');
    exampleMetadataHandling();
    console.log('\n6. Error Handling:');
    exampleErrorHandling();
    console.log('\n7. Buffered Logging:');
    exampleBufferedLogging();
    console.log('\n8. Production Setup:');
    exampleProductionSetup();
}
//# sourceMappingURL=logger-usage.example.js.map