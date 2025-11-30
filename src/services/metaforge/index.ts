import { RedisService, redisService } from '../redis/index.ts';

export class MetaforgeService {
    protected API_ENDPOINT = 'https://metaforge.app/api/arc-raiders/items';

    static BLACKLIST_ITEM_IDS = ['refinement-1'];

    constructor() {
        if (process.env.SYNC_INTERVAL !== '0') {
            setInterval(() => {
                this.reloadData();
            }, parseInt(process.env.SYNC_INTERVAL));
        }
    }

    public normalizeItem(item: MetaForge.ARCItem): MetaForge.ARCItem {
        if (item.ammo_type) {
            item.ammo_type = item.ammo_type.toLowerCase();
        }

        if (item.item_type === 'Weapon' && !item.stat_block.firingMode) {
            item.stat_block.firingMode = 'Unknown';
        }

        return item;
    }

    public async reloadData() {
        this.loadDataIntoRedis();
    }

    protected async fetchAllData(): Promise<Array<MetaForge.ARCItem>> {
        let allItems: Array<MetaForge.ARCItem> = [];
        let page = 1;
        let hasNext = true;
        const backoffDelay = 200;

        while (hasNext) {
            try {
                const res = await fetch(`${this.API_ENDPOINT}?page=${page}&limit=100&includeComponents=true`);
                const resJSON = await res.json();
                const { data, pagination } = resJSON;

                allItems = [...allItems, ...data];

                hasNext = pagination.hasNextPage;
                page++;

                await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            } catch (err) {
                console.error(`  Failed on page ${page}`);
                throw err;
            }
        }

        return allItems;
    }

    private async loadDataIntoRedis() {
        await redisService.connect();
        await redisService.reset();

        try {
            const rawItems = await this.fetchAllData();
            const multi = redisService.client.multi();

            for (const raw of rawItems) {
                const item = this.normalizeItem(raw);
                const key = `${RedisService.KEYS.PREFIX}${item.id}`;

                if (MetaforgeService.BLACKLIST_ITEM_IDS.includes(item.id)) {
                    continue;
                }

                multi.set(key, JSON.stringify(item));
                multi.sAdd(RedisService.KEYS.ALL, item.id);

                switch (item.item_type) {
                    case 'Weapon':
                        multi.sAdd(RedisService.KEYS.WEAPONS, item.id);
                        break;
                    case 'Consumable':
                        multi.sAdd(RedisService.KEYS.CONSUMABLES, item.id);
                        break;
                    case 'Quick Use':
                        multi.sAdd(RedisService.KEYS.QUICK_USE, item.id);
                        break;
                    case 'Throwable':
                        multi.sAdd(RedisService.KEYS.THROWABLES, item.id);
                        break;
                    case 'Ammunition':
                        multi.sAdd(RedisService.KEYS.AMMUNITION, item.id);
                        break;
                    case 'Modification':
                        multi.sAdd(RedisService.KEYS.MODIFICATIONS, item.id);
                        break;
                    case 'Blueprint':
                        multi.sAdd(RedisService.KEYS.BLUEPRINTS, item.id);
                        break;
                    case 'Shield':
                        multi.sAdd(RedisService.KEYS.SHIELDS, item.id);
                        break;
                    case 'Augment':
                        multi.sAdd(RedisService.KEYS.AUGMENTS, item.id);
                        break;
                    case 'Gadget':
                        multi.sAdd(RedisService.KEYS.GADGETS, item.id);
                        break;
                    case 'Key':
                        multi.sAdd(RedisService.KEYS.KEYS, item.id);
                        break;
                    case 'Quest Item':
                        multi.sAdd(RedisService.KEYS.QUESTS, item.id);
                        break;
                    case 'Cosmetic':
                        multi.sAdd(RedisService.KEYS.COSMETICS, item.id);
                        break;
                    case 'Topside Material':
                        multi.sAdd(RedisService.KEYS.TOPSIDE_MATERIALS, item.id);
                        multi.sAdd(RedisService.KEYS.MATERIALS, item.id);
                        break;
                    case 'Basic Material':
                        multi.sAdd(RedisService.KEYS.BASIC_MATERIALS, item.id);
                        multi.sAdd(RedisService.KEYS.MATERIALS, item.id);
                        break;
                    case 'Refined Material':
                        multi.sAdd(RedisService.KEYS.REFINED_MATERIALS, item.id);
                        multi.sAdd(RedisService.KEYS.MATERIALS, item.id);
                        break;
                    case 'Advanced Material':
                        multi.sAdd(RedisService.KEYS.ADVANCED_MATERIALS, item.id);
                        multi.sAdd(RedisService.KEYS.MATERIALS, item.id);
                        break;
                    case 'Recyclable':
                        multi.sAdd(RedisService.KEYS.RECYCLABLES, item.id);
                        break;
                    case 'Nature':
                        multi.sAdd(RedisService.KEYS.NATURE, item.id);
                        break;
                    case 'Trinket':
                        multi.sAdd(RedisService.KEYS.TRINKETS, item.id);
                        break;
                    case 'Misc':
                        multi.sAdd(RedisService.KEYS.MISC, item.id);
                        break;
                }
            };

            await multi.exec();
        } catch (err) {
            console.error('Fatal Error:', err);
        }
    }
}