"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommandHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("../call/customCallHandler");
var settingsHandler_1 = require("../settingsHandler");
var spamCommand_1 = require("./misc/spamCommand");
var pingCall_1 = require("./pingCall/pingCall");
function initCommandHandler() {
    bot_1.client.on('message', function (msg) {
        if (!msg.content.startsWith(settingsHandler_1.prefix))
            return;
        if (msg.author.bot)
            return;
        //special case with custom calls
        if (settingsHandler_1.createCallTextID == msg.channel.id)
            customCallHandler_1.customCallMessage(msg);
        //any channel
        msg.content = msg.content.substring(settingsHandler_1.prefix.length);
        var key = msg.content.split(' ')[0];
        if (key == "spam")
            spamCommand_1.spam(msg);
        if (key == "pingcall" || key == "pc")
            pingCall_1.pingCall(msg);
        //must be in lucibot channel
    });
}
exports.initCommandHandler = initCommandHandler;
