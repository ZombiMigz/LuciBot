"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommandHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("../call/customCallHandler");
function initCommandHandler() {
    bot_1.client.on('message', function (msg) {
        if (!msg.content.startsWith(bot_1.prefix))
            return;
        if (msg.author.bot)
            return;
        if (bot_1.settings["Call IDs"]["Custom Call Creator"] == msg.channel.id)
            customCallHandler_1.customCallMessage(msg);
    });
}
exports.initCommandHandler = initCommandHandler;
