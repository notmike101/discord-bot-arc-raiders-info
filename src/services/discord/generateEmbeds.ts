import { EmbedBuilder } from 'discord.js';
import { camelCaseToTitleCase } from '../../utils.ts';

export const generateMiscEmbed = (item: MetaForge.ARCItem) => {
  const embed = new EmbedBuilder();

  embed.setTitle(item.name);

  if (item.icon) {
    embed.setThumbnail(item.icon);
  }

  embed.addFields([
    { name: 'Type', value: `${item.item_type}${item.subcategory ? `/${item.subcategory}` : ''}`, inline: true },
    { name: 'Rarity', value: item.rarity, inline: true },
    { name: 'Value', value: `${item.value.toLocaleString()} credits`, inline: true },
    { name: 'Weight', value: `${item.stat_block.weight} kg`, inline: true },
  ]);

  let itemDescription = `${item.description} ${item.flavor_text}`;

  if (item.components && item.components.length > 0) {
    itemDescription += `\n### Crafting Recipe:\n${item.components.map((elm) => `* ${elm.component.name} x${elm.quantity}`).join('\n')}`;
  }

  if (item.recycle_components && item.recycle_components.length > 0) {
    itemDescription += `\n\n**Recycles Into**:\n${item.recycle_components.map((elm) => `* ${elm.component.name} x${elm.quantity}`).join('\n')}`
  }

  if (item.used_in && Object.keys(item.used_in).length > 0) {
    itemDescription += `\n\n**Used To Craft**:\n${Object.values(item.used_in).map((elm) => `* ${elm.item.name}`).join('\n')}`;
  }

  if (item.sold_by && item.sold_by.length > 0) {
    itemDescription += `\n\n**Sold By**:\n${item.sold_by.map((elm) => `${elm.trader_name}: ${elm.price.toLocaleString()}`)}`
  }

  /*
  if (item.stat_block && Object.keys(item.stat_block).length > 0) {
    const blocks: Array<Array<string>> = [];
    let blockIndex = 0;
    const entries = Object.entries(item.stat_block);
    const finalizedLines: Array<string> = [];
    const lineLimit = 2;

    for (let i = 1; i <= entries.length; ++i) {
      if (!blocks[blockIndex]) {
        blocks[blockIndex] = [];
      }

      blocks[blockIndex].push(`**${camelCaseToTitleCase(entries[i - 1][0])}**: ${entries[i - 1][1]}`);

      if (i % lineLimit === 0) {
        finalizedLines.push(blocks[blockIndex].join('   '));
        blockIndex++;
      }
    }

    itemDescription += `\n\n**Stats**:\n${finalizedLines.join('\n')}`
  }
  */

  embed.setDescription(itemDescription);

  embed.setURL(`https://metaforge.app/arc-raiders/database/item/${item.id}`);
  embed.setAuthor({
    name: 'MetaForge',
    url: 'https://metaforge.app/arc-raiders/',
  });

  embed.setTimestamp(new Date(item.updated_at));

  embed.setFooter({
    text: `Last updated`,
  });

  return embed;
};

export const generateWeaponEmbed = (item: MetaForge.WeaponItem) => {
  const embed = new EmbedBuilder();

  embed.setTitle(item.name);

  if (item.icon) {
    embed.setThumbnail(item.icon);
  }

  embed.addFields([
    { name: 'Type', value: `${item.item_type}/${item.subcategory}/${item.ammo_type}`, inline: true },
    { name: 'Rarity', value: item.rarity, inline: true },
    { name: 'Value', value: `${item.value.toLocaleString()} credits`, inline: true },
    { name: 'Weight', value: `${item.stat_block.weight} kg`, inline: true },
  ]);

  embed.addFields(
    { name: 'Firing Mode', value: item.stat_block.firingMode, inline: true },
    { name: 'Fire Rate', value: item.stat_block.fireRate.toString(), inline: true },
    { name: 'Stability', value: item.stat_block.stability.toString(), inline: true },
    { name: 'Damage', value: item.stat_block.damage.toString(), inline: true },
    { name: 'Range', value: item.stat_block.range.toString(), inline: true },
    { name: 'Stability', value: item.stat_block.stability.toString(), inline: true },
  );

  let itemDescription = `${item.description} ${item.flavor_text}`;

  if (item.components && item.components.length > 0) {
    itemDescription += `\n### Crafting Recipe:\n${item.components.map((elm) => `* ${elm.component.name} x${elm.quantity}`).join('\n')}`;
  }

  if (item.recycle_components && item.recycle_components.length > 0) {
    itemDescription += `\n\n**Recycles Into**:\n${item.recycle_components.map((elm) => `* ${elm.component.name} x${elm.quantity}`).join('\n')}`
  }

  if (item.used_in && Object.keys(item.used_in).length > 0) {
    itemDescription += `\n\n**Used To Craft**:\n${Object.values(item.used_in).map((elm) => `* ${elm.item.name}`).join('\n')}`;
  }

  if (item.mods && item.mods.length > 0) {
    itemDescription += `\n\n**Available Mods**:\n${item.mods.map((elm) => `* ${elm.mod.name}`).join('\n')}`;
  }

  if (item.sold_by && item.sold_by.length > 0) {
    itemDescription += `\n\n**Sold By**:\n${item.sold_by.map((elm) => `${elm.trader_name}: ${elm.price.toLocaleString()}`)}`
  }

  embed.setDescription(itemDescription);

  embed.setURL(`https://metaforge.app/arc-raiders/database/item/${item.id}`);
  embed.setAuthor({
    name: 'MetaForge',
    url: 'https://metaforge.app/arc-raiders/',
  });

  embed.setTimestamp(new Date(item.updated_at));

  embed.setFooter({
    text: `Last updated`,
  });

  return embed;
};
