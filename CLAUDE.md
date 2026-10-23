# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Troll 9000 is a small Discord bot for a private friend group. The bot lives in [app.js](app.js), with pure helpers in [dice.js](dice.js) (dice-expression parser) and [scryfall.js](scryfall.js) (Scryfall API client). It uses **discord.js v14**: intents via `GatewayIntentBits`, events via the `Events` enum, and `EmbedBuilder` / `SlashCommandBuilder`. The v12 patterns (`new Discord.Client()` with no intents, `'message'`, `.array()` on collections) no longer work. ESLint is set to ES2019, so no `?.` or `??`.

## Commands

```
npm install
npm run start        # node app.js — logs in and runs until killed
npx eslint app.js    # lint (eslint:recommended, ES2019, node env)
```

There are no tests. `npm test` is the npm placeholder and exits 1. [.vscode/launch.json](.vscode/launch.json) has a debug config that launches `app.js`.

## Configuration

The bot reads secrets and Discord user IDs from a `.env` file in the project root (gitignored) via `dotenv`. Keys are uppercase: `TOKEN`, optional `GUILD_ID` (registers slash commands in that server instantly; without it they register globally and can take up to an hour to appear), plus `<NAME>_UID` for users the message handler reacts to (e.g. `TIM_UID`).

`package-lock.json` is gitignored.

## How app.js is organized

- **Message handler** (`client.on('message')`): runs on every message the bot can see. It reacts to specific users by comparing `msg.author.id` with UIDs from `.env`, and replies with a joke on about 1% of messages. Different behaviours get switched on and off by commenting blocks in and out, so check what is commented out before assuming a feature is live.
- **Slash commands** (`commands` array → `Events.InteractionCreate`): `/roll` (dice via `dice.evaluate`) and `/mtg` (Scryfall fuzzy card lookup with autocomplete). Commands are re-registered on every startup in the `ClientReady` handler.
- **Secret Santa** (`/santa player1:@a player2:@b player3:@c …` → `secretSanta` → `messagePlayers`): slash commands can't take a variable number of mentions, so the command has 25 user options (the first 3 required, the rest optional). Duplicates count once, bots are rejected, and server channels only. It shuffles the players into a gift circle and DMs each giver the display name of their giftee, then replies with how many DMs landed and who couldn't be reached. Pairings are logged in rot13 so the operator can recover them without seeing them by accident.
