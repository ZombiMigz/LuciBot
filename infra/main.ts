import { App } from "cdktf";
import { LuciBotStack } from "./luciBotStack";

const app = new App();
new LuciBotStack(app, "lucibot");
app.synth();
