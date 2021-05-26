"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommandHandler = void 0;
var bot_1 = require("../../bot");
function initCommandHandler(prefix) {
    bot_1.client.on('message', function (msg) {
        if (!msg.content.startsWith(prefix))
            return;
    });
}
exports.initCommandHandler = initCommandHandler;
