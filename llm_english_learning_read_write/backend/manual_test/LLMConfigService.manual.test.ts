import * as fs from 'fs';
import * as path from 'path';
import { LLMConfigService, FullLLMConfig } from '../src/utils/LLMConfigService'; // 更新導入路徑

const CONFIG_FILE_PATH = path.join(__dirname, '../src/config/GeneratorConfig.json');
const CONFIG_FILE_BACKUP_PATH = path.join(__dirname, '../src/config/GeneratorConfig.json.backup');

const defaultConfigValues: FullLLMConfig = {
    description: "系統預設LLM配置",
    temperature: 1,
    thinkingBudget: null,
};

async function runTest(testName: string, setup: () => void, verification: () => void) {
    console.log(`\n--- 執行測試: ${testName} ---`);
    try {
        setup();
        // 等待一點時間確保文件系統操作完成，以及可能的異步操作完成
        await new Promise(resolve => setTimeout(resolve, 100)); 
        LLMConfigService.getInstance(); // 確保實例已創建或重新載入配置
        verification();
        console.log(`[成功] ${testName}`);
    } catch (e: any) {
        console.error(`[失敗] ${testName}: ${e.message}`);
        if (e.stack) {
            console.error(e.stack);
        }
    }
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

function writeConfigFile(content: any) {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(content, null, 2));
}

function assertConfig(generatorId: string, expected: Partial<FullLLMConfig>, actual?: FullLLMConfig) {
    const effectiveActual = actual || LLMConfigService.getInstance().getConfig(generatorId);
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
    if(allMatch){
        console.log(`  ID "${generatorId}": ✅ 配置符合預期。`);
    } else {
        console.error(`  ID "${generatorId}": ❌ 配置不符合預期。實際值:`, effectiveActual);
        throw new Error(`ID "${generatorId}" 的配置斷言失敗`);
    }
}

