import fs from "fs";

import { defaultSettings, Settings } from "./settings_template";

export let settings: Settings;

// tries to write settings file if it doesn't exist
try {
  fs.writeFileSync("./src/settings.json", JSON.stringify(defaultSettings, null, "\t"), { flag: "wx" });
  console.log("Created new settings file, update channel and role IDs");
} catch {
  console.log("Found settings file");
}

// tries to read settings file
try {
  settings = JSON.parse(fs.readFileSync("./src/settings.json").toString());
  console.log(settings);
} catch (e) {
  console.log("Could not read settings file,  possibly corrupted: ", e);
  process.exit();
}
