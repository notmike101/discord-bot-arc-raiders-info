# ARC Raiders Discord Bot

## Description

This project is a comprehensive Discord bot designed to assist players of Arc Raiders by providing detailed information about in-game items. It serves as an interface between Discord users and the MetaForge database.

### Key Functionalities:

* **Data Synchronization**: Automatically fetches and caches game data (Weapons, Consumables, Materials, etc.) from the MetaForge API into a Redis database.
* **Slash Commands**: Provides a suite of distinct slash commands (e.g., `/item`, `/weapon-item`, `/material-item`) to search for specific items.
* **Autocomplete**: Integrated autocomplete for item names to ensure accurate queries.
* **Rich Embeds**: Generates detailed Discord embeds displaying item stats, rarity, value, weight, crafting recipes, recycling output, and trader prices.

## Docker Image

* **Application**: Builds locally using `node:24-alpine`.
* **Database**: Uses `redis/redis-stack-server:latest`.

## Configuration & Integration

To configure the bot, you must set up environment variables. The application checks for specific variables on startup to ensure connectivity with Discord and Redis.

### Environment Variables

| Variable | Description |
| --- | --- |
| DISCORD_TOKEN | Your Discord Bot Token found in the Developer Portal. |
| DISCORD_CLIENT_ID | The Application ID of your bot. |
| DISCORD_GUILD_ID | The specific Server (Guild) ID where commands will be registered (for development/private use). |
| REDIS_HOST | The connection string for Redis (e.g., redis://redis:6379 if using Docker). |
| SYNC_INTERVAL | Time in milliseconds to sync data with MetaForge (e.g., 3600000 for 1 hour). Set to 0 to disable auto-sync. |

### Integration

The bot acts as a client to the [MetaForge ARC Raiders API](https://metaforge.app/arc-raiders/api). No manual configuration is required for this integration as the endpoint is hardcoded (https://metaforge.app/api/arc-raiders/items). The bot handles data normalization and caching automatically upon startup.

## Deployment

### Prerequisites

* Docker Engine & Docker Compose
* Node.js v24+ (Only if running locally without Docker)

### Method 1: Docker Compose (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/notmike101/discord-bot-arc-raiders-info.git
cd discord-bot-arc-raiders-info
```

2. **Configure environment**: Create a `.env` file as described in the **Configuration** section. Ensure `REDIS_HOST` is set to `redis://redis:6379`.

3. **Build & Start**

```bash
docker compose up --build -d
```

### Method 2: Local Development (For development)

1. **Install dependencies**

```bash
pnpm install
```

2. **Start Redis**: You must have a local Redis instance running or update .env to point to a remote instance.

3. **Run in Watch Mode**

```bash
pnpm run watch
```

## Notes

**Command Registration**: The bot automatically registers slash commands to the guild specified in `DISCORD_GUILD_ID` upon initialization.

**Data Blacklist**: Specific item IDs (e.g., `refinement-1`) are blacklisted from the cache to prevent data clutter, as defined in MetaforgeService.

**Search Logic**: The bot utilizes Redis sets to categorize items (e.g., `arc:index:weapon-items`) and performs text-based searching against cached JSON data.

## Future Plans

* Quest information
* Traider information
* ARC information
* Events
* Map information
* Tier items
