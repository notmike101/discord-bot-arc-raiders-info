import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { DataService } from '../../dataService/index.js';
import { stringToTitleCase } from '../utils.js';

const dataService = new DataService();

await dataService.initializationPromise;

export const data = new SlashCommandBuilder()
  .setName('item')
  .setDescription('Look up an item')
  .addStringOption((option) => option
    .setName('identifier')
    .setDescription('Item name')
    .setRequired(true)
    .setAutocomplete(true)
  );

/**
 * 
 * @param {ARCData.Weapon} itemInfo 
 * @returns {EmbedBuilder}
 */
const generateWeaponEmbed = (itemInfo) => {
  const embed = new EmbedBuilder();

  embed.setTitle(itemInfo.name.en);
  embed.setDescription(itemInfo.description.en);

  if (itemInfo.imageFilename) {
    embed.setThumbnail(itemInfo.imageFilename);
  }

  if (itemInfo.effects) {
    const effects = Object.entries(itemInfo.effects).map(([name, values]) => ({ name: name, value: values.value.toString(), inline: true }));

    embed.addFields(...effects);
  }

  embed.addFields(
    { name: 'Type', value: itemInfo.type, inline: true },
    { name: 'Rarity', value: itemInfo.rarity, inline: true },
    { name: 'Weight', value: `${itemInfo.weightKg} Kg`, inline: true },
    { name: 'Stack Size', value: itemInfo.stackSize?.toString() ?? '1', inline: true },
    { name: 'Value', value: `${itemInfo.value} credits`, inline: true },
  );

  embed.addFields(
    {
      name: 'Salvages Into',
      value: Object.entries(itemInfo.salvagesInto).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
    },
  );

  if (itemInfo.upgradeCost) {
    embed.addFields(
      {
        name: 'Upgradable',
        value: 'Yes - Weapon Bench',
        inline: true,
      },
      {
        name: 'Recipe',
        value: Object.entries(itemInfo.upgradeCost).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
        inline: true,
      },
    );
  }

  if (itemInfo.recipe) {
    embed.addFields(
      {
        name: 'Craftable',
        value: `Yes - ${stringToTitleCase((typeof itemInfo.craftBench === 'string' ? [itemInfo.craftBench] : itemInfo.craftBench).map((bench) => bench.replaceAll('_', ' ')).join(', '))}`,
        inline: true,
      },
      {
        name: 'Recipe',
        value: Object.entries(itemInfo.recipe).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
        inline: true,
      },
    );
  } else {
    embed.addFields(
      { name: 'Craftable', value: 'No' },
    );
  }

  embed.setFooter({
    text: `Last updated at ${itemInfo.updatedAt}`,
  });

  return embed;
};

  /**
   * @param {ARCData.Item} itemInfo
   */
const generateItemEmbed = (itemInfo) => {
  const embed = new EmbedBuilder();

  embed.setTitle(itemInfo.name.en);
  embed.setDescription(itemInfo.description.en);

  if (itemInfo.imageFilename) {
    embed.setThumbnail(itemInfo.imageFilename);
  }

  if (itemInfo.effects) {
    const effects = Object.entries(itemInfo.effects).map(([name, values]) => ({ name: name, value: values.value.toString(), inline: true }));

    embed.addFields(...effects);
  }

  embed.addFields(
    { name: 'Type', value: itemInfo.type, inline: true },
    { name: 'Rarity', value: itemInfo.rarity, inline: true },
    { name: 'Weight', value: `${itemInfo.weightKg} Kg`, inline: true },
    { name: 'Stack Size', value: itemInfo.stackSize?.toString() ?? '1', inline: true },
    { name: 'Value', value: `${itemInfo.value} credits`, inline: true },
  );

  if (embed.salvagesInto) {
    embed.addFields(
      {
        name: 'Salvages Into',
        value: Object.entries(itemInfo.salvagesInto).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
      },
    );
  }

  if (itemInfo.recipe) {
    embed.addFields(
      {
        name: 'Craftable',
        value: `Yes - ${stringToTitleCase(itemInfo.craftBench.replaceAll('_', ' '))}`,
        inline: true,
      },
      {
        name: 'Recipe',
        value: Object.entries(itemInfo.recipe).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
        inline: true,
      },
    );
  } else {
    embed.addFields(
      { name: 'Craftable', value: 'No' },
    );
  }

  embed.setFooter({
    text: `Last updated at ${itemInfo.updatedAt}`,
  });

  return embed;
};

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction 
 */
export const execute = async (interaction) => {
  if (dataService.initialized === false) {
    await dataService.initializationPromise;
  }

  /** @type {ARCData.Item | ARCData.Weapon} */
  const info = await dataService.getInfo('items', interaction.options.getString('identifier'));
  /** @type {Array<EmbedBuilder>} */
  const embeds = [];

  if (info.isWeapon !== true) {
    embeds.push(generateItemEmbed(info));
  } else if (info.isWeapon === true) {
    embeds.push(generateWeaponEmbed(info));

    if (info.upgradeCost) {
      for (const upgradeItem of Object.keys(info.upgradeCost)) {
        const upgradeItemData = await dataService.getInfo('items', upgradeItem.replaceAll('_', ' '));

        if (upgradeItemData) {
          embeds.push(generateItemEmbed(upgradeItemData));
        }
      }
    }
  }

  if (info.recipe) {
    for (const recipeItem of Object.keys(info.recipe)) {
      const recipeItemData = await dataService.getInfo('items', recipeItem.replaceAll('_', ' '));

      if (recipeItemData) {
        embeds.push(generateItemEmbed(recipeItemData));
      }
    }
  }

  interaction.reply({
    content: `Information for ${interaction.options.getString('identifier')}`,
    embeds: embeds,
  });
};

/**
 * @param {import("discord.js").AutocompleteInteraction} interaction 
 */
export const autocomplete = async (interaction) => {
  const focusedValue = interaction.options.getFocused().toLowerCase();

  if (focusedValue.length < 2) {
    return;
  }

  const options = [];

  for (const item of dataService.getList('items')) {
    if (!item.toLowerCase().startsWith(focusedValue)) continue;

    options.push({ name: item, value: item });
  }

  await interaction.respond(options);
};
