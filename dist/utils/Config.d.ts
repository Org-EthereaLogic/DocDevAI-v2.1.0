export interface ConfigOptions {
    templates: string;
    output: string;
    logLevel: string;
    logFile?: string;
}
export declare class Config {
    private config;
    private configPath;
    constructor(configPath?: string);
    get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K];
    getAll(): ConfigOptions;
    reload(): void;
    private loadConfig;
    private loadFromFile;
    private loadFromEnv;
}
