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

import {
  FileSystem,
  spinalCore,
  Lst,
  Model,
  Ptr,
  type Str,
  type Val,
} from 'spinal-core-connectorjs';
import generator from 'generate-password';

export interface ILog extends Model {
  timeStamp: Val;
  message: Str;
}

export interface IGenericOrganData extends Model {
  id: Str;
  name: Str;
  bootTimestamp: Val;
  lastHealthTime: Val;
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
export class ConfigFileModel extends Model {
  genericOrganData: IGenericOrganData;
  specificOrganData: ISpecificOrganData;
  specificOrganConfig?: Ptr<any>;
  constructor(
    name: string,
    ipAdress?: string,
    port?: number,
    protocol?: string
  ) {
    super();
    if (FileSystem._sig_server === false) return;
    this.add_attr({
      genericOrganData: {
        id: generator.generate({ length: 20, numbers: true }),
        name: name,
        bootTimestamp: Date.now(),
        lastHealthTime: Date.now(),
        ramRssUsed: '',
        logList: [],
      },
      specificOrganData: {
        state: '',
        ipAdress: ipAdress,
        port: port,
        protocol: protocol,
        lastAction: {
          message: 'connected',
          date: Date.now(),
        },
      },
    });
    this.updateRamUsage();
  }

  public addToConfigFileModel(): Lst {
    var fileLst = new Lst();
    this.data.add_attr(fileLst);
    return fileLst;
  }
  public updateRamUsage() {
    const used = process.memoryUsage();
    const value = `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`;
    if (!this.genericOrganData.ramRssUsed)
      this.genericOrganData.add_attr('ramRssUsed', value);
    else this.genericOrganData.ramRssUsed.set(value);
  }
  public loadConfigModel() {
    if (typeof this.specificOrganConfig === 'undefined') {
      return undefined;
    } else {
      return this.specificOrganConfig.load();
    }
  }
  public setConfigModel(model: Model) {
    this.add_attr('specificOrganConfig', new Ptr(model));
  }
}

spinalCore.register_models(ConfigFileModel, 'ConfigFileModel');
