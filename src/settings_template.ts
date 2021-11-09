export interface Settings {
  "Channel IDs": {
    "Create Call Voice": string;
    "Create Call Text": string;
    "Custom Call Category": string;
    "Announcements Text": string;
    AFK: string;
    Debug: string;
  };
  Birthday: {
    "Birthday Role": string;
  };
  "Custom Call Names": string[];
  Token: string;
  Prefix: string;
}

export let emptySettings = {
  "Channel IDs": {
    "Create Call Voice": "0",
    "Create Call Text": "0",
    "Custom Call Category": "0",
    AFK: "0",
    Debug: "0",
    "Announcements Text": "0",
  },
  "Custom Call Names": ["Call"],
  Birthday: {
    "Birthday Role": "0",
  },
  Token: "0",
  Prefix: ".",
};
