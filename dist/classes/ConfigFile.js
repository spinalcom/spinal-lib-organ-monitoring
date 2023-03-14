"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFile = void 0;
var spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
var path = __importStar(require("path"));
var ConfigFileModel_1 = require("../models/ConfigFileModel");
var ConfigFile = /** @class */ (function () {
    function ConfigFile() {
    }
    ConfigFile.getInstance = function () {
        if (!this.instance)
            this.instance = new ConfigFile();
        return this.instance;
    };
    ConfigFile.prototype.init = function (connect, fileName, ipAdress, protocol, port) {
        var _this = this;
        return this._loadOrMakeConfigFile(connect, fileName, ipAdress, protocol, port).then(function (file) {
            _this.file = file;
            _this.file.genericOrganData.bootTimestamp.set(Date.now());
            _this._scheduleReInit();
            return file;
        });
    };
    ConfigFile.prototype._loadOrMakeConfigFile = function (connect, fileName, ipAdress, protocol, port) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            spinal_core_connectorjs_1.spinalCore.load(connect, path.resolve("/etc/Organs/".concat(fileName)), function (file) { return resolve(file); }, function () { return connect.load_or_make_dir("/etc/Organs", function (directory) {
                resolve(_this._createFile(directory, fileName, ipAdress, protocol, port));
            }); });
        });
    };
    ConfigFile.prototype._createFile = function (directory, fileName, ipAdress, protocol, port) {
        var file = new ConfigFileModel_1.ConfigFileModel(fileName, ipAdress, port, protocol);
        directory.force_add_file(fileName, file, { model_type: "ConfigFile" });
        return file;
    };
    ConfigFile.prototype._scheduleReInit = function () {
        var _this = this;
        setInterval(function () {
            _this._reInitializeFileConfig();
        }, 60000);
    };
    ConfigFile.prototype._reInitializeFileConfig = function () {
        this.file.updateRamUsage();
        this.file.genericOrganData.lastHealthTime.set(Date.now());
    };
    ConfigFile.prototype.getConfig = function () {
        return this.file.loadConfigModel();
    };
    ;
    ConfigFile.prototype.setConfig = function (obj) {
        return this.file.setConfigModel(obj);
    };
    ConfigFile.prototype.bindState = function (callback) {
        var _this = this;
        this.file.specificOrganData.state.bind(function () {
            callback(_this.file.specificOrganData.state.get());
        });
    };
    ConfigFile.prototype.setState = function (state) {
        this.file.specificOrganData.state.set(state);
    };
    ConfigFile.prototype.pushLog = function (message) {
        this.file.genericOrganData.logList.push({
            timeStamp: Date.now(),
            message: message
        });
    };
    return ConfigFile;
}());
exports.ConfigFile = ConfigFile;
exports.default = ConfigFile.getInstance();
//# sourceMappingURL=ConfigFile.js.map