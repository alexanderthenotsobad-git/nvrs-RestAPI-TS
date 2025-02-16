"use strict";
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
exports.connectToDatabase = exports.pool = void 0;
const promise_1 = require("mysql2/promise");
// Remove dotenv import and config from here since it's handled in app.ts
// Create the pool with TypeScript types
exports.pool = (0, promise_1.createPool)({
    port: Number(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});
// Connection test function
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield exports.pool.getConnection();
        console.log("MySQL Connection Successful 🧮️");
        connection.release();
    }
    catch (error) {
        console.log("Database Connection Error");
        console.error(error);
        throw error;
    }
});
exports.connectToDatabase = connectToDatabase;
exports.default = exports.pool;
