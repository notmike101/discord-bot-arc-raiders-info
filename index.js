import { loadEnvFile } from 'node:process';
import { DiscordService } from './src/services/discordService/index.js';
import fs from 'node:fs';
import path from 'node:path';

loadEnvFile('./.env');

process.env.ROOTDIR = import.meta.dirname;
process.env.DATA_FILE = path.join(process.env.ROOTDIR, 'data', 'data.json');
process.env.SYNC_TIME_FILE = path.join(process.env.ROOTDIR, 'data', 'sync-date.txt');

if (!fs.existsSync(process.env.SYNC_TIME_FILE)) {
  fs.writeFileSync(process.env.SYNC_TIME_FILE, '0');
}

if (!fs.existsSync(process.env.DATA_FILE)) {
  fs.writeFileSync(process.env.DATA_FILE, '');
  fs.writeFileSync(process.env.SYNC_TIME_FILE, '0');
}

const discordService = new DiscordService({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
});

discordService.initialize();
