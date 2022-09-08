"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = exports.parse = exports.getCookie = exports.createCookie = void 0;
var VsCookie_1 = __importDefault(require("./VsCookie"));
var createCookie = VsCookie_1.default.createCookie;
exports.createCookie = createCookie;
var getCookie = VsCookie_1.default.getCookie;
exports.getCookie = getCookie;
var parse = VsCookie_1.default.parse;
exports.parse = parse;
var sign = VsCookie_1.default.sign;
exports.sign = sign;
var verify = VsCookie_1.default.verify;
exports.verify = verify;
