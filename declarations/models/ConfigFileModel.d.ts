import { Lst, Model, Ptr, type Str, type Val } from 'spinal-core-connectorjs';
export interface ILog extends Model {
    timeStamp: Val;
    message: Str;
}
export interface IGenericOrganData extends Model {
    id: Str;
    name: Str;
    bootTimestamp: Val;
    lastHealthTime: Val;
    macAdress: Str;
    ramRssUsed: Str;
    logList: Lst<ILog>;
}
export interface ISpecificOrganData extends Model {
    state: Str;
    ipAdress: Str;
    port: Val;
    protocol: Str;
    lastAction: {
        message: Str;
        date: Val;
    };
}
export declare class ConfigFileModel extends Model {
    genericOrganData: IGenericOrganData;
    specificOrganData: ISpecificOrganData;
    specificOrganConfig?: Ptr<any>;
    constructor(name: string, ipAdress?: string, port?: number, protocol?: string);
    addToConfigFileModel(): Lst;
    updateIPandMacAdress(): void;
    updateRamUsage(): void;
    loadConfigModel(): Promise<any> | undefined;
    setConfigModel(model: Model): void;
}
