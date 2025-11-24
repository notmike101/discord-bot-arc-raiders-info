declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly GEMINI_PROJECT_NAME: string;
      readonly GEMINI_PROJECT_NUMBER: string;
      readonly GEMINI_PROJECT_ID: string;
      readonly GEMINI_API_KEY: string;
      readonly DISCORD_TOKEN: string;
      readonly DISCORD_CLIENT_ID: string;
      readonly DISCORD_GUILD_ID: string;
      readonly GITHUB_API_TOKEN: string;
      ROOTDIR: string;
      DATA_FILE: string;
      SYNC_TIME_FILE: string;
    }
  }
}

export {};
