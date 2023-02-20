import { ConfigFileModel } from "../models/ConfigFileModel";
export declare class ConfigFile {
    private static instance;
    private file;
    private constructor();
    static getInstance(): ConfigFile;
    init(connect: spinal.FileSystem, fileName: string): Promise<ConfigFileModel>;
    private _loadOrMakeConfigFile;
    private _createFile;
    private _scheduleReInit;
    private _reInitializeFileConfig;
}
declare const _default: ConfigFile;
export default _default;
