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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemService = void 0;
const db_1 = __importDefault(require("../config/db"));
class MenuItemService {
    constructor() {
        this.pool = db_1.default;
    }
    getAllMenuItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT m.*, mi.item_image 
            FROM menu_items m 
            LEFT JOIN menu_item_images mi ON m.item_id = mi.menu_item_id
        `;
            try {
                const [results] = yield this.pool.query(query);
                return results.map(item => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    item_desc: item.item_desc,
                    price: item.price,
                    item_type: item.item_type
                }));
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch items: ${error.message}`);
                }
                throw new Error('Unknown database error');
            }
        });
    }
    createMenuItem(menuItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const { item_name, item_desc, price, item_type } = menuItem;
            const [result] = yield this.pool.query('INSERT INTO menu_items (item_name, item_desc, price, item_type) VALUES (?, ?, ?, ?)', [item_name, item_desc, price, item_type]);
            return result.insertId;
        });
    }
    deleteMenuItem(item_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.query('DELETE FROM menu_items WHERE item_name = ?', [item_name]);
            return result.affectedRows;
        });
    }
}
exports.MenuItemService = MenuItemService;
