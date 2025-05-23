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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const LLMConfigService_1 = require("../src/utils/LLMConfigService"); // 更新導入路徑
const CONFIG_FILE_PATH = path.join(__dirname, '../src/config/GeneratorConfig.json');
const CONFIG_FILE_BACKUP_PATH = path.join(__dirname, '../src/config/GeneratorConfig.json.backup');
const defaultConfigValues = {
    description: "系統預設LLM配置",
    temperature: 1,
    thinkingBudget: null,
};
function runTest(testName, setup, verification) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n--- 執行測試: ${testName} ---`);
        try {
            setup();
            // 等待一點時間確保文件系統操作完成，以及可能的異步操作完成
            yield new Promise(resolve => setTimeout(resolve, 100));
            LLMConfigService_1.LLMConfigService.getInstance(); // 確保實例已創建或重新載入配置
            verification();
            console.log(`[成功] ${testName}`);
        }
        catch (e) {
            console.error(`[失敗] ${testName}: ${e.message}`);
            if (e.stack) {
                console.error(e.stack);
            }
        }
    });
}
function backupConfigFile() {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
        fs.copyFileSync(CONFIG_FILE_PATH, CONFIG_FILE_BACKUP_PATH);
        console.log(`已備份 ${CONFIG_FILE_PATH} 到 ${CONFIG_FILE_BACKUP_PATH}`);
    }
}
function restoreConfigFile() {
    if (fs.existsSync(CONFIG_FILE_BACKUP_PATH)) {
        fs.copyFileSync(CONFIG_FILE_BACKUP_PATH, CONFIG_FILE_PATH);
        fs.unlinkSync(CONFIG_FILE_BACKUP_PATH);
        console.log(`已從 ${CONFIG_FILE_BACKUP_PATH} 還原 ${CONFIG_FILE_PATH} 並刪除備份`);
    }
}
function deleteConfigFile() {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
        fs.unlinkSync(CONFIG_FILE_PATH);
    }
}
function writeConfigFile(content) {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(content, null, 2));
}
function assertConfig(generatorId, expected, actual) {
    const effectiveActual = actual || LLMConfigService_1.LLMConfigService.getInstance().getConfig(generatorId);
    let allMatch = true;
    if (expected.description !== undefined && expected.description !== effectiveActual.description) {
        console.warn(`  ID "${generatorId}": description 預期 "${expected.description}", 實際 "${effectiveActual.description}"`);
        allMatch = false;
    }
    if (expected.temperature !== undefined && expected.temperature !== effectiveActual.temperature) {
        console.warn(`  ID "${generatorId}": temperature 預期 ${expected.temperature}, 實際 ${effectiveActual.temperature}`);
        allMatch = false;
    }
    if (expected.thinkingBudget !== undefined && expected.thinkingBudget !== effectiveActual.thinkingBudget) {
        console.warn(`  ID "${generatorId}": thinkingBudget 預期 ${expected.thinkingBudget}, 實際 ${effectiveActual.thinkingBudget}`);
        allMatch = false;
    }
    if (allMatch) {
        console.log(`  ID "${generatorId}": ✅ 配置符合預期。`);
    }
    else {
        console.error(`  ID "${generatorId}": ❌ 配置不符合預期。實際值:`, effectiveActual);
        throw new Error(`ID "${generatorId}" 的配置斷言失敗`);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("開始 LLMConfigService 手動測試...");
        backupConfigFile();
        // --- 測試案例 --- 
        yield runTest("配置文件不存在", () => { deleteConfigFile(); }, () => {
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig("any_id");
            assertConfig("any_id", defaultConfigValues, config);
        });
        yield runTest("配置文件為空JSON", () => { writeConfigFile({}); }, () => {
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig("any_id");
            assertConfig("any_id", defaultConfigValues, config);
        });
        yield runTest("配置文件JSON格式錯誤", () => { fs.writeFileSync(CONFIG_FILE_PATH, "invalid json"); }, () => {
            // 預期 loadConfig 會失敗並使用預設值 (或上次成功載入的配置，此處應為預設)
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig("any_id");
            assertConfig("any_id", defaultConfigValues, config);
        });
        yield runTest("特定ID存在且完整有效", () => {
            writeConfigFile({
                "test.1": { "description": "完整", "temperature": 0.5, "thinkingBudget": 5000 }
            });
        }, () => {
            assertConfig("test.1", { description: "完整", temperature: 0.5, thinkingBudget: 5000 });
            assertConfig("non_existent", defaultConfigValues); // 檢查不存在的ID是否回傳預設
        });
        yield runTest("Temperature 無效 - 型別錯誤", () => {
            writeConfigFile({
                "test.temp.string": { "temperature": "high" }
            });
        }, () => {
            assertConfig("test.temp.string", { temperature: defaultConfigValues.temperature });
        });
        yield runTest("Temperature 無效 - 超出範圍 (太高)", () => {
            writeConfigFile({
                "test.temp.high": { "temperature": 2.5 }
            });
        }, () => {
            assertConfig("test.temp.high", { temperature: defaultConfigValues.temperature });
        });
        yield runTest("Temperature 無效 - 超出範圍 (太低)", () => {
            writeConfigFile({
                "test.temp.low": { "temperature": -0.5 }
            });
        }, () => {
            assertConfig("test.temp.low", { temperature: defaultConfigValues.temperature });
        });
        yield runTest("Temperature 有效 - 邊界值 0", () => {
            writeConfigFile({
                "test.temp.zero": { "temperature": 0 }
            });
        }, () => {
            assertConfig("test.temp.zero", { temperature: 0 });
        });
        yield runTest("Temperature 有效 - 邊界值 2", () => {
            writeConfigFile({
                "test.temp.two": { "temperature": 2 }
            });
        }, () => {
            assertConfig("test.temp.two", { temperature: 2 });
        });
        yield runTest("ThinkingBudget 無效 - 型別錯誤", () => {
            writeConfigFile({
                "test.budget.string": { "thinkingBudget": "large" }
            });
        }, () => {
            assertConfig("test.budget.string", { thinkingBudget: defaultConfigValues.thinkingBudget });
        });
        yield runTest("ThinkingBudget 無效 - 超出範圍 (太高)", () => {
            writeConfigFile({
                "test.budget.high": { "thinkingBudget": 30000 }
            });
        }, () => {
            assertConfig("test.budget.high", { thinkingBudget: defaultConfigValues.thinkingBudget });
        });
        yield runTest("ThinkingBudget 無效 - 超出範圍 (負數)", () => {
            writeConfigFile({
                "test.budget.negative": { "thinkingBudget": -100 }
            });
        }, () => {
            assertConfig("test.budget.negative", { thinkingBudget: defaultConfigValues.thinkingBudget });
        });
        yield runTest("ThinkingBudget 有效 - null", () => {
            writeConfigFile({
                "test.budget.null": { "thinkingBudget": null }
            });
        }, () => {
            assertConfig("test.budget.null", { thinkingBudget: null });
        });
        yield runTest("ThinkingBudget 有效 - 0", () => {
            writeConfigFile({
                "test.budget.zero": { "thinkingBudget": 0 }
            });
        }, () => {
            assertConfig("test.budget.zero", { thinkingBudget: 0 });
        });
        yield runTest("ThinkingBudget 有效 - 最大值 24576", () => {
            writeConfigFile({
                "test.budget.max": { "thinkingBudget": 24576 }
            });
        }, () => {
            assertConfig("test.budget.max", { thinkingBudget: 24576 });
        });
        yield runTest("只有 description", () => {
            writeConfigFile({
                "test.desc.only": { "description": "僅描述" }
            });
        }, () => {
            assertConfig("test.desc.only", {
                description: "僅描述",
                temperature: defaultConfigValues.temperature,
                thinkingBudget: defaultConfigValues.thinkingBudget
            });
        });
        yield runTest("缺少 description", () => {
            writeConfigFile({
                "test.nodesc": { "temperature": 0.7, "thinkingBudget": 7000 }
            });
        }, () => {
            assertConfig("test.nodesc", {
                description: defaultConfigValues.description,
                temperature: 0.7,
                thinkingBudget: 7000
            });
        });
        yield runTest("多個配置，部分有效部分無效", () => {
            writeConfigFile({
                "valid.entry": { "description": "有效條目", "temperature": 1.5, "thinkingBudget": 15000 },
                "invalid.temp": { "description": "溫度無效", "temperature": "abc", "thinkingBudget": 5000 },
                "invalid.budget": { "description": "預算無效", "temperature": 0.5, "thinkingBudget": -100 },
                "no.values": { "description": "只有描述" }
            });
        }, () => {
            assertConfig("valid.entry", { description: "有效條目", temperature: 1.5, thinkingBudget: 15000 });
            assertConfig("invalid.temp", { description: "溫度無效", temperature: defaultConfigValues.temperature, thinkingBudget: 5000 });
            assertConfig("invalid.budget", { description: "預算無效", temperature: 0.5, thinkingBudget: defaultConfigValues.thinkingBudget });
            assertConfig("no.values", { description: "只有描述", temperature: defaultConfigValues.temperature, thinkingBudget: defaultConfigValues.thinkingBudget });
            assertConfig("non_existent_after_multiple", defaultConfigValues);
        });
        // --- 清理 --- 
        restoreConfigFile();
        console.log("\nLLMConfigService 手動測試完成。");
    });
}
main().catch(e => {
    console.error("手動測試執行期間發生未預期錯誤:", e);
    restoreConfigFile(); // 確保即使發生嚴重錯誤也嘗試還原配置
});
//# sourceMappingURL=LLMConfigService.manual.test.js.map