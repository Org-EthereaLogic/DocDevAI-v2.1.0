"use strict";
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
exports.Config = void 0;
const fs = __importStar(require("fs"));
class Config {
    constructor(configPath = '.devdocai.json') {
        this.configPath = configPath;
        this.config = this.loadConfig();
    }
    get(key) {
        return this.config[key];
    }
    getAll() {
        return { ...this.config };
    }
    reload() {
        this.config = this.loadConfig();
    }
    loadConfig() {
        const defaults = {
            templates: './templates',
            output: './docs',
            logLevel: 'info',
            logFile: undefined
        };
        // Merge with priority: env > file > defaults
        return { ...defaults, ...this.loadFromFile(), ...this.loadFromEnv() };
    }
    loadFromFile() {
        if (!fs.existsSync(this.configPath))
            return {};
        try {
            const content = fs.readFileSync(this.configPath, 'utf-8');
            const parsed = JSON.parse(content);
            const config = {};
            // Only include known config keys
            ['templates', 'output', 'logLevel', 'logFile'].forEach(key => {
                if (parsed[key] !== undefined) {
                    config[key] = parsed[key];
                }
            });
            return config;
        }
        catch {
            return {}; // Silently fall back to empty config on error
        }
    }
    loadFromEnv() {
        const config = {};
        const envMap = {
            'DEVDOCAI_TEMPLATES': 'templates',
            'DEVDOCAI_OUTPUT': 'output',
            'DEVDOCAI_LOG_LEVEL': 'logLevel',
            'DEVDOCAI_LOG_FILE': 'logFile'
        };
        Object.entries(envMap).forEach(([envKey, configKey]) => {
            const value = process.env[envKey];
            if (value !== undefined) {
                // Treat empty string as undefined for logFile
                if (configKey === 'logFile' && value === '')
                    return;
                config[configKey] = value;
            }
        });
        return config;
    }
}
exports.Config = Config;
//# sourceMappingURL=Config.js.map