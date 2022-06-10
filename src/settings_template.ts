export type Settings = {
  customCallsModule: {
    enabled: boolean;
    voiceCreateID: string;
    textCreateID: string;
    category: string;
    names: string[];
  };
  channelIDs: {
    announcements: string;
    AFK: string;
    debug: string;
  };
  birthdayModule: {
    enabled: boolean;
    roleID: string;
  };
  token: string;
  prefix: string;
};

export let defaultSettings: Settings = {
  customCallsModule: {
    enabled: false,
    voiceCreateID: "",
    textCreateID: "",
    category: "",
    names: ["Call"],
  },
  channelIDs: {
    announcements: "",
    AFK: "",
    debug: "",
  },
  birthdayModule: {
    enabled: false,
    roleID: "",
  },
  token: "",
  prefix: ".",
};
