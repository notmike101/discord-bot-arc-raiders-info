import { createClient, type RedisClientType } from 'redis';

export class RedisService {
    public client: RedisClientType;

    public static KEYS = {
        PREFIX: 'arc:item:',
        ALL: 'arc:index:all-items',
        WEAPONS: 'arc:index:weapon-items',
        CONSUMABLES: 'arc:index:consumable-items',
        QUICK_USE: 'arc:index:quick-use-items',
        THROWABLES: 'arc:index:throwable-items',
        AMMUNITION: 'arc:index:ammunition-items',
        MODIFICATIONS: 'arc:index:modification-items',
        BLUEPRINTS: 'arc:index:blueprint-items',
        SHIELDS: 'arc:index:shield-items',
        AUGMENTS: 'arc:index:augment-items',
        GADGETS: 'arc:index:gadget-items',
        KEYS: 'arc:index:key-items',
        QUESTS: 'arc:index:quest-items',
        COSMETICS: 'arc:index:cosmetic-items',
        MATERIALS: 'arc:index:material-items',
        TOPSIDE_MATERIALS: 'arc:index:topside-material-items',
        BASIC_MATERIALS: 'arc:index:basic-material-items',
        REFINED_MATERIALS: 'arc:index:refined-material-items',
        ADVANCED_MATERIALS: 'arc:index:advanced-material-items',
        RECYCLABLES: 'arc:index:recyclable-items',
        NATURE: 'arc:index:nature-items',
        TRINKETS: 'arc:index:trinket-items',
        MISC: 'arc:index:misc-items',
    };

    constructor(url: string = process.env.REDIS_HOST) {
        this.client = createClient({ url });

        this.client.on('error', (err) => {
            console.error('Redis service error', err);
        });

        this.connect();
    }

    get connected () {
        return this.client.isOpen;
    }

    public async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect() {
        if (this.client.isOpen) {
            await this.client.close();
        }
    }

    private async clearIndexes() {
        await this.client.del(Object.values(RedisService.KEYS));
    }

    private async flushdb() {
        await this.client.flushAll();
    }

    public async reset() {
        await this.clearIndexes();
        await this.flushdb();
    }

    public async getCount(id: string) {
        const key = `${RedisService.KEYS.PREFIX}${id}`;

        return await this.client.sCard(key)
    }

    public async getItemById(id: string): Promise<MetaForge.ARCItem | null> {
        if (!id.startsWith(RedisService.KEYS.PREFIX)) {
            id = `${RedisService.KEYS.PREFIX}${id}`;
        }

        const item = await this.client.get(id);

        if (!item) return null;

        try {
            return JSON.parse(item) as MetaForge.ARCItem;
        } catch {
            return null;
        }
    }

    public async getItemsByType(type: keyof typeof RedisService.KEYS | string): Promise<Array<MetaForge.ARCItem>> {
        let indexKey;

        if (type in RedisService.KEYS) {
            indexKey = RedisService.KEYS[type as keyof typeof RedisService.KEYS];
        } else {
            indexKey = type;
        }

        const ids = await this.client.sMembers(indexKey);
        const itemKeys: Array<string> = [];

        for (const id of ids) {
            itemKeys.push(`${RedisService.KEYS.PREFIX}${id}`);
        }
        
        const results = await this.client.mGet(itemKeys);
        const output: Array<MetaForge.ARCItem> = [];
        
        for (const jsonString of results) {
            if (!jsonString) continue;

            try {
                const item = JSON.parse(jsonString);

                output.push(item);
            } catch {
                console.warn('Skipping malfored JSON');
            }
        }

        return output;
    }

    public async search(type: keyof typeof RedisService.KEYS | string, query: any, queryField: keyof MetaForge.ARCItem = 'id', handler?: (data: any) => typeof data): Promise<Array<MetaForge.ARCItem>> {
        const allType = await this.getItemsByType(type);
        const output: Array<MetaForge.ARCItem> = [];

        for (const item of allType) {
            if (!(queryField in item)) continue;

            const fieldData = handler ? handler(item[queryField]) : item[queryField];

            if (typeof fieldData === 'string' && fieldData.startsWith(query)) {
                output.push(item);
            } else if (typeof fieldData === typeof query && fieldData === query) {
                output.push(item);
            }
        }

        return output;
    }
}

export const redisService = new RedisService();
