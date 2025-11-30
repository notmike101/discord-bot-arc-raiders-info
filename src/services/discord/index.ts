import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { Client, GatewayIntentBits, Collection, Events, Routes, REST, MessageFlags, type ChatInputCommandInteraction, type AutocompleteInteraction, type Interaction, type CacheType, SlashCommandBuilder } from 'discord.js';

export class DiscordService {
  #client: Client;
  #rest: REST;
  #token: string;
  #clientId: string;
  #guildId: string;
  #initialized = false;
  #commands = new Collection<string, { execute: (interaction: ChatInputCommandInteraction) => Promise<void>; autocomplete: (interaction: AutocompleteInteraction) => Promise<void>, data: SlashCommandBuilder }>();

  constructor({ token, clientId, guildId }: { token: string, clientId: string, guildId: string}) {
    if (!token) {
      throw new Error('Discord bot token not provided.');
    }

    if (!clientId) {
      throw new Error('Discord bot client ID not provided.');
    }

    if (!guildId) {
      throw new Error('Discord bot guilt ID not provided');
    }

    this.#token = token;
    this.#clientId = clientId;
    this.#guildId = guildId;

    this.#client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.#rest = new REST({ version: '10' }).setToken(this.#token);

    this.#client.on(Events.InteractionCreate, this.#handleInteractionCreate.bind(this) as (interaction: Interaction<CacheType>) => void);
  }

  async initialize() {
    if (this.#initialized === true) {
      console.warn('Already initialized, skipping');

      return;
    }

    try {
      this.#client.login(this.#token);
      
      await this.#registerCommands();
    } catch (err) {
      console.error(err);
    }
  }

  async #registerCommands() {
    const commandsPath = path.join(import.meta.dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

    for (const commandFile of commandFiles) {
      const filePath = path.join(commandsPath, commandFile);
      const command = await import(url.pathToFileURL(filePath).toString());

      if ('data' in command && 'execute' in command) {
        this.#commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }

    try {
      this.#rest.put(Routes.applicationGuildCommands(this.#clientId, this.#guildId), { body: [...this.#commands.values()].map((entry) => entry.data.toJSON()) });
    } catch(err) {
      console.error(err);
    }
  }

  async #handleInteractionCreate(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const command = this.#commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    if (interaction.isChatInputCommand()) {
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);

        await interaction[(interaction.replied || interaction.deferred) ? 'followUp' : 'reply']({
          content: 'There was an error while executing this command...',
          flags: MessageFlags.Ephemeral,
        });
      }
    } else if (interaction.isAutocomplete()) {
      try {
        await command.autocomplete(interaction);
      } catch (err) {
        console.error(err);
      }
    }
  }
}