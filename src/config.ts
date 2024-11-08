
import { config } from 'dotenv';
config()
// 配置接口
export interface Config {
    sourceDir: string;
    ouputFile: string;
    readonly isDebug: boolean;
}

const getEnv = (key: string, defaultValue: string): string => process.env[key] || defaultValue;

const debugMode = Boolean(process.env.IS_DEBUG);

const createConfig = (sourceDirEnv: string, outputFileEnv: string): Config => ({
    sourceDir: getEnv(sourceDirEnv, "source/default"),
    ouputFile: `${getEnv(outputFileEnv, "default-file")}.json`,
    isDebug: debugMode,
});

// 创建 Web 和 Bt 配置
export const webSourceConf: Config = createConfig("WEB_SOURCE_DIR", "WEB_OUTPUT_FILE_NAME");
export const btSourceConf: Config = createConfig("BT_SOURCE_DIR", "bt_OUTPUT_FILE_NAME");
