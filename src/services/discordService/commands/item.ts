import { EmbedBuilder, SlashCommandBuilder, type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { DataService } from '../../dataService/index.ts';
import { stringToTitleCase } from '../utils.ts';

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


const generateWeaponEmbed = (itemInfo: ARCData.Weapon) => {
  const embed = new EmbedBuilder();

  embed.setTitle(itemInfo.name.en ?? '');
  embed.setDescription(itemInfo.description.en ?? '');

  if (itemInfo.imageFilename) {
    embed.setThumbnail(itemInfo.imageFilename);
  }

  if (itemInfo.effects) {
    const effects = Object.entries(itemInfo.effects).map(([name, values]) => ({ name: name, value: values.value?.toString() ?? 'Unknown', inline: true }));

    embed.addFields(...effects);
  }

  embed.addFields(
    { name: 'Type', value: itemInfo.type, inline: true },
    { name: 'Rarity', value: itemInfo.rarity, inline: true },
    { name: 'Weight', value: `${itemInfo.weightKg} Kg`, inline: true },
    { name: 'Value', value: `${itemInfo.value} credits`, inline: true },
  );

  if (itemInfo.salvagesInto) {
    embed.addFields(
      {
        name: 'Salvages Into',
        value: Object.entries(itemInfo.salvagesInto).map(([itemName, itemCount]) => `- **${stringToTitleCase(itemName.replaceAll('_', ' '))}**: ${itemCount}`).join('\n'),
      },
    );
  }

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
        value: `Yes - ${stringToTitleCase((typeof itemInfo.craftBench! === 'string' ? [itemInfo.craftBench!] : itemInfo.craftBench!).map((bench) => bench.replaceAll('_', ' ')).join(', '))}`,
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

const generateItemEmbed = (itemInfo: ARCData.Item) => {
  const embed = new EmbedBuilder();

  embed.setTitle(itemInfo.name.en ?? '');
  embed.setDescription(itemInfo.description.en ?? '');

  if (itemInfo.imageFilename) {
    embed.setThumbnail(itemInfo.imageFilename);
  }

  if (itemInfo.effects) {
    const effects = Object.entries(itemInfo.effects).map(([name, values]) => ({ name: name, value: values.value?.toString() ?? '', inline: true }));

    embed.addFields(...effects);
  }

  embed.addFields(
    { name: 'Type', value: itemInfo.type, inline: true },
    { name: 'Rarity', value: itemInfo.rarity, inline: true },
    { name: 'Weight', value: `${itemInfo.weightKg} Kg`, inline: true },
    { name: 'Stack Size', value: itemInfo.stackSize?.toString() ?? '1', inline: true },
    { name: 'Value', value: `${itemInfo.value} credits`, inline: true },
  );

  if (itemInfo.salvagesInto) {
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

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (dataService.initialized === false) {
    await dataService.initializationPromise;
  }

  const info = await dataService.getInfo('items', interaction.options.getString('identifier')!);

  if (!info) return;

  const embeds: Array<EmbedBuilder> = [];

  if ('isWeapon' in info) {
    embeds.push(generateWeaponEmbed(info));

    if (info.upgradeCost) {
      for (const upgradeItem of Object.keys(info.upgradeCost)) {
        const upgradeItemData = await dataService.getInfo('items', upgradeItem.replaceAll('_', ' ')) as ARCData.Item;

        if (upgradeItemData) {
          embeds.push(generateItemEmbed(upgradeItemData));
        }
      }
    }
  } else {
    embeds.push(generateItemEmbed(info));
  }

  if (info.recipe) {
    for (const recipeItem of Object.keys(info.recipe)) {
      const recipeItemData = await dataService.getInfo('items', recipeItem.replaceAll('_', ' ')) as ARCData.Item;

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

export const autocomplete = async (interaction: AutocompleteInteraction) => {
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
