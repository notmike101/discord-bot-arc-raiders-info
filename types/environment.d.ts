declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DISCORD_TOKEN: string;
      readonly DISCORD_CLIENT_ID: string;
      readonly DISCORD_GUILD_ID: string;
      readonly REDIS_HOST: string;
      readonly SYNC_INTERVAL: string;
    }
  }
}

export {};
