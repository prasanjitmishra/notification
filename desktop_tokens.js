"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");

var DesktopToken = new mongoose_1.Schema({
    endpoint: {
        type: String,
        default: "",
        required: true
    },
    p256dh: {
        type: String,
        default: "",
        required: true
    },
    auth: {
        type: String,
        default: "",
        required: true
    }
});
exports.default = mongoose_1.model('DesktopToken', DesktopToken);