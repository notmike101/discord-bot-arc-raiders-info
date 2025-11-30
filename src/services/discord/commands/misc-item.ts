import { SlashCommandBuilder, MessageFlags, type EmbedBuilder, type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { RedisService, redisService } from '../../redis/index.ts';
import { generateMiscEmbed } from '../generateEmbeds.ts';

export const data = new SlashCommandBuilder()
  .setName('misc-item')
  .setDescription('Look up a misc item')
  .addStringOption((option) => option
    .setName('identifier')
    .setDescription('Item name')
    .setRequired(true)
    .setAutocomplete(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const info = await redisService.getItemById(`${RedisService.KEYS.PREFIX}${interaction.options.getString('identifier')}`) as MetaForge.MiscItem;

  if (!info) {
    interaction.reply({
      content: `Item ${interaction.options.getString('identifier')} not found...`,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  const embeds: Array<EmbedBuilder> = [];

  embeds.push(generateMiscEmbed(info));

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

  const searchResults = await redisService.search(RedisService.KEYS.MISC, searchQuery, 'name', (data) => data.toLowerCase());
  const options: Array<{ name: string, value: string }> = [];

  for (const searchResult of searchResults) {
    options.push({ name: searchResult.name, value: searchResult.id });
  }

  options.sort((a, b) => a.name.localeCompare(b.name))

  await interaction.respond(options);
};
