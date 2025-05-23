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
exports.LLMConfigService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// 預設配置
const defaultConfig = {
    description: "系統預設LLM配置",
    temperature: 1,
    thinkingBudget: null, // 代表使用 Gemini API 的預設思考行為
};
// 配置檔案路徑
const CONFIG_FILE_PATH = path.join(__dirname, '../config/GeneratorConfig.json'); // 注意路徑的相對位置
// 合理範圍檢查
const isValidTemperature = (temp) => typeof temp === 'number' && temp >= 0 && temp <= 2;
const isValidThinkingBudget = (budget) => budget === null || (typeof budget === 'number' && budget >= 0 && budget <= 24576);
class LLMConfigService {
    static instance;
    configs = {};
    lastModifiedTime = 0;
    constructor() {
        this.loadConfig();
    }
    static getInstance() {
        if (!LLMConfigService.instance) {
            LLMConfigService.instance = new LLMConfigService();
        }
        return LLMConfigService.instance;
    }
    loadConfig() {
        try {
            // 檢查文件是否存在以及是否需要重新載入
            if (!fs.existsSync(CONFIG_FILE_PATH)) {
                console.warn(`[DEBUG LLMConfigService.ts] 配置文件 ${CONFIG_FILE_PATH} 不存在。將使用預設配置。`);
                this.configs = {}; // 清空現有配置，因為文件不存在
                this.lastModifiedTime = 0;
                return;
            }
            const stats = fs.statSync(CONFIG_FILE_PATH);
            if (stats.mtimeMs === this.lastModifiedTime) {
                // console.log("[DEBUG LLMConfigService.ts] 配置文件未更改，無需重新載入。");
                return;
            }
            // console.log(`[DEBUG LLMConfigService.ts] 正在從 ${CONFIG_FILE_PATH} 載入配置...`);
            const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
            this.configs = JSON.parse(fileContent);
            this.lastModifiedTime = stats.mtimeMs;
            // console.log("[DEBUG LLMConfigService.ts] 配置載入成功。");
        }
        catch (error) {
            console.error(`[DEBUG LLMConfigService.ts] 載入配置文件 ${CONFIG_FILE_PATH} 失敗:`, error);
            // 如果載入失敗，保留上一次成功的配置或使用預設
            if (Object.keys(this.configs).length === 0) {
                console.warn(`[DEBUG LLMConfigService.ts] 因載入失敗且無先前配置，所有請求將使用預設LLM配置。`);
            }
            else {
                console.warn(`[DEBUG LLMConfigService.ts] 因載入失敗，將繼續使用先前載入的配置。`);
            }
            // 考慮是否在錯誤發生時重置 this.configs = {} 以強制使用預設值
            // 或者保留舊配置直到成功讀取為止
        }
    }
    getConfig(generatorId) {
        this.loadConfig(); // 每次獲取配置時嘗試重新載入，以應對文件變更
        const specificConfig = this.configs[generatorId];
        if (!specificConfig) {
            // console.log(`[DEBUG LLMConfigService.ts] 未找到 ID 為 "${generatorId}" 的配置，使用預設配置。`);
            return { ...defaultConfig }; // 使用展開運算符創建副本以避免修改 defaultConfig
        }
        // console.log(`[DEBUG LLMConfigService.ts] 找到 ID 為 "${generatorId}" 的配置:`, specificConfig);
        const resultTemperature = isValidTemperature(specificConfig.temperature)
            ? specificConfig.temperature
            : defaultConfig.temperature;
        if (!isValidTemperature(specificConfig.temperature) && specificConfig.temperature !== undefined) {
            console.warn(`[DEBUG LLMConfigService.ts] ID "${generatorId}" 的 temperature 值 "${specificConfig.temperature}" 無效 (型別: ${typeof specificConfig.temperature})，已改用預設值 ${defaultConfig.temperature}。`);
        }
        const resultThinkingBudget = isValidThinkingBudget(specificConfig.thinkingBudget)
            ? specificConfig.thinkingBudget
            : defaultConfig.thinkingBudget;
        if (!isValidThinkingBudget(specificConfig.thinkingBudget) && specificConfig.thinkingBudget !== undefined) {
            console.warn(`[DEBUG LLMConfigService.ts] ID "${generatorId}" 的 thinkingBudget 值 "${specificConfig.thinkingBudget}" 無效 (型別: ${typeof specificConfig.thinkingBudget})，已改用預設值 ${defaultConfig.thinkingBudget === null ? 'null (API預設)' : defaultConfig.thinkingBudget}。`);
        }
        const description = typeof specificConfig.description === 'string'
            ? specificConfig.description
            : defaultConfig.description;
        return {
            description: description,
            temperature: resultTemperature,
            thinkingBudget: resultThinkingBudget,
        };
    }
}
exports.LLMConfigService = LLMConfigService;
// // 測試代碼 (可選，用於開發時測試)
// const testService = LLMConfigService.getInstance();
// console.log("--- 測試 getConfig ---");
// console.log(" getConfig('1.1.1'):", testService.getConfig('1.1.1'));
// console.log(" getConfig('1.1.3'):", testService.getConfig('1.1.3')); // 缺少 thinkingBudget
// console.log(" getConfig('1.1.8'):", testService.getConfig('1.1.8')); // temperature 型態錯誤
// console.log(" getConfig('1.1.9'):", testService.getConfig('1.1.9')); // thinkingBudget 型態錯誤
// console.log(" getConfig('1.1.10'):", testService.getConfig('1.1.10')); // temperature 超出範圍
// console.log(" getConfig('1.1.11'):", testService.getConfig('1.1.11')); // thinkingBudget 超出範圍
// console.log(" getConfig('non_existent_id'):", testService.getConfig('non_existent_id'));
// console.log(" getConfig('1.1.12'):", testService.getConfig('1.1.12')); // thinkingBudget 為 0
// console.log(" getConfig('1.1.13'):", testService.getConfig('1.1.13')); // temperature 為 0
// console.log(" getConfig('1.1.14'):", testService.getConfig('1.1.14')); // 只有 description
// console.log(" getConfig('1.1.4'):", testService.getConfig('1.1.4')); // 缺少 description
// fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({ "new_id": { "temperature": 0.5 } }, null, 2));
// console.log("--- 修改 GeneratorConfig.json 後 ---");
// console.log(" getConfig('new_id') after change:", testService.getConfig('new_id'));
// const currentConfig = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'));
// delete currentConfig.new_id; // 清理
// fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(currentConfig, null, 2));
// // 模擬 GeneratorConfig.json 不存在的情況
// const backupPath = CONFIG_FILE_PATH + '.backup';
// if (fs.existsSync(CONFIG_FILE_PATH)) {
//   fs.renameSync(CONFIG_FILE_PATH, backupPath);
//   console.log(`[DEBUG LLMConfigService.ts] 模擬文件不存在: ${CONFIG_FILE_PATH} 已改名為 ${backupPath}`);
// }
// console.log("--- 測試 GeneratorConfig.json 不存在 ---");
// const serviceInstanceMissingFile = LLMConfigService.getInstance(); // 應該會重新創建實例或重載
// console.log(" getConfig('1.1.1') when file missing:", serviceInstanceMissingFile.getConfig('1.1.1'));
// // 還原文件
// if (fs.existsSync(backupPath)) {
//   fs.renameSync(backupPath, CONFIG_FILE_PATH);
//   console.log(`[DEBUG LLMConfigService.ts] 還原文件: ${backupPath} 已還原為 ${CONFIG_FILE_PATH}`);
// }
// // 強制重新載入
// const freshInstance = LLMConfigService.getInstance();
// console.log(" getConfig('1.1.1') after file restored and fresh instance:", freshInstance.getConfig('1.1.1')); 
//# sourceMappingURL=LLMConfigService.js.map