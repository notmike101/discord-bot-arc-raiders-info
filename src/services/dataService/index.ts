import fs from 'node:fs';

const repoInfo = {
  owner: 'RaidTheory',
  repo: 'arcraiders-data',
};

export class DataService {
  #storage = new Map<string, Map<string, string>>();
  #initialized = false;
  #initializedPromise: Promise<void>;
  #initializedResolve: (value: void | PromiseLike<void>) => void;
  #lastUpdate = parseInt(fs.readFileSync(process.env.SYNC_TIME_FILE, 'utf8'));
  #syncInterval = 86400 * 1_000; // 24 hours

  get initialized() {
    return this.#initialized;
  }

  get initializationPromise() {
    return this.#initializedPromise;
  }

  constructor() {
    const { promise, resolve } = Promise.withResolvers<void>();

    this.#initializedPromise = promise;
    this.#initializedResolve = resolve;

    this.refreshData();

    setInterval(() => {
      this.refreshData();
    }, this.#syncInterval);
  }

  getList(type: string) {
    return [...this.#storage.get(type)?.keys() ?? []];
  }

  async #apiRequest<T>(path: string): Promise<T> {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        'Accept': 'application/vnd.github.object',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
      }
    });

    const resJson = await res.json();

    return resJson;
  }

  async refreshData() {
    if (this.#lastUpdate + this.#syncInterval > Date.now()) {
      this.#loadSavedData();

    } else {
      await this.#loadRemoteData('items');

      fs.writeFileSync(process.env.SYNC_TIME_FILE, Date.now().toString());
    }

    this.#initializedResolve();
  }

  #loadSavedData() {
    const savedData = JSON.parse(fs.readFileSync(process.env.DATA_FILE, 'utf8')) as ARCData.FullData;

    for (const [key, value] of Object.entries(savedData)) {
      this.#storage.set(key, new Map(Object.entries(value)));
    }
  }

  async #loadRemoteData(type: string) {
    const { entries: data } = await this.#apiRequest<{ entries: Array<{ name: string }> }>(`/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${type}`);
    const finalizedData = (() => {
      try {
        return JSON.parse(fs.readFileSync(process.env.DATA_FILE, 'utf8'));
      } catch {
        return {};
      }
    })();

    for (const entry of data) {
      const entryName = entry.name.replace('.json', '').replaceAll('_', ' ').toLowerCase();

      if (!finalizedData[type]) {
        finalizedData[type] = {};
      }

      finalizedData[type][entryName] = `/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${type}/${entry.name}`;
    }

    await new Promise<void>((resolve) => {
      fs.writeFile(process.env.DATA_FILE, JSON.stringify(finalizedData), () => {
        resolve();
      });
    });
  }

  async getInfo(type: string, identifier: string) {
    await this.#initializedPromise;

    const entryName = identifier.toLowerCase();

    if (!this.#storage.get(type)?.has(entryName)) {
      return null;
    }

    const data = await this.#apiRequest<{ content: string }>(this.#storage.get(type)!.get(entryName)!);

    return JSON.parse(atob(data.content)) as ARCData.Weapon | ARCData.Item;
  }
}