async function main() {
    console.log("開始 LLMConfigService 手動測試...");
    backupConfigFile();

    // --- 測試案例 --- 

    await runTest("配置文件不存在", 
        () => { deleteConfigFile(); }, 
        () => { 
            const config = LLMConfigService.getInstance().getConfig("any_id");
            assertConfig("any_id", defaultConfigValues, config);
        }
    );

    await runTest("配置文件為空JSON", 
        () => { writeConfigFile({}); }, 
        () => { 
            const config = LLMConfigService.getInstance().getConfig("any_id");
            assertConfig("any_id", defaultConfigValues, config);
        }
    );

    await runTest("配置文件JSON格式錯誤", 
        () => { fs.writeFileSync(CONFIG_FILE_PATH, "invalid json"); }, 
        () => {
            // 預期 loadConfig 會失敗並使用預設值 (或上次成功載入的配置，此處應為預設)
            const config = LLMConfigService.getInstance().getConfig("any_id"); 
            assertConfig("any_id", defaultConfigValues, config);
        }
    );

    await runTest("特定ID存在且完整有效", 
        () => { 
            writeConfigFile({
                "test.1": { "description": "完整", "temperature": 0.5, "thinkingBudget": 5000 }
            }); 
        }, 
        () => { 
            assertConfig("test.1", { description: "完整", temperature: 0.5, thinkingBudget: 5000 });
            assertConfig("non_existent", defaultConfigValues); // 檢查不存在的ID是否回傳預設
        }
    );

    await runTest("Temperature 無效 - 型別錯誤", 
        () => { 
            writeConfigFile({
                "test.temp.string": { "temperature": "high" }
            }); 
        }, 
        () => { 
            assertConfig("test.temp.string", { temperature: defaultConfigValues.temperature });
        }
    );

    await runTest("Temperature 無效 - 超出範圍 (太高)", 
        () => { 
            writeConfigFile({
                "test.temp.high": { "temperature": 2.5 }
            }); 
        }, 
        () => { 
            assertConfig("test.temp.high", { temperature: defaultConfigValues.temperature });
        }
    );

    await runTest("Temperature 無效 - 超出範圍 (太低)", 
        () => { 
            writeConfigFile({
                "test.temp.low": { "temperature": -0.5 }
            }); 
        }, 
        () => { 
            assertConfig("test.temp.low", { temperature: defaultConfigValues.temperature });
        }
    );

    await runTest("Temperature 有效 - 邊界值 0", 
        () => { 
            writeConfigFile({
                "test.temp.zero": { "temperature": 0 }
            }); 
        }, 
        () => { 
            assertConfig("test.temp.zero", { temperature: 0 });
        }
    );

    await runTest("Temperature 有效 - 邊界值 2", 
        () => { 
            writeConfigFile({
                "test.temp.two": { "temperature": 2 }
            }); 
        }, 
        () => { 
            assertConfig("test.temp.two", { temperature: 2 });
        }
    );

    await runTest("ThinkingBudget 無效 - 型別錯誤", 
        () => { 
            writeConfigFile({
                "test.budget.string": { "thinkingBudget": "large" }
            }); 
        }, 
        () => { 
            assertConfig("test.budget.string", { thinkingBudget: defaultConfigValues.thinkingBudget });
        }
    );

    await runTest("ThinkingBudget 無效 - 超出範圍 (太高)", 
        () => { 
            writeConfigFile({
                "test.budget.high": { "thinkingBudget": 30000 }
            }); 
        }, 
        () => { 
            assertConfig("test.budget.high", { thinkingBudget: defaultConfigValues.thinkingBudget });
        }
    );
    
    await runTest("ThinkingBudget 無效 - 超出範圍 (負數)", 
    () => { 
        writeConfigFile({
            "test.budget.negative": { "thinkingBudget": -100 }
        }); 
    }, 
    () => { 
        assertConfig("test.budget.negative", { thinkingBudget: defaultConfigValues.thinkingBudget });
    }
);

    await runTest("ThinkingBudget 有效 - null", 
        () => { 
            writeConfigFile({
                "test.budget.null": { "thinkingBudget": null }
            }); 
        }, 
        () => { 
            assertConfig("test.budget.null", { thinkingBudget: null });
        }
    );

    await runTest("ThinkingBudget 有效 - 0", 
        () => { 
            writeConfigFile({
                "test.budget.zero": { "thinkingBudget": 0 }
            }); 
        }, 
        () => { 
            assertConfig("test.budget.zero", { thinkingBudget: 0 });
        }
    );

    await runTest("ThinkingBudget 有效 - 最大值 24576", 
        () => { 
            writeConfigFile({
                "test.budget.max": { "thinkingBudget": 24576 }
            }); 
        }, 
        () => { 
            assertConfig("test.budget.max", { thinkingBudget: 24576 });
        }
    );

    await runTest("只有 description", 
        () => { 
            writeConfigFile({
                "test.desc.only": { "description": "僅描述" }
            }); 
        }, 
        () => { 
            assertConfig("test.desc.only", { 
                description: "僅描述", 
                temperature: defaultConfigValues.temperature, 
                thinkingBudget: defaultConfigValues.thinkingBudget 
            });
        }
    );

    await runTest("缺少 description", 
        () => { 
            writeConfigFile({
                "test.nodesc": { "temperature": 0.7, "thinkingBudget": 7000 }
            }); 
        }, 
        () => { 
            assertConfig("test.nodesc", { 
                description: defaultConfigValues.description, 
                temperature: 0.7, 
                thinkingBudget: 7000 
            });
        }
    );
    
    await runTest("多個配置，部分有效部分無效", 
        () => { 
            writeConfigFile({
                "valid.entry": { "description": "有效條目", "temperature": 1.5, "thinkingBudget": 15000 },
                "invalid.temp": { "description": "溫度無效", "temperature": "abc", "thinkingBudget": 5000 },
                "invalid.budget": { "description": "預算無效", "temperature": 0.5, "thinkingBudget": -100 },
                "no.values": { "description": "只有描述"}
            }); 
        }, 
        () => { 
            assertConfig("valid.entry", { description: "有效條目", temperature: 1.5, thinkingBudget: 15000 });
            assertConfig("invalid.temp", { description: "溫度無效", temperature: defaultConfigValues.temperature, thinkingBudget: 5000 });
            assertConfig("invalid.budget", { description: "預算無效", temperature: 0.5, thinkingBudget: defaultConfigValues.thinkingBudget });
            assertConfig("no.values", { description: "只有描述", temperature: defaultConfigValues.temperature, thinkingBudget: defaultConfigValues.thinkingBudget });
            assertConfig("non_existent_after_multiple", defaultConfigValues);
        }
    );

    // --- 清理 --- 
    restoreConfigFile();
    console.log("\nLLMConfigService 手動測試完成。");
}

main().catch(e => {
    console.error("手動測試執行期間發生未預期錯誤:", e);
    restoreConfigFile(); // 確保即使發生嚴重錯誤也嘗試還原配置
}); 