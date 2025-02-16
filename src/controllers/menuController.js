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
exports.deleteMenuItem = exports.createMenuItem = exports.getAllMenuItems = void 0;
const menuService_1 = require("../services/menuService");
const menuItemService = new menuService_1.MenuItemService();
const getAllMenuItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield menuItemService.getAllMenuItems();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.getAllMenuItems = getAllMenuItems;
const createMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newItemId = yield menuItemService.createMenuItem(req.body);
        res.status(201).json({ item_id: newItemId });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.createMenuItem = createMenuItem;
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_name } = req.body;
        const affectedRows = yield menuItemService.deleteMenuItem(item_name);
        res.json({ affectedRows });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.deleteMenuItem = deleteMenuItem;
