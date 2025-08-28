export interface LoggerOptions {
    logFile?: string;
}
export declare class Logger {
    private logFile?;
    constructor(options?: LoggerOptions);
    debug(message: any): string;
    info(message: any): string;
    warn(message: any): string;
    error(message: any): string;
    private log;
}
