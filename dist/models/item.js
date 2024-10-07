"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const itemSchema = new mongoose_2.Schema({
    title: {
        type: String,
        required: true
    },
    store: {
        type: String,
    },
    person: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
});
const Item = mongoose_1.default.model('Item', itemSchema);
exports.default = Item;
