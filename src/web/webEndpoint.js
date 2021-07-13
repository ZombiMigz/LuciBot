"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebEndpoint = void 0;
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var endpoint = express_1.default();
endpoint.use(express_1.default.json());
endpoint.use(cors_1.default());
function initWebEndpoint() {
    test();
    init();
}
exports.initWebEndpoint = initWebEndpoint;
function test() {
    endpoint.post("/test", function (req, res) {
        console.log("post received");
        res.send("received");
        console.log(req.body);
    });
}
function init() {
    endpoint.listen(3000, function () { return console.log("web endpoint initiated"); });
}
