import { DiscordService } from './src/services/discord/index.ts';
import { MetaforgeService } from './src/services/metaforge/index.ts';

if (!process.env.SYNC_INTERVAL) {
  throw new Error('No sync interval provided in .env');
}

if (!process.env.DISCORD_TOKEN) {
  throw new Error('No discord token provided in .env');
}

if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error('No discord client ID provided in .env');
}

if (!process.env.DISCORD_GUILD_ID) {
  throw new Error('No discord guild ID provided in .env');
}

if (!process.env.REDIS_HOST) {
  throw new Error('No redis host provided in .env');
}

const discordService = new DiscordService({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
});

const metaforgeService = new MetaforgeService();

await metaforgeService.reloadData();

discordService.initialize();
