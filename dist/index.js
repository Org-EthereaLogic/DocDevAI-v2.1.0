"use strict";
// DevDocAI v3.6.0
// AI-Powered Documentation Suite for Solo Developers
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentGenerator = exports.TemplateEngine = exports.Config = exports.Logger = exports.version = void 0;
exports.version = '3.6.0';
// Core components
var Logger_1 = require("./utils/Logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
var Config_1 = require("./utils/Config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return Config_1.Config; } });
var TemplateEngine_1 = require("./utils/TemplateEngine");
Object.defineProperty(exports, "TemplateEngine", { enumerable: true, get: function () { return TemplateEngine_1.TemplateEngine; } });
var DocumentGenerator_1 = require("./utils/DocumentGenerator");
Object.defineProperty(exports, "DocumentGenerator", { enumerable: true, get: function () { return DocumentGenerator_1.DocumentGenerator; } });
//# sourceMappingURL=index.js.map