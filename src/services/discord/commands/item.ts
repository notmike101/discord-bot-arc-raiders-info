import { SlashCommandBuilder, MessageFlags, type EmbedBuilder, type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { RedisService, redisService } from '../../redis/index.ts';
import { generateWeaponEmbed, generateMiscEmbed } from '../generateEmbeds.ts';

export const data = new SlashCommandBuilder()
  .setName('item')
  .setDescription('Look up an item')
  .addStringOption((option) => option
    .setName('identifier')
    .setDescription('Item name')
    .setRequired(true)
    .setAutocomplete(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const item = await redisService.getItemById(`${RedisService.KEYS.PREFIX}${interaction.options.getString('identifier')}`);

  if (!item) {
    interaction.reply({
      content: `Item ${interaction.options.getString('identifier')} not found...`,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  const embeds: Array<EmbedBuilder> = [];

  if (item.item_type === 'Weapon') {
    embeds.push(generateWeaponEmbed(item));
  } else {
    embeds.push(generateMiscEmbed(item));
  }

  interaction.reply({
    embeds,
  });
};

export const autocomplete = async (interaction: AutocompleteInteraction) => {
  const searchQuery = interaction.options.getFocused().toLowerCase();

  if (searchQuery.length <= 2) {
    await interaction.respond([{ name: 'Minimum autocomplete length is 3', value: '' }]);

    return;
  }

  const searchResults = await redisService.search(RedisService.KEYS.ALL, searchQuery, 'name', (data) => data.toLowerCase());
  const options: Array<{ name: string, value: string }> = [];

  for (const searchResult of searchResults) {
    options.push({ name: searchResult.name, value: searchResult.id });
  }

  options.sort((a, b) => a.name.localeCompare(b.name))

  await interaction.respond(options);
};
