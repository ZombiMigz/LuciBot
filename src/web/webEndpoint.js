"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebEndpoint = void 0;
var express_1 = __importDefault(require("express"));
var port = 3000;
var endpoint = express_1.default();
function initWebEndpoint() {
    test();
    init();
}
exports.initWebEndpoint = initWebEndpoint;
function test() {
    endpoint.post("/test", function (req, res) {
        console.log(req.body);
    });
}
function init() {
    endpoint.listen(port, function () { return console.log("web endpoint initiated"); });
}
