"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommandHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("../call/customCallHandler");
var settingsHandler_1 = require("../settingsHandler");
function initCommandHandler() {
    bot_1.client.on('message', function (msg) {
        if (!msg.content.startsWith(settingsHandler_1.prefix))
            return;
        if (msg.author.bot)
            return;
        if (settingsHandler_1.createCallTextID == msg.channel.id)
            customCallHandler_1.customCallMessage(msg);
        msg.content = msg.content.substring(settingsHandler_1.prefix.length);
    });
}
exports.initCommandHandler = initCommandHandler;
