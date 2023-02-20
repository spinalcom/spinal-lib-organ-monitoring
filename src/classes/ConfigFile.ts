/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { Lst, spinalCore } from "spinal-core-connectorjs";
import * as path from "path";
import { ConfigFileModel } from "../models/ConfigFileModel";
import * as cron from 'node-cron';


export class ConfigFile {
  private static instance: ConfigFile;
  private file: ConfigFileModel;

  private constructor() { }

  public static getInstance(): ConfigFile {
    if (!this.instance) this.instance = new ConfigFile();

    return this.instance;
  }

  public async init(connect: spinal.FileSystem, fileName: string): Promise<ConfigFileModel> {
    return this._loadOrMakeConfigFile(connect, fileName).then((file) => {
      this.file = file;
      this._scheduleReInit(file);
      return file;
    })
  }


  private _loadOrMakeConfigFile(connect: spinal.FileSystem, fileName: string): Promise<ConfigFileModel> {
    return new Promise((resolve, reject) => {
      spinalCore.load(connect, path.resolve(`/etc/Organs/${fileName}`),
        (file: ConfigFileModel) => resolve(file),
        () => connect.load_or_make_dir("/etc/Organs", (directory: spinal.Directory) => {
          resolve(this._createFile(directory, fileName));
        })
      )
    });
  }

  private _createFile(directory: spinal.Directory, fileName: string): ConfigFileModel {
    const file = new ConfigFileModel();
    directory.force_add_file(fileName, file, { model_type: "ConfigFile" });
    return file;
  }


  private _scheduleReInit(file: ConfigFileModel) {
    cron.schedule('0 /10 * * * *', () => {
      this._reInitializeFileConfig(file);
    })
  }
  private _reInitializeFileConfig(file: ConfigFileModel) {
    console.log("send a new data")
  }

}

export default ConfigFile.getInstance();