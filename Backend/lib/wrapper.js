"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = __importDefault(require("mysql2/promise"));
var config_1 = require("./config");
var pool = promise_1.default.createPool({
    host: config_1.DB.host,
    user: config_1.DB.user,
    password: config_1.DB.password,
    database: config_1.DB.database,
    waitForConnections: true,
    connectionLimit: 10,
});
exports.default = pool;
