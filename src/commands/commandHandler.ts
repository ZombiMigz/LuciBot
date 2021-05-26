import { client } from "../../bot";

export function initCommandHandler(prefix: string) {
    client.on('message', msg => {
        if (!msg.content.startsWith(prefix)) return;
    })
}